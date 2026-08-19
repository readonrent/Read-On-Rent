import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRentalBag } from '../context/RentalBagContext';
import { api } from '../data/Api';

const SLOTS = ['9 AM – 12 PM', '12 PM – 4 PM', '4 PM – 8 PM'];

export default function Checkout() {
  const { bag, calculateBagTotal } = useRentalBag();
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [slot, setSlot] = useState(SLOTS[0]);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkingServiceability, setCheckingServiceability] = useState(false);
  const [serviceabilityStatus, setServiceabilityStatus] = useState(null); // 'available', 'unavailable', null

  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const bagTotal = calculateBagTotal();

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryDate) {
      newErrors.deliveryDate = 'Delivery date select karo';
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode enter karo';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      newErrors.pincode = 'Valid 6-digit pincode enter karo';
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address enter karo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkServiceability = async () => {
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setErrors({ ...errors, pincode: 'Valid 6-digit pincode enter karo' });
      return;
    }

    setCheckingServiceability(true);
    try {
      // Backend endpoint: GET /api/serviceability/:pincode
      const response = await api.get(`/serviceability/${pincode.trim()}`, { auth: true });
      
      if (response.data?.success && response.data?.data?.isServiceable) {
        setServiceabilityStatus('available');
        setErrors({ ...errors, pincode: '' });
      } else {
        setServiceabilityStatus('unavailable');
        setErrors({
          ...errors,
          pincode: 'This pincode is not serviceable yet. Stay tuned!',
        });
      }
    } catch (err) {
      setServiceabilityStatus('unavailable');
      setErrors({
        ...errors,
        pincode: err?.response?.data?.message || 'Unable to check serviceability',
      });
    } finally {
      setCheckingServiceability(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (serviceabilityStatus !== 'available') {
      setErrors({ ...errors, address: 'Check serviceability first' });
      return;
    }

    setPlacing(true);
    try {
      // Build order payload
      const orderPayload = {
        items: bag.map((item) => ({
          bookId: item.book._id,
          rentalDuration: item.duration, // Phase 1 standardized as 'duration'
          quantity: 1, // single copy per item in bag
        })),
        deliveryAddress: {
          address: address.trim(),
          pincode: pincode.trim(),
          slot,
          date: deliveryDate,
        },
      };

      // POST /api/cart/checkout (backend calculates subtotal, tax, security deposit)
      const response = await api.post('/cart/checkout', orderPayload, { auth: true });

      if (response.data?.success && response.data?.data?._id) {
        const orderId = response.data.data._id;
        // Navigate to order tracking page (Phase 2: no Razorpay yet)
        navigate(`/orders/${orderId}`, { state: { order: response.data.data } });
      } else {
        setErrors({
          ...errors,
          submit: response.data?.message || 'Order creation failed',
        });
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Kuch gadbad ho gayi, dobara try karo';
      setErrors({ ...errors, submit: errMsg });
    } finally {
      setPlacing(false);
    }
  };

  if (bag.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-6">Your rental bag is empty</p>
        <button
          onClick={() => navigate('/books')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Schedule */}
          <div className="border-2 border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck size={20} /> Delivery Schedule
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={deliveryDate}
                  onChange={(e) => {
                    setDeliveryDate(e.target.value);
                    setErrors({ ...errors, deliveryDate: '' });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-600 focus:outline-none"
                />
                {errors.deliveryDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.deliveryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Time Slot
                </label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-600 focus:outline-none"
                >
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-4 flex items-center gap-2">
              <CalendarDays size={14} /> Free reschedule or cancellation up to 4 hrs before delivery
            </p>
          </div>

          {/* Pincode Serviceability */}
          <div className="border-2 border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📍 Service Area
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.slice(0, 6));
                    setErrors({ ...errors, pincode: '' });
                  }}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-600 focus:outline-none"
                />
                <button
                  onClick={checkServiceability}
                  disabled={checkingServiceability || !pincode || pincode.length !== 6}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {checkingServiceability ? 'Checking...' : 'Check'}
                </button>
              </div>
              {errors.pincode && (
                <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
              )}
              {serviceabilityStatus === 'available' && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  ✅ Serviceable area
                </p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-2 border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} /> Delivery Address
            </h2>
            <label className="block">
              <span className="block text-sm font-semibold mb-2">
                Full Address
              </span>
              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors({ ...errors, address: '' });
                }}
                rows={4}
                placeholder="House no, street, locality, city, state"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-600 focus:outline-none resize-none"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </label>

            {/* Damage Policy */}
            <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
              <p className="text-sm text-gray-700">
                <strong>Damage Policy:</strong> Minor wear is fine. Torn pages, water damage, or missing covers attract a penalty of 15–100% of rental value, auto-calculated at return.
              </p>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border-2 border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {bag.map((item) => {
                const durationLabel =
                  item.duration === 7
                    ? '7d'
                    : item.duration === 14
                    ? '14d'
                    : '30d';
                const priceField =
                  item.duration === 7
                    ? 'rentalPrice7Days'
                    : item.duration === 14
                    ? 'rentalPrice14Days'
                    : 'rentalPrice30Days';
                const rentalPrice = item.book[priceField] || 0;

                return (
                  <div
                    key={item.book._id}
                    className="text-sm border-b pb-2 last:border-b-0"
                  >
                    <p className="font-semibold">{item.book.title}</p>
                    <p className="text-gray-600">
                      {durationLabel} rental × ₹{rentalPrice}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t-2 border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{bagTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Security Deposit</span>
                <span>Will be calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span>
                <span>Will be calculated at checkout</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">₹{bagTotal.toFixed(0)}*</span>
              </div>
              <p className="text-xs text-gray-500">
                *Final total calculated after security deposit
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={
                placing ||
                bag.length === 0 ||
                serviceabilityStatus !== 'available' ||
                Object.keys(errors).length > 0
              }
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {placing ? 'Placing order...' : `Place Order - ₹${bagTotal.toFixed(0)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}