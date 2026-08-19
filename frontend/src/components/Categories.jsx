import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "../data/books";

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream mb-8">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/books?category=${encodeURIComponent(cat)}`}
              className="block text-center bg-softblue dark:bg-navy-light hover:bg-orange hover:text-white text-navy dark:text-cream rounded-xl py-6 px-2 text-sm font-medium transition-colors"
            >
              {cat}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

