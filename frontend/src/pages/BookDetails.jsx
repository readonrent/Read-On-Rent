import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Truck, ShieldCheck, Clock } from "lucide-react";
import { getBookById } from "../data/Api";
import { useRentalBag } from "../context/RentalBagContext";

const durations = [7, 14, 30];

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBag, getPriceForDuration } = useRentalBag();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(7);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid book identity reference. Please check your source path destination.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    
    getBookById(id)
      .then((res) => setBook(res?.data ?? null))
      .catch(() => setError("Failed to load book parameters from the backend server."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 gap-12">
        <div className="rounded-3xl w-full aspect-[2/3] bg-navy/5 dark:bg-cream/5 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-24 bg-navy/10 dark:bg-cream/10 rounded-full animate-pulse" />
          <div className="h-8 w-2/3 bg-navy/10 dark:bg-cream/10 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-navy/10 dark:bg-cream/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-32 text-navy dark:text-cream font-medium">
        {error || "Requested book asset could not be found."}
      </div>
    );
  }

  const inStock = (book.availableCopies ?? 0) > 0;
  const fee = getPriceForDuration ? getPriceForDuration(book, duration) : (book.rentalPrice7Days * (duration / 7));

  const handleAdd = () => {
    if (addToBag) addToBag(book, duration);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 gap-8 items-start">
      {/* 
        DETAILS PAGE VIEWPORT BOUNDS:
        Restricting dynamic vertical scaling to prevent huge portrait explosion distortion issues.
      */}
      <div className="w-full aspect-[2/3] max-h-[520px] bg-slate-50 dark:bg-navy-light rounded-3xl p-6 flex items-center justify-center shadow-md border border-navy/5">
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={book.coverImage}
          alt={book.title}
          className="max-w-full max-h-full object-contain drop-shadow-xl rounded-lg"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
          }}
        />
      </div>

      {/* Info Context Description Panels */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div>
          <span className="bg-orange/10 text-orange text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {book.category || "General"}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-navy dark:text-cream mt-3 leading-tight">
            {book.title}
          </h1>
          <p className="text-base text-navy/60 dark:text-cream/60 mt-1">by <span className="font-semibold">{book.author}</span></p>

          <div className="flex items-center gap-1 mt-3 text-orange">
            <Star size={16} fill="#FF7A29" strokeWidth={0} />
            <span className="text-sm font-bold text-navy dark:text-cream">{book.rating ?? "—"}</span>
            <span className="text-sm text-navy/40 dark:text-cream/40 ml-1">
              ({book.numReviews ?? 0} reviews)
            </span>
          </div>
        </div>

        <div className="border-t border-b border-navy/5 py-4">
          <h3 className="text-sm font-bold text-navy dark:text-cream uppercase tracking-wider mb-2">Synopsis</h3>
          <p className="text-sm text-navy/70 dark:text-cream/70 leading-relaxed max-h-36 overflow-y-auto pr-2">
            {book.description || "No synopsis available for this title."}
          </p>
        </div>

        {/* Selection Configuration Controls */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-navy/50 dark:text-cream/50 mb-3">
            Select Rental Duration
          </p>
          <div className="flex gap-3">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  duration === d
                    ? "bg-orange text-white border-orange shadow-sm"
                    : "border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Layout Modules */}
        <div className="bg-softblue dark:bg-navy-light rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-navy/60 dark:text-cream/60">Rental Pricing Rate</span>
            <span className="text-navy dark:text-cream font-bold">₹{fee}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-navy/5 dark:border-cream/5">
            <span className="text-navy/60 dark:text-cream/60">Security Refundable Deposit</span>
            <span className="text-navy dark:text-cream font-bold">
              ₹{book.securityDeposit ?? 0}
            </span>
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex gap-4 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={!inStock}
            onClick={handleAdd}
            className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
              inStock
                ? "bg-orange text-white shadow-md hover:bg-orange/90"
                : "bg-navy/10 text-navy/40 dark:bg-cream/10 dark:text-cream/40 cursor-not-allowed"
            }`}
          >
            {added ? "Added to Bag ✓" : inStock ? "Add to Rental Bag" : "Out of Stock"}
          </motion.button>
          <button
            onClick={() => navigate("/bag")}
            className="px-5 py-3.5 rounded-xl font-bold text-sm border border-navy/20 dark:border-cream/20 text-navy dark:text-cream hover:bg-navy/5 transition-colors"
          >
            View Bag
          </button>
        </div>

        {/* Service Perks Grid Icons */}
        <div className="flex justify-between pt-4 text-[11px] font-medium text-navy/50 dark:text-cream/50 border-t border-navy/5">
          <div className="flex items-center gap-1.5"><Truck size={14} className="text-orange" /> Fast Delivery</div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-orange" /> Verified Quality</div>
          <div className="flex items-center gap-1.5"><Clock size={14} className="text-orange" /> Flexible Return</div>
        </div>
      </motion.div>
    </div>
  );
}