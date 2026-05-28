import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import api from "../services/api";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const blankTask = {
  title: "",
  description: "",
  dueDate: "",
  priority: "MEDIUM",
  status: "PENDING",
  projectId: "",
  assigneeId: ""
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankTask);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  async function loadData() {
    setLoading(true);
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        api.get("/tasks", { params: { search, status } }),
        api.get("/projects")
      ]);
      setTasks(taskResponse.data.tasks);
      setProjects(projectResponse.data.projects);
    } catch (error) {
      showToast(error.response?.data?.message || "Could not load tasks", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadData, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === Number(form.projectId)),
    [projects, form.projectId]
  );
  const assignees = selectedProject?.members || [];

  function resetForm() {
    setEditingId(null);
    setForm(blankTask);
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      priority: task.priority,
      status: task.status,
      projectId: String(task.projectId),
      assigneeId: String(task.assigneeId)
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        projectId: Number(form.projectId),
        assigneeId: Number(form.assigneeId)
      };
      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
        showToast("Task updated");
      } else {
        await api.post("/tasks", payload);
        showToast("Task created");
      }
      resetForm();
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || "Task save failed", "error");
    }
  }

  async function updateStatus(taskId, nextStatus) {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      showToast("Task status updated");
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || "Status update failed", "error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      showToast("Task deleted");
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || "Task delete failed", "error");
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading tasks..." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-ink">Tasks</h2>
          <p className="text-sm text-slate-500">{isAdmin ? "Create, assign, edit, and delete team tasks." : "View assigned work and update progress."}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" className="focus-ring w-full rounded-md border border-slate-300 py-2 pl-10 pr-3" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="focus-ring rounded-md border border-slate-300 px-3 py-2">
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {tasks.length ? (
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-ink">{task.title}</p>
                      <p className="max-w-xs truncate text-xs text-slate-500">{task.description}</p>
                    </td>
                    <td className="px-4 py-3">{task.project.name}</td>
                    <td className="px-4 py-3">{task.assignee.name}</td>
                    <td className="px-4 py-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><PriorityBadge value={task.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge value={task.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select value={task.status} onChange={(event) => updateStatus(task.id, event.target.value)} className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs">
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        {isAdmin && (
                          <>
                            <button className="focus-ring rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" onClick={() => startEdit(task)} aria-label="Edit task">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="focus-ring rounded-md border border-slate-200 p-2 text-red-500 hover:bg-red-50" onClick={() => handleDelete(task.id)} aria-label="Delete task">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No tasks found" message="Adjust search or filters, or create a task from the panel." />
        )}
      </section>

      {isAdmin && (
        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-brand" />
            <h3 className="font-bold text-ink">{editingId ? "Edit task" : "New task"}</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <textarea className="focus-ring min-h-24 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <select className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" value={form.projectId} onChange={(event) => setForm({ ...form, projectId: event.target.value, assigneeId: "" })} required>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <select className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} required disabled={!form.projectId}>
              <option value="">Select assignee</option>
              {assignees.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}
            </select>
            <input type="date" min={new Date().toISOString().slice(0, 10)} className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="focus-ring flex-1 rounded-md bg-brand px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="focus-ring rounded-md border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>}
            </div>
          </form>
        </aside>
      )}
    </div>
  );
}
