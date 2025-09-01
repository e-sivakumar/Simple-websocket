export default function MessageBubble({ isMe, content }) {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
        <div
          className={`px-3 py-2 rounded-lg max-w-xs ${
            isMe ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {content}
        </div>
      </div>
    );
  }
  