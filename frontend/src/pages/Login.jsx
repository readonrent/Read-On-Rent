import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo =
        location.state?.from?.pathname || (user?.role === "admin" ? "/admin" : "/profile");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to log in. Please check your credentials."
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
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream"
          />
          <input
            type="password"
            required
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
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-navy/60 dark:text-cream/60 mt-6">
          New here? <Link to="/register" className="text-orange font-medium">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}