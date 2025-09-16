import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function MessageInput() {
  const { activeUser, sendMessage } = useContext(AppContext);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    sendMessage(activeUser.id, text);
    setText("");
  };

  return (
    <div className=" p-1 md:p-3 flex items-center gap-2 border-t bg-white">
      <input
        type="text"
        className="flex-1 text-xs md:text-base border rounded px-2 py-2"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        autoFocus
      />
       <button
        onClick={handleSend}
        className="bg-green-600 text-white px-3 py-2 rounded-full"
      >
        ➤
      </button>
    </div>
  );
}
