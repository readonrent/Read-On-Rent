import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Active Readers", value: "10,000+" },
    { label: "Books Available", value: "50,000+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Happy Returns", value: "99.8%" },
  ];

  const values = [
    {
      icon: BookOpen,
      title: "Affordable Reading",
      description: "Making physical books accessible to everyone without heavy price tags.",
    },
    {
      icon: Heart,
      title: "Eco-Friendly",
      description: "Promoting a circular economy by reusing books and reducing paper waste.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "Every book is sanitized and quality-checked before delivery.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-navy dark:text-cream">
          About Read on Rent
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mt-4 max-w-2xl mx-auto text-base md:text-lg">
          We are on a mission to make reading accessible, sustainable, and affordable for book lovers across the nation.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-navy-light rounded-2xl p-6 text-center shadow-card"
          >
            <div className="text-2xl md:text-3xl font-bold text-orange mb-1">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-navy/60 dark:text-cream/60">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-navy dark:text-cream text-center mb-8">
          Why We Do What We Do
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card"
              >
                <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange" />
                </div>
                <h3 className="font-semibold text-navy dark:text-cream mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-navy/60 dark:text-cream/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}