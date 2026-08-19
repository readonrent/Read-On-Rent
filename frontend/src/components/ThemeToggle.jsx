import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.85, rotate: 180 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-softblue dark:bg-navy-light text-navy dark:text-cream hover:opacity-80 transition"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}

