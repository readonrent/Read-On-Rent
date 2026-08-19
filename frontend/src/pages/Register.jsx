import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/profile");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-navy-light rounded-2xl p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-6 text-center">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          <input
            type="tel"
            required
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            disabled={submitting}
            className="w-full bg-orange text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Sign Up (+50 Reward Points)"}
          </button>
        </form>
        <p className="text-center text-sm text-navy/60 dark:text-cream/60 mt-6">
          Already have an account? <Link to="/login" className="text-orange font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
