import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setLoginError(error || "Login failed");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleQuickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setTimeout(() => {
      const success = login(user.username, user.password);
      if (!success) {
        setLoginError("Login failed");
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Finance Dashboard</h1>
            <p className="text-slate-400 text-sm mt-2">Admin and viewer access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-600/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-400">{loginError}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-400 text-xs uppercase">Demo Accounts</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin({
                  username: "admin",
                  password: "admin123",
                })
              }
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition border border-slate-600"
            >
              Admin (admin / admin123)
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickLogin({
                  username: "viewer",
                  password: "viewer123",
                })
              }
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition border border-slate-600"
            >
              Viewer (viewer / viewer123)
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-6">
            Demo credentials above • No real authentication
          </p>
        </div>
      </div>
    </div>
  );
}
