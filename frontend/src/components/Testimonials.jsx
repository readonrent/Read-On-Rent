import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Ananya Sharma", text: "Ordered 3 books in one month, delivery was always on time!", rating: 5 },
  { name: "Rohit Verma", text: "Love the rewards system, saved a lot on my last rental.", rating: 5 },
  { name: "Priya Nair", text: "Return pickup was super smooth. Highly recommend ROR.", rating: 4 },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream mb-10 text-center">
        What Our Readers Say
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card"
          >
            <div className="flex gap-1 text-orange mb-3">
              {Array.from({ length: r.rating }).map((_, idx) => (
                <Star key={idx} size={16} fill="#FF7A29" strokeWidth={0} />
              ))}
            </div>
            <p className="text-navy/70 dark:text-cream/70 text-sm mb-4">
              "{r.text}"
            </p>
            <p className="font-semibold text-navy dark:text-cream text-sm">
              {r.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

