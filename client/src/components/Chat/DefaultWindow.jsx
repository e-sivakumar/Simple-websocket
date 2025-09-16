import { motion, useMotionValue } from "framer-motion";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function DefaultWindow({ sidebarOpen, toggleSidebar }) {
  const [bubbleCount, setBubbleCount] = useState(
    window.innerWidth <= 768 ? 40 : 80
  );
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleResize = () => {
      setBubbleCount(window.innerWidth <= 768 ? 40 : 80);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <motion.div
      // style={{ rotateX, rotateY }}
      className="relative flex flex-1 flex-col items-center justify-center text-center p-6 overflow-hidden bg-gradient-to-b from-white to-blue-50 text-gray-700"
      onClick={
        ()=>{
          if(sidebarOpen){
          toggleSidebar(false)
          }
        }}
    >
      {/* Floating bubbles */}
      {[...Array(bubbleCount)].map((_, i) => {
        const size = Math.random() * 40 + 20;
        return (<motion.div
          key={i}
          className="absolute bg-blue-300/40 rounded-full"
          style={{
            width: size,
            height: size,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: ["0%", "-120vh"], opacity: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 12 + 8,
            repeat: Infinity,
            delay: Math.random() * 6,
          }}
        />
      )})}

      {/* Central icon */}
      <motion.div
        className="bg-white rounded-full p-10 shadow-xl border border-blue-200"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        whileHover={{ scale: 1.05 }}
      >
        <ChatBubbleOvalLeftIcon className="w-12 h-12 text-blue-500" />
      </motion.div>

      {/* Text */}
      <h2 className="mt-6 text-2xl font-bold text-blue-600">
        Dive into the Conversation
      </h2>
      <p className="mt-2 text-gray-500 max-w-xs">
        Select a user and let the chat flow like water 
      </p>
    </motion.div>
  );
}
