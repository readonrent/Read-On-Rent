import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../data/Api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getOrderById(id);
        if (!cancelled) setOrder(res?.data?.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Could not load this order."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-32 text-navy dark:text-cream">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-32">
        <p className="text-navy dark:text-cream mb-4">
          {error || "Order not found."}
        </p>
        <Link to="/track" className="text-orange font-semibold">
          Go to Track Order
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-16">
      <h1 className="text-2xl font-bold text-navy dark:text-cream mb-2">
        Order Details
      </h1>
      <p className="text-navy/60 dark:text-cream/60 mb-8">
        Order #{order.orderNumber || order._id}
      </p>

      <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card text-sm space-y-4">
        <div>
          <p className="font-semibold text-navy dark:text-cream mb-2">Items</p>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-navy/80 dark:text-cream/80"
              >
                <span>
                  {item.book?.title || "Book"} × {item.quantity} (
                  {item.rentalDuration}d)
                </span>
                <span>₹{item.rentalPrice * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-navy/10 dark:border-cream/10" />

        <Row label="Subtotal" value={`₹${order.subtotal}`} />
        <Row label="Security Deposit" value={`₹${order.securityDeposit}`} />
        <Row label="Tax" value={`₹${order.tax}`} />
        <hr className="border-navy/10 dark:border-cream/10" />
        <Row label="Total Paid (COD)" value={`₹${order.total}`} bold />

        <hr className="border-navy/10 dark:border-cream/10" />

        <div>
          <p className="font-semibold text-navy dark:text-cream mb-1">
            Delivery Address
          </p>
          <p className="text-navy/70 dark:text-cream/70">
            {order.deliveryAddress?.fullName}
            <br />
            {order.deliveryAddress?.street}
            <br />
            {order.deliveryAddress?.city}, {order.deliveryAddress?.state} —{" "}
            {order.deliveryAddress?.pincode}
            <br />
            {order.deliveryAddress?.phone}
          </p>
        </div>

        <Row label="Status" value={order.status} />
      </div>

      <Link
        to="/track"
        className="block text-center w-full bg-orange text-white py-3 rounded-xl font-semibold mt-8"
      >
        Track This Order
      </Link>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-navy/70 dark:text-cream/70">{label}</span>
      <span
        className={
          bold
            ? "font-bold text-navy dark:text-cream"
            : "text-navy dark:text-cream"
        }
      >
        {value}
      </span>
    </div>
  );
}
