import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does book rental work?", a: "Select a book, choose your rental duration (7/14/30 days), and we deliver it to your doorstep." },
  { q: "What if I return the book late?", a: "A late fee is calculated automatically based on our rental policy per extra day." },
  { q: "How do I earn reward points?", a: "You earn points for renting, returning on time, writing reviews, and referring friends." },
  { q: "Is there a security deposit?", a: "A small refundable security deposit applies depending on the book value." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-cream mb-10 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="bg-white dark:bg-navy-light rounded-xl shadow-card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span className="font-medium text-navy dark:text-cream">
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                className="text-orange"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 overflow-hidden"
                >
                  <p className="text-navy/60 dark:text-cream/60 text-sm pb-5">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

