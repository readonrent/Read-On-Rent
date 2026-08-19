import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import RewardsPreview from "../components/RewardsPreview";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import BookCard from "../components/BookCard";
import { getBooks } from "../data/Api"; 

export default function Home() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Request parameters matching live collection targets
    getBooks({ limit: 4 })
      .then((res) => {
        setPopularBooks(res?.data?.data?.slice(0, 4) ?? []);
      })
      .catch((err) => {
        console.error("Home page book loading error context:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream">
            Popular Books
          </h2>
          <Link to="/books" className="text-orange font-medium text-sm">
            View All →
          </Link>
        </div>

        {loading ? (
          /* Smooth pulse loaders for content fetching state execution */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-navy/5 dark:bg-cream/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularBooks.map((book, i) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Categories />
      <HowItWorks />
      <RewardsPreview />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </div>
  );
}