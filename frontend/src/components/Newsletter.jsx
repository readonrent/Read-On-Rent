import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-orange rounded-3xl p-10 md:p-14 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Never Miss a New Arrival
        </h2>
        <p className="text-white/80 mb-6">
          Subscribe for exclusive discounts and reading recommendations.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl outline-none"
          />
          <button className="bg-navy text-white px-6 py-3 rounded-xl font-semibold">
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  );
}

