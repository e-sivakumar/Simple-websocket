import { getAvatarColor } from "../../utils/avatarColor";

export default function Avatar({ name }) {
  return (
    <div
      className=" h-8 w-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold"
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}
