import { useEffect, useState } from "react";
import logo from "@/assets/FB_IMG_1767617453285.png";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 700);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Rotating ring */}
        <div className="absolute w-48 h-48 rounded-full border-2 border-white/40 animate-ring-spin" />

        {/* Logo container */}
        <div className="w-36 h-36 flex items-center justify-center">
          <img
            src={logo}
            alt="BCSI Logo"
            className="w-full h-full object-contain animate-logo-in animate-logo-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
