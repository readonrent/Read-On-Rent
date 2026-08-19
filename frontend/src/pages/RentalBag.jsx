import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useRentalBag } from "../context/RentalBagContext";

const durations = [7, 14, 30];

export default function RentalBag() {
  const { bag, removeFromBag, updateDuration, getPriceForDuration, getBagSummary } =
    useRentalBag();
  const summary = getBagSummary();
  const navigate = useNavigate();

  if (bag.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-navy/60 dark:text-cream/60 text-lg mb-4">
          Your rental bag is empty.
        </p>
        <Link to="/books" className="text-orange font-medium">
          Browse Books →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-4">
          Rental Bag ({bag.length})
        </h1>
        {bag.map(({ book, duration }) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 bg-white dark:bg-navy-light rounded-2xl p-4 shadow-card items-center"
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-16 h-20 object-cover rounded-lg bg-softblue dark:bg-navy"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-navy dark:text-cream text-sm">
                {book.title}
              </h3>

              <select
                value={duration}
                onChange={(e) => updateDuration(book._id, Number(e.target.value))}
                className="mt-1 text-xs bg-softblue dark:bg-navy rounded-lg px-2 py-1 text-navy dark:text-cream outline-none"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d} Days Rental</option>
                ))}
              </select>

              <p className="text-orange font-semibold text-sm mt-1">
                ₹{getPriceForDuration(book, duration)}
              </p>
            </div>
            <button
              onClick={() => removeFromBag(book._id)}
              className="text-navy/40 dark:text-cream/40 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card h-fit"
      >
        <h2 className="font-semibold text-navy dark:text-cream mb-4">Rental Summary</h2>
        <div className="space-y-2 text-sm">
          <Row label="Rental Fee" value={`₹${summary.rentalFee}`} />
          <Row label="Delivery Fee" value={`₹${summary.deliveryFee}`} />
          <Row label="Security Deposit" value={`₹${summary.securityDeposit}`} />
          <hr className="border-navy/10 dark:border-cream/10 my-2" />
          <Row label="Total" value={`₹${summary.total}`} bold />
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-orange text-white py-3 rounded-xl font-semibold mt-6"
        >
          Proceed to Checkout
        </button>
      </motion.div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-navy/60 dark:text-cream/60">{label}</span>
      <span className={bold ? "font-bold text-navy dark:text-cream" : "text-navy dark:text-cream"}>
        {value}
      </span>
    </div>
  );
}