import { getAvatarColor } from "../../utils/avatarColor";

export default function Avatar({ name, isOnline }) {
  return (
    <div
      className="relative h-8 w-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold"
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {name[0]?.toUpperCase()}
      {isOnline && <div className="absolute right-1 bottom-1 bg-green-500 h-2 w-2 rounded-full "></div>}
    </div>
  );
}
