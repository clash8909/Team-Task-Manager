import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login(form.email, form.password);
      }
      showToast(isSignup ? "Account created successfully" : "Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.9fr]">
      <section className="hidden items-center justify-center bg-ink px-10 text-white lg:flex">
        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-200">Team Task Manager</p>
          <h1 className="text-5xl font-bold leading-tight">Plan work, assign clearly, and keep projects moving.</h1>
          <p className="mt-5 text-lg text-slate-300">
            A beginner-friendly full stack app with SQL, Prisma, JWT auth, and a clean dashboard for daily team execution.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">{isSignup ? "Create your account" : "Login to TaskFlow"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isSignup ? "Start with an Admin or Member role." : "Use your email and password to continue."}
          </p>

          <div className="mt-6 space-y-4">
            {isSignup && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                  required
                />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                minLength={8}
                required
              />
            </label>
            {isSignup && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Role</span>
                <select
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
            )}
          </div>

          <button
            disabled={loading}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignup ? "Create account" : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="font-semibold text-brand hover:underline" to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
