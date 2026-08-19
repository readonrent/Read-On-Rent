import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/books", label: "Books", icon: BookOpen },
  // Orders / Users / Reviews / Rewards / Reports admin UI: backend endpoints
  // already exist (adminGetOrders, adminGetUsers, adminGetReports) — wire
  // these the same way as Books whenever you want the next section built.
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream dark:bg-navy">
      <aside className="hidden md:flex md:flex-col w-64 bg-navy text-cream p-6 gap-2">
        <Link to="/admin" className="font-bold text-lg mb-8">
          Read On Rent Admin
        </Link>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive ? "bg-orange text-white" : "text-cream/70 hover:bg-white/10"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <div className="mt-auto pt-6 border-t border-cream/10">
          <p className="text-xs text-cream/50 mb-3">Signed in as {user?.name}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-cream/70 hover:text-orange">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-navy text-cream px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-bold">Admin</Link>
        <button onClick={logout} className="text-sm">Logout</button>
      </div>

      <main className="flex-1 p-4 pt-20 md:pt-8 md:p-8 overflow-x-auto">
        <h1 className="text-2xl font-bold text-navy dark:text-cream mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}