import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, CheckSquare, FolderKanban, LogOut, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare }
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const items = isAdmin ? [...navItems, { to: "/team", label: "Team", icon: Users }] : navItems;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
            <div>
              <p className="text-lg font-bold text-ink">TaskFlow</p>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Team Manager</p>
            </div>
            <button className="focus-ring rounded-md p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-4 rounded-md bg-slate-100 p-3">
              <p className="truncate text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-md bg-ink px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
          <button className="focus-ring rounded-md p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-500">Welcome back</p>
            <h1 className="text-lg font-bold text-ink">{user?.name}</h1>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
