import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Avatar from "../Shared/Avatar";

export default function Sidebar({ closeSidebar }) {
  const { users, setActiveUser, logout, user } = useContext(AppContext);
  // const convertTime = (givenDate)=>{
  //   const date = new Date(givenDate);
  //   const timeOnly = date.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  //   return timeOnly
  // }
  const formatDateOrTime = (givenDate) => {
    const date = new Date(givenDate);
    const now = new Date();
  
    // Normalize to midnight for day-based comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
    // Difference in days
    const diffTime = today - target;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
    if (target.getTime() === today.getTime()) {
      // Today → time only
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (target.getTime() === yesterday.getTime()) {
      // Yesterday
      return "Yesterday";
    } else if (diffDays < 7) {
      // Within this week range → weekday name
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      // Older → DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Profile + Logout */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar name={user?.name || "Me"} />
          <span className="font-bold">
            {/* {user?.name} */}
            {(user?.name).slice(0,1).toUpperCase()+(user?.name).slice(1)}
            </span>
        </div>
        <div className="flex flex-col gap-2 items-end ">
        <button 
        className="block md:hidden bg-slate-100 p-2 rounded-full cursor-pointer "
        onClick={
          ()=>{
            closeSidebar()
          }
        }
        >
          <img src="/close.png" className="w-5 h-5" alt="" />
        </button>
        <button onClick={logout} className="text-sm text-red-500">
          Logout
        </button>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div 
          className="flex flex-col 
          hover:bg-gray-100
          hover:drop-shadow-lg
          rounded-xl
           cursor-pointer p-3 my-1 w-full"
          onClick={() => {
            setActiveUser(u);
            closeSidebar();
          }}
           >
          <div
            key={u.id}
            className="flex gap-2 p-0  w-full"
          >
            <Avatar name={u.name} isOnline={u.isOnline} />
            <div className="flex flex-col w-full px-1 max-w-[80%] ">
            <div className="flex w-full justify-between">
              {/* {u.name} */}
              <span className=" max-w-[50%] truncate"> 
                {(u?.name).slice(0,1).toUpperCase()+(u?.name).slice(1)}
                 </span>
          {u?.latestMessageTime &&<div className=" " >{formatDateOrTime(u.latestMessageTime)}</div>}

              </div>
          {u?.latestMessage &&<div className=" w-[70%] truncate " >{u.latestMessage}</div>}
          </div>

          </div>
          </div>
        ))}
      </div>
    </div>
  );
}
