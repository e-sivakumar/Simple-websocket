// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../utils/api";
import { getToken, setToken as saveToken, removeToken } from "../utils/auth";
import toast from "react-hot-toast";

export const AppContext = createContext();

const basePath = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:5000"

export function AppProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({}); // {userId: [msg]}
  const [socket, setSocket] = useState(null);

  // --- Auth ---
  const login = async (credentials) => {
    try {
      const res = await api.post("/user/login", credentials);
      saveToken(res.data.token);
      setToken(res.data.token);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data || "Login failed");
    }
  };

  const signup = async (data) => {
    try {
      await api.post("/user/sign-up", data);
      toast.success("Signup successful! Please login.");
    } catch (err) {
      toast.error(err.response?.data || "Signup failed");
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    setUsers([]);
    setActiveUser(null);
    setMessages({});
    if (socket) socket.disconnect();
    toast("Logged out");
  };

  // --- Data fetching ---
  const fetchUserDetails = async () => {
    const res = await api.get("/user");
    setUser(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/user/list");
    const data = res.data.users || [];
    const result = [...data].sort((a, b) => {
      const timeA = a.latestMessageTime ? new Date(a.latestMessageTime).getTime() : 0;
      const timeB = b.latestMessageTime ? new Date(b.latestMessageTime).getTime() : 0;
  
      return timeB - timeA;
    });
    setUsers(result);
  };

  const fetchMessages = async (receiverId) => {
    const res = await api.get(`/message/list/${receiverId}`);
    setMessages((prev) => ({ ...prev, [receiverId]: res.data.messages }));
  };

  // --- Socket ---
  const initSocket = (tok) => {
    const s = io(basePath, { auth: { token: tok } });

    s.on("connect", () => {
      s.emit("authenticate", tok);
    });

    s.on("receive_message", (msg) => {
      setMessages((prev) => {
        const list = prev[msg.sender] || [];
        return { ...prev, [msg.sender]: [...list, msg] };
      });
      setUsers((prev)=>{
        const updatedList = prev.map((user)=>{
          if(user.id === msg.sender){
            return {
              ...user,
              latestMessage: msg.content,
              latestMessageTime: msg.createdAt
            }
          }
          else{
            return user
          }
        })
        updatedList.sort((a,b)=> new Date(b.latestMessageTime) - new Date(a.latestMessageTime))
        return updatedList
      })
    });

    s.on("app_error", (err) => {
      toast.error(err.message || "Socket error");
    });

    setSocket(s);
  };

  const sendMessage = (receiverId, content) => {
    if (!socket) return;
    const msg = {
      to: receiverId,
      token,
      content,
    };
    socket.emit("send_message", msg);

    // optimistic UI
    setMessages((prev) => {
      const list = prev[receiverId] || [];
      return {
        ...prev,
        [receiverId]: [...list, { sender: user.id, receiverId, content, createdAt: new Date() }],
      };
    });
    setUsers((prev)=>{
      const updatedList = prev.map((user)=>{
        if(user.id === receiverId){
          return {
            ...user,
            latestMessage: content,
            latestMessageTime: new Date()
          }
        }
        else{
          return user
        }
      })
      const result = updatedList.sort((a,b)=> new Date(b.latestMessageTime) - new Date(a.latestMessageTime))
      return result
    })
  };

  // --- Bootstrap ---
//   useEffect(() => {
//     if (token) {
//       fetchUserDetails();
//       fetchUsers();
//       initSocket(token);
//     }
//   }, [token]);
// inside useEffect
useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          await fetchUserDetails();
          await fetchUsers();
          initSocket(token);
        } catch (err) {
          // invalid token → reset and show login
          removeToken();
          setToken(null);
          setUser(null);
          toast.error("Session expired, please log in again.");
        }
      }
    };
    init();
  }, [token]);
  

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        users,
        activeUser,
        setActiveUser,
        messages,
        fetchMessages,
        login,
        signup,
        logout,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
