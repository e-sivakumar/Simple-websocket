export default function MessageBubble({ isMe, content, createdDate }) {
  const date = new Date(createdDate);
  const timeOnly = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
        <div
          className={`px-3 py-2 text-[12px] md:text-[15px] rounded-lg max-w-xs md:max-w-md ${
            isMe ? "bg-green-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          <div>{content}</div>

          <div
            className={`text-[6px] md:text-[8px] font-light mt-1 ${
              isMe ? "text-gray-200 text-right" : "text-gray-700 text-right"
            }`}
            aria-label={date.toLocaleString()}
          >
            {timeOnly}
          </div>
        </div>
      </div>
    );
  }
  