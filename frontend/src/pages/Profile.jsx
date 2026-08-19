import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, Gift, LogOut, Pencil, X, Check } from "lucide-react";
import { useRentalBag } from "../context/RentalBagContext";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../data/Api";

export default function Profile() {
  const { bag } = useRentalBag();
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const startEditing = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setError("");
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await updateProfile(form);
      const updatedUser = res?.data?.data || res?.data || form;
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Reader";
  const displayEmail = user?.email || "—";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="bg-orange text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy dark:text-cream">{displayName}</h1>
            <p className="text-navy/60 dark:text-cream/60 text-sm">{displayEmail}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange/10 text-orange text-sm font-semibold rounded-xl hover:bg-orange/20 transition-colors"
          >
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </motion.div>

      {isEditing && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card mb-10 space-y-4"
        >
          <h2 className="font-bold text-navy dark:text-cream mb-2">Edit Profile</h2>

          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-navy/10 dark:border-cream/10 bg-transparent text-navy dark:text-cream focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-navy/10 dark:border-cream/10 bg-transparent text-navy dark:text-cream focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/60 dark:text-cream/60 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-navy/10 dark:border-cream/10 bg-transparent text-navy dark:text-cream focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-orange/90 transition-colors disabled:opacity-60"
            >
              <Check size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-navy/5 dark:bg-cream/5 text-navy dark:text-cream text-sm font-semibold rounded-xl hover:bg-navy/10 dark:hover:bg-cream/10 transition-colors"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <ProfileCard icon={Package} title="Active Rentals" value={bag?.length ?? 0} />
        <ProfileCard icon={Heart} title="Wishlist" value="—" />
        <ProfileCard icon={Gift} title="Reward Points" value={user?.rewardPoints ?? 0} />
        <ProfileCard icon={User} title="Rental History" value="—" />
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 mt-10 text-sm font-medium hover:text-red-600 transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

function ProfileCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-card">
      <Icon className="text-orange mb-3" size={20} />
      <p className="text-2xl font-bold text-navy dark:text-cream">{value}</p>
      <p className="text-xs text-navy/50 dark:text-cream/50">{title}</p>
    </div>
  );
}
