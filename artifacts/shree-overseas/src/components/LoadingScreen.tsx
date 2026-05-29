import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoPath from "@assets/IMG-20260521-WA0003_(1)_1779358525673.jpg";

export function LoadingScreen() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("shree_loaded"));

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("shree_loaded", "1");
    }, 2400);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
        >
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 flex flex-col items-center gap-7"
          >
            {/* Logo card */}
            <div className="w-36 h-36 rounded-3xl bg-white shadow-[0_0_60px_-10px_rgba(200,75,15,0.5)] flex items-center justify-center overflow-hidden">
              <img src={logoPath} alt="Shree Overseas Education" className="w-full h-full object-contain" />
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white tracking-wide">Shree Overseas Education</h1>
              <p className="text-primary/90 text-xs font-semibold mt-1.5 tracking-[0.25em] uppercase">Your Gateway to Global Education</p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="w-52 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.75, duration: 1.4, ease: "easeInOut" }}
                className="h-full bg-primary rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
