import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import api from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";

const cards = [
  { key: "totalTasks", label: "Total tasks", icon: ListChecks, color: "text-brand" },
  { key: "completedTasks", label: "Completed", icon: CheckCircle2, color: "text-mint" },
  { key: "pendingTasks", label: "Pending", icon: Clock3, color: "text-coral" },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, color: "text-red-500" }
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get("/tasks/dashboard")
      .then((response) => setStats(response.data.stats))
      .catch((error) => showToast(error.response?.data?.message || "Could not load dashboard", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) {
    return <LoadingScreen label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Dashboard</h2>
        <p className="text-sm text-slate-500">A quick snapshot of current team work.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-4 text-3xl font-bold text-ink">{stats?.[card.key] || 0}</p>
          </div>
        ))}
      </div>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-ink">Project-wise stats</h3>
        {stats?.projectStats?.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3">In Progress</th>
                  <th className="px-4 py-3">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.projectStats.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{project.name}</td>
                    <td className="px-4 py-3">{project.total}</td>
                    <td className="px-4 py-3">{project.completed}</td>
                    <td className="px-4 py-3">{project.inProgress}</td>
                    <td className="px-4 py-3">{project.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="No project data yet" message="Create projects and tasks to see project-level progress here." />
          </div>
        )}
      </section>
    </div>
  );
}
