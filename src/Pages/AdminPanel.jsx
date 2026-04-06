import { useAuth } from "../Context/AuthContext";
import { AdminOnly } from "../components/ProtectedComponent";
import { Users, Lock, Settings, BarChart3 } from "lucide-react";

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-400">Welcome back, {user?.name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <Users className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="text-gray-400 text-sm">Total Users</h3>
              <p className="text-2xl font-bold mt-2">2</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <Settings className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="text-gray-400 text-sm">Admin Accounts</h3>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <BarChart3 className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="text-gray-400 text-sm">Active Sessions</h3>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <Lock className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-gray-400 text-sm">Security Status</h3>
              <p className="text-2xl font-bold mt-2 text-green-400">Secure</p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Management */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Account Access
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <div>
                    <p className="font-semibold">Admin</p>
                    <p className="text-sm text-gray-400">admin</p>
                  </div>
                  <span className="bg-purple-600 px-3 py-1 rounded text-xs">ADMIN</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <div>
                    <p className="font-semibold">Viewer</p>
                    <p className="text-sm text-gray-400">viewer</p>
                  </div>
                  <span className="bg-gray-600 px-3 py-1 rounded text-xs">VIEWER</span>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition">
                  App Configuration
                </button>
                <button className="w-full text-left p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition">
                  Backup & Recovery
                </button>
                <button className="w-full text-left p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition">
                  API Keys
                </button>
                <button className="w-full text-left p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition">
                  System Logs
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/50 rounded-lg">
            <p className="text-blue-300 text-sm">
              ℹ️ This is an admin-only panel. Only users with the "admin" role can access this page.
            </p>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}
