import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Instagram, Twitter, Facebook, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem("newsletterEmails") || "[]");
      if (!saved.includes(email)) {
        saved.push(email);
        localStorage.setItem("newsletterEmails", JSON.stringify(saved));
      }
    } catch {
      // localStorage unavailable — still show success
    }

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-navy text-cream mt-24 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="font-bold text-lg">Read on Rent</span>
          </div>
          <p className="text-cream/60 text-sm">
            Rent. Read. Return. Making reading affordable, accessible and
            convenient — one book at a time.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} className="hover:text-orange cursor-pointer" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} className="hover:text-orange cursor-pointer" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} className="hover:text-orange cursor-pointer" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link to="/books" className="hover:text-orange">Browse Books</Link></li>
            <li><Link to="/rewards" className="hover:text-orange">Rewards</Link></li>
            <li><Link to="/track" className="hover:text-orange">Track Order</Link></li>
            <li><Link to="/bag" className="hover:text-orange">Rental Bag</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link to="/about" className="hover:text-orange">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-orange">Careers</Link></li>
            <li><Link to="/partners" className="hover:text-orange">Warehouse Partners</Link></li>
            <li><Link to="/partners" className="hover:text-orange">Delivery Partners</Link></li>
            <li><Link to="/terms" className="hover:text-orange">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-orange">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          {subscribed ? (
            <p className="text-sm text-cream/80 flex items-center gap-2">
              <Check size={16} className="text-orange" /> You're subscribed! Watch your inbox.
            </p>
          ) : (
            <>
              <p className="text-cream/60 text-sm mb-3">
                Get new arrivals & offers in your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-3 py-2 rounded-l-lg text-navy w-full text-sm outline-none"
                />
                <button type="submit" className="bg-orange px-4 rounded-r-lg text-sm font-medium shrink-0">
                  Join
                </button>
              </form>
              {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
            </>
          )}
        </div>
      </div>
      <p className="text-center text-cream/40 text-xs mt-12">
        © {new Date().getFullYear()} Read on Rent (ROR). All rights reserved.
      </p>
    </footer>
  );
}