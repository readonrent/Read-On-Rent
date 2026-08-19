import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-cream">
          Privacy Policy
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mt-3">Last updated: August 2026</p>
      </motion.div>

      <div className="bg-white dark:bg-navy-light rounded-2xl shadow-card p-6 md:p-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            What we collect
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            When you create an account, we collect your name, email, phone number, and delivery
            address so we can process your rentals. We do not sell your personal data to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            How we use your data
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Your information is used to manage your account, process orders and payments,
            deliver and collect books, calculate reward points, and send you order updates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Payment information
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Payments are processed securely through our payment partner. We never store your
            full card details on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">Your rights</h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            You can view and update your profile information at any time from your account
            settings. To request deletion of your account and associated data, contact us at
            support@readonrent.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">Cookies</h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            We use your browser's local storage to keep you signed in between visits. We don't
            use tracking cookies for advertising.
          </p>
        </section>
      </div>
    </div>
  );
}
