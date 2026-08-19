import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift, Star, Users, Repeat } from "lucide-react";

const perks = [
  { icon: Repeat, text: "Rent a book → +20 points" },
  { icon: Star, text: "Return on time → +10 points" },
  { icon: Gift, text: "Write a review → +5 points" },
  { icon: Users, text: "Refer a friend → +50 points" },
];

export default function RewardsPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <div className="bg-navy dark:bg-navy-light rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-cream mb-4">
            Earn ROR Rewards on Every Rental
          </h2>
          <p className="text-cream/60 mb-6">
            The more you read, the more you earn. Redeem points for discounts
            on your next rental.
          </p>
          <Link to="/rewards">
            <button className="bg-orange text-white px-6 py-3 rounded-xl font-semibold">
              View My Rewards
            </button>
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 rounded-xl p-4 text-cream text-sm flex flex-col gap-2"
            >
              <perk.icon size={20} className="text-orange" />
              {perk.text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

