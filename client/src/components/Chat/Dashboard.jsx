import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function Dashboard() {
  const { user, logout, activeUser } = useContext(AppContext);
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
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
        <div className="flex-1 flex flex-col h-full">
        <ChatWindow  toggleSidebar={() => setSidebarOpen(true)}/>
        </div>
      </div>
    </div>
  );
}
