import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import Avatar from "../Shared/Avatar";
import { Bars3Icon, HomeIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, setActiveUser } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-20 w-72 bg-white shadow-md transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-600 w-full text-white p-2 flex justify-between items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            {/* <img src="/menu.png" alt="" className="w-8 h-8 md:w-10 md:h-10 " /> */}
            <Bars3Icon className="w-8 h-8 " />
          </button>
          <span className="pr-4 truncate max-w-[50%] "
          onClick={()=>{setActiveUser(null)}}
          >
            {/* {(user?.name).slice(0,1).toUpperCase()+(user?.name).slice(1)} */}
            {/* <Avatar name={user?.name || "Me"} /> */}
            <HomeIcon className="w-8 h-8 text-white " />
            
            </span>
          {/* <button onClick={logout}>Logout</button> */}
        </div>
        <div className="flex-1 flex flex-col min-h-0">
        <ChatWindow sidebarOpen={sidebarOpen}  toggleSidebar={(val) => {setSidebarOpen(val);console.log("cllicked")}}/>
        </div>
      </div>
    </div>
  );
}
