import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminGetBooks, adminDeleteBook } from "../../data/Api";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGetBooks();
      setBooks(res?.data?.data ?? res?.data ?? []);
    } catch (err) {
      setError("Unable to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this book? It will be hidden from customers but kept for order history.")) return;
    try {
      await adminDeleteBook(id);
      load();
    } catch (err) {
      alert("Unable to deactivate book. Please try again later.");
    }
  };

  return (
    <AdminLayout title="Books">
      <div className="flex justify-end mb-4">
        <Link to="/admin/books/new" className="flex items-center gap-2 bg-orange text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> Add Book
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-softblue dark:bg-navy-light rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-navy/60 dark:text-cream/60">No books found.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-navy-light rounded-2xl shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/60 dark:text-cream/60 border-b border-navy/10 dark:border-cream/10">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">7-Day Price</th>
                <th className="p-4">Copies</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-navy/5 dark:border-cream/5 last:border-0">
                  <td className="p-4 text-navy dark:text-cream font-medium">{book.title}</td>
                  <td className="p-4 text-navy/70 dark:text-cream/70">{book.author}</td>
                  <td className="p-4 text-navy/70 dark:text-cream/70">{book.category}</td>
                  <td className="p-4 text-navy/70 dark:text-cream/70">₹{book.rentalPrice7Days}</td>
                  <td className="p-4 text-navy/70 dark:text-cream/70">
                    {book.availableCopies}/{book.totalCopies}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        book.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link
                      to={`/admin/books/${book._id}/edit`}
                      className="p-2 rounded-lg bg-softblue dark:bg-navy text-navy dark:text-cream"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => handleDeactivate(book._id)} className="p-2 rounded-lg bg-red-50 text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}