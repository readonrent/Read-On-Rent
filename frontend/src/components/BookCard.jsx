import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function BookCard({ book }) {
  // Defensive validation handling for standard and MongoDB ID patterns
  const bookId = book._id || book.id;

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-navy-light rounded-2xl overflow-hidden shadow-card border border-navy/5 dark:border-cream/5 flex flex-col h-full"
    >
      {/* 
        BOOK COVER BLOCK:
        Using standard book layout scale ratio (aspect-[2/3]) 
        with object-contain to display full cover graphics safely.
      */}
      <div className="relative aspect-[2/3] w-full bg-slate-50 dark:bg-navy p-3 flex items-center justify-center border-b border-navy/5">
        <img 
          src={book.coverImage} 
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.03]"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
          }}
        />
      </div>

      {/* Book Metadata Context */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-orange tracking-wider uppercase">
            {book.category || "General"}
          </span>
          <h3 className="font-bold text-navy dark:text-cream line-clamp-1 mt-0.5 text-sm md:text-base" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-navy/60 dark:text-cream/60 line-clamp-1">
            by {book.author || "Unknown"}
          </p>
          
          <div className="flex items-center gap-1 mt-1.5 text-orange">
            <Star size={12} fill="#FF7A29" strokeWidth={0} />
            <span className="text-xs text-navy dark:text-cream font-semibold">
              {book.rating ?? "—"}
            </span>
          </div>
        </div>

        {/* Pricing Actions Context Footer */}
        <div className="pt-3 border-t border-navy/5 dark:border-cream/5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] text-navy/40 dark:text-cream/40 uppercase font-bold tracking-tight">Rent From</p>
            <p className="text-sm font-extrabold text-navy dark:text-cream truncate">₹{book.rentalPrice7Days}/wk</p>
          </div>
          
          <Link 
            to={`/books/${bookId}`}
            className="px-3.5 py-2 bg-orange text-white text-xs font-bold rounded-xl hover:bg-orange/90 transition-colors shadow-sm shrink-0"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}