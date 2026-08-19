import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, XCircle, CalendarClock, AlertTriangle, PackageCheck } from 'lucide-react';
import { getOrderById, cancelDelivery, rescheduleDelivery, reportDamage } from '../services/api';

const STATUS_STEPS = ['pending_payment', 'confirmed', 'shipped', 'delivered', 'returned'];

const DAMAGE_LEVELS = [
  { level: 0, label: 'No damage', penaltyNote: 'No charge' },
  { level: 1, label: 'Minor wear (bent corners)', penaltyNote: '~15% of rental price' },
  { level: 2, label: 'Moderate (torn pages/stains)', penaltyNote: '~40% of rental price' },
  { level: 3, label: 'Severe (missing pages/water damage)', penaltyNote: '~75% of rental price' },
  { level: 4, label: 'Unusable / lost', penaltyNote: '100% of book value' },
];

export default function OrderTracking() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [orderIdInput, setOrderIdInput] = useState(orderId || '');
  const [order, setOrder] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('9 AM – 12 PM');
  const [damageLevel, setDamageLevel] = useState(0);
  const [msg, setMsg] = useState('');

  const fetchOrder = async (id) => {
    if (!id) return;
    try {
      const { data } = await getOrderById(id);
      setOrder(data);
    } catch {
      setMsg('Order nahi mila. ID check karo.');
    }
  };

  useEffect(() => { if (orderId) fetchOrder(orderId); }, [orderId]);

  const handleCancel = async () => {
    if (!confirm('Delivery cancel karni hai? Ye undo nahi ho sakta.')) return;
    await cancelDelivery(order._id, 'User requested cancellation');
    setMsg('Delivery cancel ho gayi ✅');
    fetchOrder(order._id);
  };

  const handleReschedule = async () => {
    if (!newDate) return setMsg('Nayi date select karo pehle.');
    await rescheduleDelivery(order._id, newDate, newSlot);
    setMsg('Delivery reschedule ho gayi 🔄');
    fetchOrder(order._id);
  };

  const handleDamageReport = async () => {
    await reportDamage(order._id, damageLevel, DAMAGE_LEVELS[damageLevel].label);
    setMsg('Damage report submit ho gayi. Penalty final order me dikhegi.');
    fetchOrder(order._id);
  };

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-display font-bold text-3xl mb-8 flex items-center gap-2">
        <Truck className="text-blaze" /> Track Order
      </h1>

      {!order && (
        <div className="brutal-border rounded-chunky p-6 flex gap-3">
          <input
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 brutal-border rounded-xl px-3 py-2 bg-transparent font-mono text-sm"
          />
          <button
            onClick={() => fetchOrder(orderIdInput)}
            className="bg-blaze text-white font-display font-bold px-5 rounded-xl"
          >
            Track
          </button>
        </div>
      )}

      {msg && <p className="mt-4 font-mono text-sm text-blaze">{msg}</p>}

      {order && (
        <div className="mt-6 space-y-6">
          {/* Progress ticket */}
          <div className="brutal-border rounded-chunky p-6">
            <div className="flex justify-between mb-4">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className={`flex-1 text-center font-mono text-[10px] uppercase ${i <= stepIndex ? 'text-blaze font-bold' : 'text-ink/30 dark:text-paper/30'}`}>
                  {s.replace('_', ' ')}
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-ink/10 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-blaze transition-all" style={{ width: `${((stepIndex + 1) / STATUS_STEPS.length) * 100}%` }} />
            </div>
            <p className="font-mono text-xs mt-3 text-ink/60 dark:text-paper/60">
              Scheduled: {order.deliveryDate} · {order.deliverySlot}
            </p>
          </div>

          {/* Cancel / reschedule — only before shipped */}
          {stepIndex < 2 && (
            <div className="brutal-border rounded-chunky p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <CalendarClock size={18} className="text-blaze" /> Manage Delivery
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="brutal-border rounded-xl px-3 py-2 bg-transparent font-mono text-sm" />
                <select value={newSlot} onChange={(e) => setNewSlot(e.target.value)} className="brutal-border rounded-xl px-3 py-2 bg-transparent font-mono text-sm">
                  <option>9 AM – 12 PM</option>
                  <option>12 PM – 4 PM</option>
                  <option>4 PM – 8 PM</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleReschedule} className="flex-1 bg-zap text-ink font-display font-bold py-2.5 rounded-full">
                  Reschedule
                </button>
                <button onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 font-display font-bold py-2.5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <XCircle size={16} /> Cancel Delivery
                </button>
              </div>
            </div>
          )}

          {/* Damage report — only after delivered, before returned */}
          {order.status === 'delivered' && (
            <div className="brutal-border rounded-chunky p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-blaze" /> Report Book Condition on Return
              </h2>
              <div className="space-y-2 mb-4">
                {DAMAGE_LEVELS.map((d) => (
                  <label key={d.level} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border-2 cursor-pointer ${damageLevel === d.level ? 'border-blaze bg-blaze/10' : 'border-ink/10 dark:border-white/10'}`}>
                    <span className="flex items-center gap-2 text-sm">
                      <input type="radio" name="damage" checked={damageLevel === d.level} onChange={() => setDamageLevel(d.level)} />
                      {d.label}
                    </span>
                    <span className="font-mono text-xs text-ink/50 dark:text-paper/50">{d.penaltyNote}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleDamageReport} className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-zap text-white dark:text-ink font-display font-bold py-2.5 rounded-full">
                <PackageCheck size={16} /> Submit & Schedule Return
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}