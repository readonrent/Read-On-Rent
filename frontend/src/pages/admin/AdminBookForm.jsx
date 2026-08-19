import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminCreateBook, adminUpdateBook, getBookById } from "../../data/Api";

const emptyForm = {
  title: "", author: "", isbn: "", category: "", description: "",
  coverImage: "", publisher: "", publicationYear: "", pages: "",
  rentalPrice7Days: "", rentalPrice14Days: "", rentalPrice30Days: "",
  securityDeposit: "", totalCopies: "", availableCopies: "", isActive: true,
};

export default function AdminBookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await getBookById(id);
        const book = res?.data;
        setForm({
          title: book.title || "", author: book.author || "", isbn: book.isbn || "",
          category: book.category || "", description: book.description || "",
          coverImage: book.coverImage || "", publisher: book.publisher || "",
          publicationYear: book.publicationYear || "", pages: book.pages || "",
          rentalPrice7Days: book.rentalPrice7Days ?? "", rentalPrice14Days: book.rentalPrice14Days ?? "",
          rentalPrice30Days: book.rentalPrice30Days ?? "", securityDeposit: book.securityDeposit ?? "",
          totalCopies: book.totalCopies ?? "", availableCopies: book.availableCopies ?? "",
          isActive: book.isActive ?? true,
        });
      } catch (err) {
        setError("Unable to load book. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      publicationYear: Number(form.publicationYear) || undefined,
      pages: Number(form.pages) || undefined,
      rentalPrice7Days: Number(form.rentalPrice7Days) || 0,
      rentalPrice14Days: Number(form.rentalPrice14Days) || 0,
      rentalPrice30Days: Number(form.rentalPrice30Days) || 0,
      securityDeposit: Number(form.securityDeposit) || 0,
      totalCopies: Number(form.totalCopies) || 0,
      availableCopies: Number(form.availableCopies) || 0,
    };
    try {
      if (isEdit) {
        await adminUpdateBook(id, payload);
      } else {
        await adminCreateBook(payload);
      }
      navigate("/admin/books");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save book. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEdit ? "Edit Book" : "Add Book"}>
        <div className="h-96 bg-softblue dark:bg-navy-light rounded-2xl animate-pulse" />
      </AdminLayout>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-softblue dark:bg-navy outline-none text-navy dark:text-cream text-sm";
  const labelClass = "text-xs font-medium text-navy/60 dark:text-cream/60 mb-1 block";

  return (
    <AdminLayout title={isEdit ? "Edit Book" : "Add Book"}>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 shadow-card max-w-3xl">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["title", "Title"], ["author", "Author"], ["isbn", "ISBN"], ["category", "Category"],
            ["publisher", "Publisher"], ["publicationYear", "Publication Year"], ["pages", "Pages"],
            ["coverImage", "Cover Image URL"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input value={form[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            ["rentalPrice7Days", "7-Day Price (₹)"], ["rentalPrice14Days", "14-Day Price (₹)"],
            ["rentalPrice30Days", "30-Day Price (₹)"], ["securityDeposit", "Security Deposit (₹)"],
            ["totalCopies", "Total Copies"], ["availableCopies", "Available Copies"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input type="number" value={form[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm text-navy dark:text-cream">
          <input type="checkbox" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} />
          Active (visible to customers)
        </label>

        <div className="flex gap-3 mt-6">
          <button disabled={saving} className="bg-orange text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Book"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="px-6 py-3 rounded-xl font-semibold text-navy dark:text-cream bg-softblue dark:bg-navy"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}