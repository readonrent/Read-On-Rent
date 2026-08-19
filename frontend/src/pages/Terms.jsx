import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-cream">
          Terms & Conditions
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mt-3">Last updated: August 2026</p>
      </motion.div>

      <div className="bg-white dark:bg-navy-light rounded-2xl shadow-card p-6 md:p-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Renting a book
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Every book on Read on Rent is rented, not sold, for a fixed period of 7, 14, or 30
            days from the date of delivery. The rental fee shown at checkout covers the full
            rental period; a refundable security deposit is charged separately and is not part
            of the rental fee.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Security deposit
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            The security deposit is refunded once the book is returned in acceptable condition.
            Books that are lost, damaged beyond normal wear, or not returned may result in the
            deposit being forfeited to cover replacement cost.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Returns & due dates
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Each rented item has a due date shown on your order and in your account. You can
            request a return pickup from your order details page any time before or after the
            due date; late returns may attract additional rental charges for the extra days held.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Cancellations
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Orders can be cancelled from your Orders page as long as they haven't been delivered
            yet. Once an order is marked delivered, it can only be ended through a return
            request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Reward points
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Reward points are earned on completed rentals and can be redeemed for a discount on
            a future order at checkout. Points have no cash value, cannot be transferred between
            accounts, and may be adjusted if an order they were earned from is later cancelled
            or found fraudulent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Payments
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            Orders are currently fulfilled on a Cash on Delivery basis. By placing an order you
            agree to pay the total shown at checkout to the delivery partner at the time of
            delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Account responsibility
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            You're responsible for keeping your account credentials secure and for the accuracy
            of the delivery details you provide. Read on Rent is not liable for delivery issues
            caused by incorrect address or contact information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy dark:text-cream mb-2">
            Changes to these terms
          </h2>
          <p className="text-navy/70 dark:text-cream/70 text-sm leading-relaxed">
            We may update these terms from time to time as the service evolves. Continuing to
            use Read on Rent after an update means you accept the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}