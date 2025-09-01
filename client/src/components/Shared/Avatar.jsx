import { getAvatarColor } from "../../utils/avatarColor";

export default function Avatar({ name }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}
