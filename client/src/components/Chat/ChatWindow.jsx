import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import Avatar from "../Shared/Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function toDateKey(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // e.g. "2025-08-31"
}

// Human label for the date key: Today / Yesterday / "Month day, year"
function getDateLabel(dateKey) {
  const keyDate = new Date(dateKey + "T00:00:00"); // safe local midnight
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (toDateKey(today) === dateKey) return "Today";
  if (toDateKey(yesterday) === dateKey) return "Yesterday";

  return keyDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }); // e.g. "August 31, 2025"
}

// Group messages by dateKey (sorted ascending). Returns an array of groups:
// [{ dateKey, dateLabel, messages: [...] }, ...]
function groupMessagesByDate(messages = []) {
  // do not mutate original
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const map = new Map();
  for (const msg of sorted) {
    const key = toDateKey(msg.createdAt);
    if (!map.has(key)) {
      map.set(key, { dateKey: key, dateLabel: getDateLabel(key), messages: [] });
    }
    map.get(key).messages.push(msg);
  }
  return Array.from(map.values());
}


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
  const groups = groupMessagesByDate(chatMessages);

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-white">
        <Avatar name={activeUser.name} />
        <span className="font-bold">{activeUser.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* {chatMessages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            isMe={msg.sender === user.id}
            content={msg.content}
            createdDate={msg.createdAt}
          />
        ))} */}
         {groups.map((group) => (
          <div key={group.dateKey}>
            {/* Date divider */}
            <div className="flex justify-center">
              <div className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full my-3">
                {group.dateLabel}
              </div>
            </div>

            {/* Messages for the day */}
            {group.messages.map((msg, idx) => (
              // Prefer a stable unique key if backend provides an id.
              <MessageBubble
                key={msg.id ?? msg.createdAt ?? idx}
                isMe={msg.sender === user.id}
                content={msg.content}
                createdDate={msg.createdAt}
              />
            ))}
          </div>
        ))}
         <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
