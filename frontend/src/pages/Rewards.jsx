import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, History, Sparkles } from "lucide-react";
import { getRewardBalance, getRewardHistory, redeemRewardPoints } from "../data/Api";
import { useAuth } from "../context/AuthContext";

export default function Rewards() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [balRes, histRes] = await Promise.all([getRewardBalance(), getRewardHistory()]);
      setBalance(balRes?.data?.data ?? balRes?.data);
      setHistory(histRes?.data?.data ?? histRes?.data ?? []);
    } catch (err) {
      setError("Unable to load rewards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setMessage(null);
    const points = Number(redeemPoints);
    if (!points || points <= 0) {
      setMessage({ type: "error", text: "Enter a valid number of points." });
      return;
    }
    setRedeeming(true);
    try {
      const res = await redeemRewardPoints(points);
      const data = res?.data?.data ?? res?.data;
      setMessage({
        type: "success",
        text: `Redeemed successfully. Discount value: ₹${data.discountValue}. Remaining points: ${data.remainingPoints}.`,
      });
      setRedeemPoints("");
      loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Unable to redeem points. Please try again later.",
      });
    } finally {
      setRedeeming(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-navy dark:text-cream font-medium mb-4">Please log in to view your rewards.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-4 animate-pulse">
        <div className="h-32 bg-softblue dark:bg-navy-light rounded-2xl" />
        <div className="h-64 bg-softblue dark:bg-navy-light rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy rounded-3xl p-8 md:p-12 text-center text-cream"
      >
        <Sparkles className="mx-auto mb-3 text-orange" size={32} />
        <p className="text-cream/60 mb-1">Your reward balance</p>
        <h1 className="text-5xl font-bold">{balance?.rewardPoints ?? 0}</h1>
        <p className="text-cream/60 mt-1">points</p>
      </motion.div>

      <div className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 shadow-card">
        <h2 className="text-lg font-bold text-navy dark:text-cream mb-4 flex items-center gap-2">
          <Gift size={20} className="text-orange" /> Redeem Points
        </h2>
        <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min="1"
            placeholder="Points to redeem"
            value={redeemPoints}
            onChange={(e) => setRedeemPoints(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          <button
            disabled={redeeming}
            className="bg-orange text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {redeeming ? "Redeeming..." : "Redeem"}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 shadow-card">
        <h2 className="text-lg font-bold text-navy dark:text-cream mb-4 flex items-center gap-2">
          <History size={20} className="text-orange" /> Points History
        </h2>
        {history.length === 0 ? (
          <p className="text-navy/60 dark:text-cream/60 text-sm">No reward activity yet.</p>
        ) : (
          <ul className="divide-y divide-navy/10 dark:divide-cream/10">
            {history.map((entry) => (
              <li key={entry._id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="text-navy dark:text-cream font-medium">{entry.reason}</p>
                  <p className="text-navy/50 dark:text-cream/50 text-xs">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={entry.type === "earn" ? "text-green-600" : "text-orange"}>
                  {entry.type === "earn" ? "+" : "-"}
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}