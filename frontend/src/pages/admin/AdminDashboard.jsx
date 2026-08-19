import { useEffect, useState } from "react";
import { Users, BookOpen, ShoppingCart, IndianRupee } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminGetReports } from "../../data/Api";

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminGetReports();
        setReport(res?.data?.data ?? res?.data);
      } catch (err) {
        setError("Unable to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { label: "Total Users", value: report?.totalUsers ?? "—", icon: Users },
    { label: "Active Books", value: report?.totalBooks ?? "—", icon: BookOpen },
    { label: "Total Orders", value: report?.totalOrders ?? "—", icon: ShoppingCart },
    { label: "Revenue", value: report ? `₹${report.totalRevenue}` : "—", icon: IndianRupee },
  ];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-softblue dark:bg-navy-light rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-card">
                <s.icon size={20} className="text-orange mb-2" />
                <p className="text-2xl font-bold text-navy dark:text-cream">{s.value}</p>
                <p className="text-sm text-navy/60 dark:text-cream/60">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card">
            <h2 className="font-bold text-navy dark:text-cream mb-4">Orders by Status</h2>
            <div className="flex flex-wrap gap-3">
              {report?.ordersByStatus &&
                Object.entries(report.ordersByStatus).map(([status, count]) => (
                  <span
                    key={status}
                    className="px-3 py-1.5 rounded-full bg-softblue dark:bg-navy text-navy dark:text-cream text-sm capitalize"
                  >
                    {status}: {count}
                  </span>
                ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}