import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import BookCard from "../components/BookCard";
import { getBooks, getCategories } from "../data/Api";

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(200);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([getBooks({ limit: 200 }), getCategories()])
      .then(([booksRes, catRes]) => {
        // Handling deep data nesting from server response
        setAllBooks(booksRes?.data?.data ?? []);
        setCategories(catRes?.data?.data ?? []);
      })
      .catch(() => {
        setError("Unable to load books. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = useMemo(() => {
    let result = allBooks.filter((book) => {
      const matchesQuery =
        book.title?.toLowerCase().includes(query.toLowerCase()) ||
        book.author?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || book.category === category;
      const matchesPrice = (book.rentalPrice7Days ?? 0) <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });

    if (sortBy === "priceLow")
      result = [...result].sort((a, b) => (a.rentalPrice7Days ?? 0) - (b.rentalPrice7Days ?? 0));
    if (sortBy === "priceHigh")
      result = [...result].sort((a, b) => (b.rentalPrice7Days ?? 0) - (a.rentalPrice7Days ?? 0));
    if (sortBy === "rating")
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return result;
  }, [allBooks, query, category, sortBy, maxPrice]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams(cat === "All" ? {} : { category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold text-navy dark:text-cream mb-2">
        Browse Books
      </h1>
      <p className="text-navy/60 dark:text-cream/60 mb-8">
        {loading ? "Loading books..." : `${filteredBooks.length} books available for rent`}
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center bg-white dark:bg-navy-light rounded-xl px-4 py-3 shadow-card flex-1">
          <Search size={18} className="text-navy/40 dark:text-cream/40 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="bg-transparent outline-none w-full text-navy dark:text-cream text-sm"
          />
        </div>

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="bg-white dark:bg-navy-light rounded-xl px-4 py-3 shadow-card text-sm text-navy dark:text-cream outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.name || c} value={c.name || c}>
              {c.name || c}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-navy-light rounded-xl px-4 py-3 shadow-card text-sm text-navy dark:text-cream outline-none"
        >
          <option value="popular">Sort: Popular</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mb-8 bg-white dark:bg-navy-light rounded-xl px-4 py-3 shadow-card max-w-sm">
        <SlidersHorizontal size={16} className="text-orange" />
        <span className="text-sm text-navy dark:text-cream whitespace-nowrap">
          Max ₹{maxPrice}
        </span>
        <input
          type="range"
          min="30"
          max="200"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-orange"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-navy/5 dark:bg-cream/5 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-navy/60 dark:text-cream/60">{error}</div>
      ) : filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-navy/50 dark:text-cream/50 text-lg">
            😕 No books found. Try adjusting your search or filters.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}