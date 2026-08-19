import { motion } from "framer-motion";
import { Truck, CheckCircle2 } from "lucide-react";

export default function Partners() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-cream">
          Delivery Partners
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mt-3 max-w-2xl mx-auto">
          Read on Rent works with local delivery partners to get books to readers fast, and
          pick returns back up on time. Here's how to get involved.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 shadow-card"
      >
        <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
          <Truck size={20} className="text-orange" />
        </div>
        <h3 className="font-semibold text-navy dark:text-cream mb-2">Become a Delivery Partner</h3>
        <p className="text-sm text-navy/60 dark:text-cream/60 leading-relaxed mb-4">
          Riders and fleet operators help us deliver rentals and pick up returns on time,
          every time.
        </p>
        <ul className="space-y-2 text-sm text-navy/70 dark:text-cream/70 mb-6">
          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange" /> Flexible delivery slots</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange" /> Per-drop and per-pickup payouts</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange" /> Priority routes in serviceable pincodes</li>
        </ul>
        
        <a
          href="mailto:readonrent00@gmail.com?subject=Delivery Partnership Inquiry"
          className="inline-block px-5 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Apply as Delivery Partner
        </a>
      </motion.div>
    </div>
  );
}