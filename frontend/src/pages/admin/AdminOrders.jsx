import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminGetOrders, adminUpdateOrderStatus } from "../../data/Api";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "returned", "cancelled"];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

const LOCKED_STATUSES = ["delivered", "cancelled", "returned"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);

  const loadOrders = async (statusFilter = filter) => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await adminGetOrders(params);
      setOrders(res?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    loadOrders(value);
  };

  const handleOrderUpdated = (updated) => {
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)));
    setActiveOrder(null);
  };

  return (
    <AdminLayout title="Orders">
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-navy/60 dark:text-cream/60">Filter by status:</label>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-softblue dark:bg-navy text-navy dark:text-cream text-sm outline-none"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-softblue dark:bg-navy-light rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-navy/60 dark:text-cream/60">No orders found.</p>
      ) : (
        <div className="bg-white dark:bg-navy-light rounded-2xl shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/50 dark:text-cream/50 border-b border-navy/5 dark:border-cream/5">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Placed On</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-navy/5 dark:border-cream/5 last:border-0">
                  <td className="p-4">
                    <Link to={`/orders/${order._id}`} className="text-orange font-semibold hover:underline">
                      {order.orderNumber || order._id}
                    </Link>
                  </td>
                  <td className="p-4 text-navy dark:text-cream">
                    {order.user?.name || "—"}
                    <div className="text-xs text-navy/50 dark:text-cream/50">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-navy/70 dark:text-cream/70">
                    {order.items?.length || 0} book(s)
                  </td>
                  <td className="p-4 font-semibold text-navy dark:text-cream">₹{order.total}</td>
                  <td className="p-4 text-navy/60 dark:text-cream/60">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setActiveOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-softblue dark:bg-navy text-navy dark:text-cream text-xs font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeOrder && (
        <OrderManagePanel
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </AdminLayout>
  );
}

function OrderManagePanel({ order, onClose, onUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    order.estimatedDeliveryDate ? order.estimatedDeliveryDate.slice(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isLocked = LOCKED_STATUSES.includes(order.status);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { status, note: note || undefined };
      if (estimatedDeliveryDate) payload.estimatedDeliveryDate = estimatedDeliveryDate;
      const res = await adminUpdateOrderStatus(order._id, payload);
      onUpdated(res?.data?.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-card max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-navy dark:text-cream mb-1">
          Manage Order #{order.orderNumber || order._id}
        </h2>
        <p className="text-xs text-navy/50 dark:text-cream/50 mb-6">
          {order.user?.name} · {order.user?.email}
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1">Items</p>
            <div className="space-y-1 text-sm text-navy/80 dark:text-cream/80">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.book?.title || "Book"} × {item.quantity} ({item.rentalDuration}d)</span>
                  <span>₹{item.rentalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1">Delivery Address</p>
            <p className="text-sm text-navy/70 dark:text-cream/70">
              {order.deliveryAddress?.fullName}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city} — {order.deliveryAddress?.pincode}
              <br />
              📞 {order.deliveryAddress?.phone}
            </p>
          </div>

          {isLocked ? (
            <p className="text-sm text-navy/60 dark:text-cream/60 bg-softblue dark:bg-navy rounded-xl p-3">
              This order is <b className="capitalize">{order.status}</b> and is a final state — no further status changes allowed.
            </p>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1 block">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-softblue dark:bg-navy text-navy dark:text-cream text-sm outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1 block">
                  Estimated Delivery Date (optional)
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-softblue dark:bg-navy text-navy dark:text-cream text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1 block">
                  Note for this update (shown to customer on tracking page)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Out for delivery with rider Rohan"
                  className="w-full px-4 py-2.5 rounded-xl bg-softblue dark:bg-navy text-navy dark:text-cream text-sm outline-none"
                />
              </div>
            </>
          )}

          <div>
            <p className="text-xs font-semibold text-navy/60 dark:text-cream/60 mb-2">Status History</p>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {(order.statusHistory || []).slice().reverse().map((h, i) => (
                <li key={i} className="text-xs text-navy/70 dark:text-cream/70 flex justify-between border-b border-navy/5 dark:border-cream/5 pb-1.5">
                  <span>
                    <span className="font-semibold capitalize">{h.status}</span>
                    {h.note ? ` — ${h.note}` : ""}
                  </span>
                  <span className="text-navy/40 dark:text-cream/40 whitespace-nowrap ml-2">
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            {!isLocked && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-orange text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Update"}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-softblue dark:bg-navy text-navy dark:text-cream py-2.5 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}