import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import RentalBag from "./pages/RentalBag";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import Rewards from "./pages/Rewards";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Partners from "./pages/Partners";
import Careers from "./pages/Careers"; // ✅ 1. IMPORT CAREERS HERE
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminBookForm from "./pages/admin/AdminBookForm";
import AdminOrders from "./pages/admin/AdminOrders";

export default function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-navy transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/bag" element={<RentalBag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route path="/rewards" element={<Rewards />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/careers" element={<Careers />} /> {/* ✅ 2. ADD ROUTE HERE */}

        {/* Admin — protected, role-gated */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
        <Route path="/admin/books/new" element={<AdminRoute><AdminBookForm /></AdminRoute>} />
        <Route path="/admin/books/:id/edit" element={<AdminRoute><AdminBookForm /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}