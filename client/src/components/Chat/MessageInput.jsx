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
    <div className="p-3 flex items-center gap-2 border-t bg-white">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
       <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded-full"
      >
        ➤
      </button>
    </div>
  );
}
