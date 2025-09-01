import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import Avatar from "../Shared/Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({ toggleSidebar }) {
  const { activeUser, messages, fetchMessages, user } = useContext(AppContext);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
    }
  }, [activeUser]);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeUser]);

  if (!activeUser) {
    return (
      <div className="flex flex-1 justify-center items-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  const chatMessages = messages[activeUser.id] || [];

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-white">
        <Avatar name={activeUser.name} />
        <span className="font-bold">{activeUser.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatMessages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            isMe={msg.sender === user.id}
            content={msg.content}
          />
        ))}
         <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
