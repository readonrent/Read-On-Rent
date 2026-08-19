import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Truck, RotateCcw } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-softblue to-cream dark:from-navy dark:to-navy-light py-20 md:py-28 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block bg-orange/10 text-orange px-4 py-1 rounded-full text-sm font-medium mb-4">
            📚 India's Smartest Book Rental Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-navy dark:text-cream leading-tight">
            Rent. Read. <span className="text-orange">Return.</span>
          </h1>
          <p className="text-navy/70 dark:text-cream/70 mt-6 text-lg max-w-md">
            Discover thousands of books, get them delivered to your doorstep,
            read at your pace, and earn rewards on every return.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/books">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                Browse Books
              </motion.button>
            </Link>
            <a href="#how-it-works">
              <button className="border border-navy/20 dark:border-cream/20 text-navy dark:text-cream px-6 py-3 rounded-xl font-semibold hover:bg-navy/5 dark:hover:bg-cream/5 transition">
                How It Works
              </button>
            </a>
          </div>

          <div className="flex gap-8 mt-10">
            <div className="flex items-center gap-2 text-navy/70 dark:text-cream/70 text-sm">
              <BookOpen size={18} className="text-orange" /> 10,000+ Books
            </div>
            <div className="flex items-center gap-2 text-navy/70 dark:text-cream/70 text-sm">
              <Truck size={18} className="text-orange" /> Doorstep Delivery
            </div>
            <div className="flex items-center gap-2 text-navy/70 dark:text-cream/70 text-sm">
              <RotateCcw size={18} className="text-orange" /> Easy Returns
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <motion.img
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
            alt="Books"
            className="rounded-3xl shadow-2xl w-full max-w-md object-cover h-96"
          />
        </motion.div>
      </div>
    </section>
  );
}