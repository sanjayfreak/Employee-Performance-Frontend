import { useEffect, useState } from "react";
import api from "../services/api";
import Shell from "../components/Shell";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const EMPTY = { name: "", description: "", assignedTo: "", dueDate: "", status: "PENDING" };

export default function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    api.get("/admin/employees")
      .then((res) => setEmployees(res.data || []))
      .catch(() => setBanner({ tone: "err", text: "Couldn't load the employee list." }));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.assignedTo) {
      setBanner({ tone: "err", text: "A task name and an assignee are required." });
      return;
    }
    setBusy(true);
    setBanner(null);
    try {
      await api.post("/tasks/assign", form);
      const who = employees.find((x) => x.id === form.assignedTo)?.name || "the employee";
      setBanner({ tone: "ok", text: `Task assigned to ${who}.` });
      setForm(EMPTY);
    } catch {
      setBanner({ tone: "err", text: "Couldn't assign that task." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell role="ADMIN" title="Assign a task" subtitle="Give an employee something to work on">
      {banner && (
        <div role="alert"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-amber-200 bg-amber-50 text-amber-900"
          }`}>
          <span className="flex-1">{banner.text}</span>
          <button onClick={() => setBanner(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <form onSubmit={handleAssign}
        className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="a-name" className="mb-1.5 block text-xs font-medium text-slate-700">Task name</label>
          <input id="a-name" value={form.name} onChange={set("name")}
            placeholder="e.g. Build the reporting endpoint" className={field} />
        </div>

        <div>
          <label htmlFor="a-desc" className="mb-1.5 block text-xs font-medium text-slate-700">
            Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea id="a-desc" rows={3} value={form.description} onChange={set("description")}
            placeholder="What does done look like?" className={`${field} resize-none`} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="a-who" className="mb-1.5 block text-xs font-medium text-slate-700">Assign to</label>
            <select id="a-who" value={form.assignedTo} onChange={set("assignedTo")} className={field}>
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} — {emp.email}</option>
              ))}
            </select>
            {employees.length === 0 && (
              <p className="mt-1.5 text-xs text-slate-500">No employees registered yet.</p>
            )}
          </div>

          <div>
            <label htmlFor="a-due" className="mb-1.5 block text-xs font-medium text-slate-700">Due date</label>
            <input id="a-due" type="date" value={form.dueDate} onChange={set("dueDate")} className={field} />
            <p className="mt-1.5 text-xs text-slate-500">
              Used for the on-time rate, worth 30% of their score.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
          <button type="button" onClick={() => setForm(EMPTY)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Clear
          </button>
          <button type="submit" disabled={busy}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60">
            {busy ? "Assigning…" : "Assign task"}
          </button>
        </div>
      </form>
    </Shell>
  );
}
