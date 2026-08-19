import { motion } from "framer-motion";
import { Search, PackageCheck, Truck, BookOpenCheck, RotateCcw, Gift } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover", desc: "Browse & search thousands of books." },
  { icon: PackageCheck, title: "Rent", desc: "Pick a duration and confirm your rental." },
  { icon: Truck, title: "Delivery", desc: "Warehouse dispatches to your doorstep." },
  { icon: BookOpenCheck, title: "Read", desc: "Enjoy the book at your own pace." },
  { icon: RotateCcw, title: "Return", desc: "Schedule a free pickup when done." },
  { icon: Gift, title: "Earn Rewards", desc: "Collect ROR points on every rental." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-softblue dark:bg-navy-light py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream mb-12 text-center">
          How Read on Rent Works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-navy rounded-2xl p-5 text-center shadow-card"
            >
              <div className="bg-orange/10 text-orange w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <step.icon size={22} />
              </div>
              <h3 className="font-semibold text-navy dark:text-cream text-sm">
                {step.title}
              </h3>
              <p className="text-xs text-navy/60 dark:text-cream/60 mt-1">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

