import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Heart, LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useRentalBag } from "../context/RentalBagContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Home", path: "/" },
  { name: "Browse Books", path: "/books" },
  { name: "Rewards", path: "/rewards" },
  { name: "Track Order", path: "/track" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { bag } = useRentalBag();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 dark:bg-navy/80 border-b border-orange/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Brand Logo Replacement */}
        <Link
          to="/"
          className="flex items-center shrink-0"
          aria-label="Read on Rent Home"
        >
          <img
            src="/read-on-rent-logo.png"
            alt="Read on Rent"
            className="w-40 md:w-48 h-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-orange" : "text-navy/70 dark:text-cream/70 hover:text-orange"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          {/* Admin link rendered for role === 'admin' */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-1 text-sm font-medium text-navy/70 dark:text-cream/70 hover:text-orange"
            >
              <LayoutDashboard size={16} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="p-2 rounded-full bg-softblue dark:bg-navy-light text-navy dark:text-cream"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
          )}

          <Link
            to="/bag"
            className="relative p-2 rounded-full bg-softblue dark:bg-navy-light text-navy dark:text-cream"
            aria-label="Rental bag"
          >
            <ShoppingBag size={20} />
            {bag.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {bag.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 rounded-full bg-softblue dark:bg-navy-light text-navy dark:text-cream"
              >
                <User size={20} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-light rounded-xl shadow-card overflow-hidden"
                  >
                    <p className="px-4 py-3 text-sm text-navy/60 dark:text-cream/60 border-b border-navy/10 dark:border-cream/10 truncate">
                      {user?.name}
                    </p>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-navy dark:text-cream hover:bg-softblue dark:hover:bg-navy"
                    >
                      My Profile
                    </Link>
                    {!isAdmin && (
                      <>
                        <Link
                          to="/track"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-navy dark:text-cream hover:bg-softblue dark:hover:bg-navy"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/rewards"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-navy dark:text-cream hover:bg-softblue dark:hover:bg-navy"
                        >
                          Rewards
                        </Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-navy dark:text-cream hover:bg-softblue dark:hover:bg-navy"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-softblue dark:hover:bg-navy"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex p-2 rounded-full bg-softblue dark:bg-navy-light text-navy dark:text-cream"
            >
              <User size={20} />
            </Link>
          )}

          <button className="md:hidden p-2 text-navy dark:text-cream" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-cream dark:bg-navy border-t border-orange/10"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="text-navy dark:text-cream font-medium"
                >
                  {link.name}
                </NavLink>
              ))}
              {isAuthenticated && (
                <NavLink to="/wishlist" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                  Wishlist
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                  Admin Dashboard
                </NavLink>
              )}
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                    Profile
                  </NavLink>
                  {!isAdmin && (
                    <>
                      <NavLink to="/track" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                        My Orders
                      </NavLink>
                      <NavLink to="/rewards" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                        Rewards
                      </NavLink>
                    </>
                  )}
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="text-left text-red-500 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)} className="text-navy dark:text-cream font-medium">
                  Login / Profile
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}