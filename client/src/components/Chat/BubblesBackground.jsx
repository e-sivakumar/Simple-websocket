// BubblesBackground.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BubblesBackground({ intensity = "mild" }) {
  const [bubbleCount, setBubbleCount] = useState(
    window.innerWidth <= 768 ? 20 : 40 // fewer for mild effect
  );

  useEffect(() => {
    const handleResize = () => {
      setBubbleCount(window.innerWidth <= 768 ? 20 : 40);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {[...Array(bubbleCount)].map((_, i) => {
        const size = Math.random() * (intensity === "mild" ? 20 : 40) + 10;
        return (
          <motion.div
            key={i}
            className="absolute bg-blue-200/20 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              zIndex: 0,
            }}
            animate={{ y: ["0%", "-120vh"], opacity: [0, 0.5, 0] }}
            transition={{
              duration: Math.random() * 10 + 12,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        );
      })}
    </>
  );
}
