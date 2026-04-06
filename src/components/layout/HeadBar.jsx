import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useFinance } from "../../Context/FinanceContext";
import { LogOut, User, ChevronDown } from "lucide-react";

export default function HeadBar({ onAdminClick, dashboardSearch, onDashboardSearchChange }) {
  const { user, role, logout, isAdmin } = useAuth();
  const { transactions, filter, setFilter } = useFinance();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = () => {
    const header = ["id", "date", "category", "type", "amount"];
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.date,
      transaction.category,
      transaction.type,
      transaction.amount,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "transactions-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const togglePeriod = () => {
    setFilter({
      ...filter,
      period: filter.period === "monthly" ? "all" : "monthly",
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      
      {/* Left */}
      <h1 className="theme-text-secondary">
        <span className="mx-2">{">"}</span> Dashboard
      </h1>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        
        {/* Search */}
        <input
          placeholder="Search dashboard: balance, income, rent, salary"
          value={dashboardSearch}
          onChange={(event) => onDashboardSearchChange?.(event.target.value)}
          className="theme-input w-full rounded-lg px-4 py-2 text-sm outline-none sm:w-48"
        />

        {/* Filter */}
        <button
          onClick={togglePeriod}
          className="theme-surface-alt px-4 py-2 rounded-lg text-sm"
        >
          {filter.period === "monthly" ? "Monthly View" : "All Time"}
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="bg-green-400 text-black px-4 py-2 rounded-lg font-semibold text-sm"
        >
          Export
        </button>

        <div className="theme-surface-alt rounded-lg px-3 py-2 text-sm">
          Access Level: <span className="font-semibold capitalize">{role}</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="theme-surface-alt flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition"
          >
            <User className="w-4 h-4" />
            <span className="capitalize">{user?.name || role}</span>
            {isAdmin() && (
              <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
                ADMIN
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="theme-surface absolute right-0 z-50 mt-2 w-56 rounded-lg border theme-border shadow-lg">
              <div className="px-4 py-3 border-b theme-border">
                <p className="font-semibold">{user?.name}</p>
                <p className="theme-text-secondary text-sm">{user?.username}</p>
                <p className="theme-text-muted text-xs mt-1 capitalize">Role: {role}</p>
              </div>
              
              {isAdmin() && (
                <button
                  onClick={() => {
                    onAdminClick?.();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#2d3748] transition"
                >
                  Admin Panel
                </button>
              )}
              
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#2d3748] transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
