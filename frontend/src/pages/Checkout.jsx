import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRentalBag } from "../context/RentalBagContext";
import { checkServiceability, checkout as apiCheckout } from "../data/Api";

export default function Checkout() {
  const { bag, getBagSummary, clearBag, syncBagToBackendCart } = useRentalBag();
  const summary = getBagSummary();
  const navigate = useNavigate();

  // step 1: pincode / serviceability
  const [pincode, setPincode] = useState("");
  const [checkingPin, setCheckingPin] = useState(false);
  const [pinError, setPinError] = useState("");
  const [serviceInfo, setServiceInfo] = useState(null); // { city, state, estimatedDays }

  // step 2: address form
  const [form, setForm] = useState({ fullName: "", street: "", phone: "" });

  // step 3: placing order
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderResult, setOrderResult] = useState(null); // backend order object

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckPincode = async (e) => {
    e.preventDefault();
    setPinError("");
    setServiceInfo(null);

    if (!/^\d{6}$/.test(pincode)) {
      setPinError("Enter a valid 6-digit pincode.");
      return;
    }

    setCheckingPin(true);
    try {
      const res = await checkServiceability(pincode);
      const data = res?.data?.data;

      if (!data || data.serviceable === false) {
        setPinError(
          data?.message || "Sorry, we currently don't deliver to this pincode."
        );
        return;
      }

      setServiceInfo(data); // { city, state, estimatedDays, serviceable }
    } catch (err) {
      setPinError(
        err?.response?.data?.message || "Could not verify pincode. Try again."
      );
    } finally {
      setCheckingPin(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError("");
    setPlacing(true);

    try {
      // 1. Push local bag items into the backend cart
      await syncBagToBackendCart();

      // 2. Ask backend to checkout that cart — backend calculates
      //    subtotal, securityDeposit, tax, total (source of truth)
      const deliveryAddress = {
        fullName: form.fullName,
        street: form.street,
        city: serviceInfo.city,
        state: serviceInfo.state,
        pincode,
        phone: form.phone,
      };

      const res = await apiCheckout({
        deliveryAddress,
        paymentMethod: "cod", // Razorpay comes in Phase 3
      });

      const order = res?.data?.data;
      setOrderResult(order);
      clearBag();
    } catch (err) {
      setOrderError(
        err?.response?.data?.message || "Could not place your order. Try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  // ---- Order placed successfully ----
  if (orderResult) {
    return (
      <div className="max-w-xl mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-2">
          Order Confirmed 🎉
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mb-8">
          Order #{orderResult.orderNumber}
        </p>

        <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card text-left text-sm space-y-2">
          <Row label="Subtotal" value={`₹${orderResult.subtotal}`} />
          <Row label="Security Deposit" value={`₹${orderResult.securityDeposit}`} />
          <Row label="Tax" value={`₹${orderResult.tax}`} />
          <hr className="border-navy/10 dark:border-cream/10 my-2" />
          <Row label="Total Paid (COD)" value={`₹${orderResult.total}`} bold />
        </div>

        <button
          onClick={() => navigate(`/orders/${orderResult._id}`)}
          className="w-full bg-orange text-white py-3 rounded-xl font-semibold mt-8"
        >
          View Order Details
        </button>
      </div>
    );
  }

  if (bag.length === 0) {
    return (
      <div className="text-center py-32 text-navy dark:text-cream">
        Your bag is empty.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-2xl font-bold text-navy dark:text-cream mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* STEP 1: PINCODE */}
          <div className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-card">
            <label className="text-sm font-semibold text-navy dark:text-cream">
              Delivery Pincode
            </label>
            <form onSubmit={handleCheckPincode} className="flex gap-2 mt-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="e.g. 411001"
                className="flex-1 px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
              />
              <button
                type="submit"
                disabled={checkingPin}
                className="px-5 py-3 bg-navy dark:bg-orange text-white rounded-xl font-semibold disabled:opacity-60"
              >
                {checkingPin ? "Checking..." : "Check"}
              </button>
            </form>
            {pinError && <p className="text-red-500 text-xs mt-2">{pinError}</p>}
            {serviceInfo && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                Deliverable to {serviceInfo.city}, {serviceInfo.state} — est.{" "}
                {serviceInfo.estimatedDays} day(s)
              </p>
            )}
          </div>

          {/* STEP 2: ADDRESS (only once pincode is verified) */}
          <AnimatePresence>
            {serviceInfo && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePlaceOrder}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-navy dark:text-cream">Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white dark:bg-navy-light shadow-card outline-none text-navy dark:text-cream"
                  />
                </div>
                <div>
                  <label className="text-sm text-navy dark:text-cream">
                    Street / Address
                  </label>
                  <textarea
                    required
                    name="street"
                    value={form.street}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white dark:bg-navy-light shadow-card outline-none text-navy dark:text-cream"
                  />
                </div>
                <div>
                  <label className="text-sm text-navy dark:text-cream">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white dark:bg-navy-light shadow-card outline-none text-navy dark:text-cream"
                  />
                </div>

                {orderError && <p className="text-red-500 text-sm">{orderError}</p>}

                <button
                  type="submit"
                  disabled={placing}
                  className="w-full bg-orange text-white py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                  {placing ? "Placing Order..." : "Confirm Rental (Cash on Delivery)"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ESTIMATED SUMMARY — final numbers come from backend after confirm */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card h-fit"
        >
          <h2 className="font-semibold text-navy dark:text-cream mb-4">
            Estimated Summary
          </h2>
          <div className="space-y-2 text-sm text-navy dark:text-cream">
            <Row label="Books" value={bag.length} />
            <Row label="Rental Fee" value={`₹${summary.rentalFee}`} />
            <Row label="Delivery Fee" value={`₹${summary.deliveryFee}`} />
            <Row label="Security Deposit" value={`₹${summary.securityDeposit}`} />
            <hr className="border-navy/10 dark:border-cream/10" />
            <Row label="Estimated Total" value={`₹${summary.total}`} bold />
          </div>
          <p className="text-[11px] text-navy/40 dark:text-cream/40 mt-3">
            Final total (incl. tax) is confirmed by the server after you place
            the order.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}