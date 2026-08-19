import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck, Truck, Home, XCircle, RotateCcw, Circle } from "lucide-react";
import { trackOrder, getOrderById, getOrders } from "../data/Api";

const POLL_INTERVAL_MS = 15000;

const iconFor = (status) => {
  switch (status) {
    case "pending": return CheckCircle2;
    case "confirmed": return PackageCheck;
    case "shipped": return Truck;
    case "delivered": return Home;
    default: return CheckCircle2;
  }
};

export default function OrderTracking() {
  const { id } = useParams();
  if (!id) return <OrdersList />;
  return <SingleOrderTracking id={id} />;
}

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getOrders();
        if (!cancelled) setOrders(res?.data?.data || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Could not load your orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <h1 className="text-2xl font-bold text-navy dark:text-cream mb-2">Track Your Order</h1>
      <p className="text-navy/60 dark:text-cream/60 mb-10">Select an order to see live status</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-softblue dark:bg-navy-light rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-navy/60 dark:text-cream/60">You don't have any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/track/${order._id}`}
              className="flex items-center justify-between bg-white dark:bg-navy-light rounded-2xl p-5 shadow-card hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="font-semibold text-navy dark:text-cream">
                  #{order.orderNumber || order._id}
                </p>
                <p className="text-xs text-navy/50 dark:text-cream/50">
                  {order.items?.length || 0} item(s) · ₹{order.total}
                </p>
              </div>
              <span className="text-xs font-bold uppercase px-3 py-1.5 rounded-full bg-orange/10 text-orange">
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SingleOrderTracking({ id }) {
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);
  const pollRef = useRef(null);

  const load = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError("");
    try {
      const [orderRes, trackRes] = await Promise.all([
        getOrderById(id),
        trackOrder(id),
      ]);
      setOrder(orderRes?.data?.data || orderRes?.data);
      setTracking(trackRes?.data?.data);
      setLastChecked(new Date());
    } catch (err) {
      if (!isBackground) setError(err?.response?.data?.message || "Could not load this order.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    pollRef.current = setInterval(() => load(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-center py-32 text-navy dark:text-cream">Loading tracking info...</div>;
  }

  if (error || !order || !tracking) {
    return (
      <div className="text-center py-32">
        <p className="text-navy dark:text-cream mb-4">{error || "Order not found."}</p>
        <Link to="/track" className="text-orange font-semibold">Back to Track Order</Link>
      </div>
    );
  }

  const { currentStatus, history, upcoming, estimatedDeliveryDate } = tracking;

  if (currentStatus === "cancelled" || currentStatus === "returned") {
    const Icon = currentStatus === "cancelled" ? XCircle : RotateCcw;
    const lastEntry = history[history.length - 1];
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-2">
          Order #{order.orderNumber || order._id}
        </h1>
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-navy/10 dark:bg-cream/10 flex items-center justify-center">
            <Icon size={28} className="text-orange" />
          </div>
          <p className="font-semibold text-navy dark:text-cream capitalize">
            This order was {currentStatus}
          </p>
          {lastEntry?.note && (
            <p className="text-sm text-navy/60 dark:text-cream/60 max-w-sm">{lastEntry.note}</p>
          )}
          {lastEntry?.timestamp && (
            <p className="text-xs text-navy/40 dark:text-cream/40">
              {new Date(lastEntry.timestamp).toLocaleString()}
            </p>
          )}
        </div>
        <Link to={`/orders/${order._id}`} className="text-orange font-semibold mt-8 inline-block">
          View Order Details
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-cream">Track Your Order</h1>
          <p className="text-navy/60 dark:text-cream/60">
            Order #{order.orderNumber || order._id} — {order.items?.length || 0} book(s)
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-navy/40 dark:text-cream/40">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live · updated {lastChecked ? lastChecked.toLocaleTimeString() : "just now"}
        </div>
      </div>

      {estimatedDeliveryDate && (
        <p className="text-sm text-orange font-medium mb-10">
          Estimated delivery: {new Date(estimatedDeliveryDate).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </p>
      )}
      {!estimatedDeliveryDate && <div className="mb-10" />}

      <div className="relative">
        {history.map((entry, i) => {
          const Icon = iconFor(entry.status);
          const isLast = i === history.length - 1 && upcoming.length === 0;
          return (
            <motion.div
              key={`${entry.status}-${entry.timestamp}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 pb-10 relative"
            >
              {!isLast && (
                <div className="absolute left-[19px] top-10 w-0.5 h-full bg-orange" />
              )}
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-orange text-white">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy dark:text-cream">{entry.label}</p>
                {entry.note && (
                  <p className="text-xs text-navy/60 dark:text-cream/60 mt-0.5">{entry.note}</p>
                )}
                <p className="text-xs text-navy/50 dark:text-cream/50">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}

        {upcoming.map((step, i) => (
          <div key={step.status} className="flex items-start gap-4 pb-10 relative">
            {i !== upcoming.length - 1 && (
              <div className="absolute left-[19px] top-10 w-0.5 h-full bg-navy/10 dark:bg-cream/10" />
            )}
            <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-navy/10 dark:bg-cream/10 text-navy/40 dark:text-cream/40">
              <Circle size={16} />
            </div>
            <p className="font-semibold text-navy/40 dark:text-cream/40">{step.label}</p>
          </div>
        ))}
      </div>

      <Link
        to={`/orders/${order._id}`}
        className="block text-center w-full bg-orange text-white py-3 rounded-xl font-semibold mt-4"
      >
        View Full Order Details
      </Link>
    </div>
  );
}