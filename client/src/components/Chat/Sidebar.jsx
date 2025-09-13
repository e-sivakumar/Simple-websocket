import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Avatar from "../Shared/Avatar";

export default function Sidebar({ closeSidebar }) {
  const { users, setActiveUser, logout, user } = useContext(AppContext);

  return (
    <div className="h-full flex flex-col">
      {/* Profile + Logout */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar name={user?.name || "Me"} />
          <span className="font-bold">{user?.name}</span>
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
            key={u.id}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setActiveUser(u);
              closeSidebar();
            }}
          >
            <Avatar name={u.name} />
            <span>{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
