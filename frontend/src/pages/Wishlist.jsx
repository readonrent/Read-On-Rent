import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../data/Api";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWishlist();
      const data = res?.data?.data ?? res?.data;
      setBooks(data?.books ?? []);
    } catch (err) {
      setError("Unable to load your wishlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleRemove = async (bookId) => {
    setBooks((prev) => prev.filter((b) => b._id !== bookId)); // optimistic
    try {
      await removeFromWishlist(bookId);
    } catch (err) {
      load(); // revert on failure
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-navy dark:text-cream font-medium mb-4">Please log in to view your wishlist.</p>
        <Link to="/login" className="text-orange font-semibold">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-softblue dark:bg-navy-light rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream mb-8 flex items-center gap-2">
        <Heart className="text-orange" /> My Wishlist
      </h1>
      {books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-navy/60 dark:text-cream/60 mb-4">Your wishlist is empty.</p>
          <Link to="/books" className="text-orange font-semibold">Browse Books</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="relative">
              <BookCard book={book} />
              <button
                onClick={() => handleRemove(book._id)}
                className="absolute top-2 right-2 bg-white dark:bg-navy p-2 rounded-full shadow"
                aria-label="Remove from wishlist"
              >
                <Heart size={16} className="text-orange fill-orange" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}