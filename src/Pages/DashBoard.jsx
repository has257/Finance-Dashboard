import SideBar from "../components/layout/SideBar";
import HeadBar from "../components/layout/HeadBar";
import BalanceChart from "../components/Charts/BalanceChart";
import CategoryPie from "../components/Charts/CategoryPie";
import TransactionsTable from "../components/TransactionsTable";
import Insights from "../components/Insights";
import AdminPanel from "./AdminPanel";
import { useEffect, useState } from "react";
import { useFinance } from "../Context/FinanceContext";
import { useAuth } from "../Context/AuthContext";
import useFinanceData from "../hooks/useFinancedata";

export default function Dashboard() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("dashboard-theme") || "dark");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [showHistoryRange, setShowHistoryRange] = useState(false);
  const { loading, error, filter, setFilter } = useFinance();
  const { user, role } = useAuth();
  const {
    balance,
    income,
    expenses,
    latestTransactionDate,
    incomeDelta,
    expenseDelta,
    allTransactions,
  } = useFinanceData();

  const balanceDateLabel = latestTransactionDate
    ? latestTransactionDate.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No transactions yet";

  const formatDelta = (value) => {
    if (value === 0) return "No change";
    return `${value > 0 ? "+" : "-"}$${Math.abs(value).toLocaleString()}`;
  };

  const progressGoal = Math.max(income, expenses, 1);
  const incomeProgress = Math.min((income / progressGoal) * 100, 100);
  const expenseProgress = Math.min((expenses / progressGoal) * 100, 100);
  const savings = Math.max(income - expenses, 0);
  const savingsProgress = Math.min((savings / progressGoal) * 100, 100);

  useEffect(() => {
    document.body.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const resolveCategorySearch = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return null;
    }

    const categoryTotals = allTransactions.reduce((categories, transaction) => {
      const key = transaction.category.toLowerCase();

      if (!categories[key]) {
        categories[key] = {
          name: transaction.category,
          income: 0,
          expense: 0,
        };
      }

      categories[key][transaction.type] += transaction.amount;
      return categories;
    }, {});

    const matches = Object.values(categoryTotals).filter((category) => {
      const normalizedCategory = category.name.toLowerCase();
      return (
        normalizedCategory.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedCategory)
      );
    });

    if (!matches.length) {
      return null;
    }

    return matches.sort((categoryA, categoryB) => {
      return Math.max(categoryB.income, categoryB.expense) - Math.max(categoryA.income, categoryA.expense);
    })[0];
  };

  const matchedCategory = resolveCategorySearch(dashboardSearch);

  const resolveDashboardSearchTarget = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return null;
    }

    if (["balance", "net", "wallet", "available balance"].some((term) => normalizedQuery.includes(term))) {
      return "balance-card";
    }

    if (["income", "revenue", "salary", "earnings"].some((term) => normalizedQuery.includes(term))) {
      return "income-card";
    }

    if (["expense", "spending", "cost", "outflow"].some((term) => normalizedQuery.includes(term))) {
      return "expenses-card";
    }

    if (["saving", "savings", "saved"].some((term) => normalizedQuery.includes(term))) {
      return "savings-card";
    }

    if (["trend", "chart", "balance trend"].some((term) => normalizedQuery.includes(term))) {
      return "dashboard-charts";
    }

    if (["breakdown", "pie", "category"].some((term) => normalizedQuery.includes(term))) {
      return "dashboard-spending";
    }

    if (["transaction", "history", "table"].some((term) => normalizedQuery.includes(term))) {
      return "dashboard-transactions";
    }

    if (["insight", "observation", "summary"].some((term) => normalizedQuery.includes(term))) {
      return "dashboard-insights";
    }

    if (["profile", "user", "account"].some((term) => normalizedQuery.includes(term))) {
      return "dashboard-header";
    }

    if (matchedCategory) {
      return "dashboard-spending";
    }

    return null;
  };

  const activeDashboardTarget = resolveDashboardSearchTarget(dashboardSearch);

  useEffect(() => {
    if (!activeDashboardTarget) {
      return;
    }

    const element = document.getElementById(activeDashboardTarget);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeDashboardTarget]);

  const handleSidebarNavigate = (section) => {
    const sectionMap = {
      home: "dashboard-home",
      charts: "dashboard-charts",
      spending: "dashboard-spending",
      transactions: "dashboard-transactions",
      insights: "dashboard-insights",
      profile: "dashboard-header",
    };

    const elementId = sectionMap[section];

    if (!elementId) {
      return;
    }

    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOverviewClick = () => {
    setFilter({
      ...filter,
      period: "all",
    });
    setShowHistoryRange(false);
    handleSidebarNavigate("home");
  };

  const handleHistoryClick = () => {
    setShowHistoryRange(true);
    handleSidebarNavigate("charts");
  };

  if (showAdminPanel) {
    return (
      <div className="theme-app min-h-screen">
        <button
          onClick={() => setShowAdminPanel(false)}
          className="fixed top-4 left-4 z-40 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Dashboard
        </button>
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="theme-app flex min-h-screen">

      {/* Sidebar */}
      <SideBar
        onAdminClick={() => setShowAdminPanel(true)}
        onNavigate={handleSidebarNavigate}
        onOverviewClick={handleOverviewClick}
        onProfileClick={() => setShowProfile(true)}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-24 sm:ml-20 sm:pb-0">

        {/* Header */}
        <div id="dashboard-header" className="border-b px-4 pt-4 pb-4 theme-border sm:px-6 sm:pt-6">
          <HeadBar
            onAdminClick={() => setShowAdminPanel(true)}
            dashboardSearch={dashboardSearch}
            onDashboardSearchChange={setDashboardSearch}
          />
        </div>

        {/* Content */}
        <div id="dashboard-home" className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 rounded-2xl border border-amber-600/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

            {/* ================= LEFT SIDE ================= */}
            <div className="xl:col-span-2 flex flex-col gap-6">

              {/* Balance Card */}
              <div
                id="balance-card"
                className={`theme-gradient rounded-2xl p-6 shadow-lg ${activeDashboardTarget === "balance-card" ? "ring-2 ring-blue-400/60" : ""}`}
              >
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="theme-text-secondary text-sm">Available Balance</p>
                    <h2 className="text-3xl font-bold mt-2">${balance.toLocaleString()}</h2>
                    <p className={`text-sm mt-1 ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {loading ? "Refreshing..." : formatDelta(incomeDelta - expenseDelta)}
                    </p>
                    <p className="theme-text-muted text-xs mt-1">
                      {balanceDateLabel}
                    </p>
                  </div>

                  <div className="theme-surface-alt px-3 py-1 rounded-lg text-sm">
                    USD
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:gap-4">
                  <button
                    onClick={handleHistoryClick}
                    className="theme-surface-alt rounded-lg px-4 py-2"
                  >
                    History
                  </button>
                </div>
              </div>

              {/* Income */}
              <div
                id="income-card"
                className={`theme-surface rounded-2xl p-5 shadow-lg ${activeDashboardTarget === "income-card" ? "ring-2 ring-green-400/60" : ""}`}
              >
                <p className="theme-text-secondary text-sm">Income</p>
                <h3 className="text-2xl font-semibold mt-2">${income.toLocaleString()}</h3>
                <p className={`text-sm mt-1 ${incomeDelta >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatDelta(incomeDelta)}
                </p>

                <div className="mt-4 h-2 theme-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400"
                    style={{ width: `${incomeProgress}%` }}
                  ></div>
                </div>
                <p className="theme-text-muted mt-2 text-xs">
                  ${income.toLocaleString()} / ${progressGoal.toLocaleString()} current max
                </p>
              </div>

              {/* Expenses */}
              <div
                id="expenses-card"
                className={`theme-surface rounded-2xl p-5 shadow-lg ${activeDashboardTarget === "expenses-card" ? "ring-2 ring-red-400/60" : ""}`}
              >
                <p className="theme-text-secondary text-sm">Expenses</p>
                <h3 className="text-2xl font-semibold mt-2">${expenses.toLocaleString()}</h3>
                <p className={`text-sm mt-1 ${expenseDelta <= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatDelta(expenseDelta)}
                </p>

                <div className="mt-4 h-2 theme-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${expenseProgress}%` }}
                  ></div>
                </div>
                <p className="theme-text-muted mt-2 text-xs">
                  ${expenses.toLocaleString()} / ${progressGoal.toLocaleString()} current max
                </p>
              </div>

              <div
                id="savings-card"
                className={`theme-surface rounded-2xl p-5 shadow-lg ${activeDashboardTarget === "savings-card" ? "ring-2 ring-emerald-400/60" : ""}`}
              >
                <p className="theme-text-secondary text-sm">Savings</p>
                <h3 className="text-2xl font-semibold mt-2">${savings.toLocaleString()}</h3>
                <p className={`text-sm mt-1 ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {loading ? "Refreshing..." : `${savings === 0 ? "No savings yet" : `${savingsProgress.toFixed(0)}% of current max`}`}
                </p>

                <div className="mt-4 h-2 theme-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${savingsProgress}%` }}
                  ></div>
                </div>
                <p className="theme-text-muted mt-2 text-xs">
                  ${savings.toLocaleString()} / ${progressGoal.toLocaleString()} current max
                </p>
              </div>

              {/* Balance Chart */}
              <div
                id="dashboard-charts"
                className={`theme-surface min-h-[360px] rounded-2xl p-4 shadow-lg ${activeDashboardTarget === "dashboard-charts" ? "ring-2 ring-blue-400/60" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm theme-text-secondary">Balance Trend</h3>
                  {showHistoryRange && (
                    <button
                      type="button"
                      onClick={() => setShowHistoryRange(false)}
                      className="theme-surface-alt rounded-lg px-3 py-1 text-xs"
                    >
                      Show full trend
                    </button>
                  )}
                </div>
                {showHistoryRange && (
                  <p className="theme-text-muted mb-3 text-xs">
                    Showing balance history for the latest 4 months.
                  </p>
                )}
                <BalanceChart monthsToShow={showHistoryRange ? 4 : null} />
              </div>

              {/* Pie Chart */}
              <div
                id="dashboard-spending"
                className={`theme-surface rounded-2xl p-4 ${activeDashboardTarget === "dashboard-spending" ? "ring-2 ring-orange-400/60" : ""}`}
              >
                <h3 className="text-sm theme-text-secondary mb-2">Spending Breakdown</h3>
                <CategoryPie matchedCategory={matchedCategory} />
              </div>

            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div
              id="dashboard-transactions"
              className={`xl:col-span-2 theme-surface flex flex-col rounded-2xl p-4 shadow-lg sm:p-6 ${activeDashboardTarget === "dashboard-transactions" ? "ring-2 ring-cyan-400/60" : ""}`}
            >

              <h2 className="text-lg font-semibold mb-4">
                Transactions
              </h2>

              <TransactionsTable />
              <div
                id="dashboard-insights"
                className={`mt-6 border-t pt-6 theme-border ${activeDashboardTarget === "dashboard-insights" ? "rounded-2xl ring-2 ring-pink-400/60 p-4" : ""}`}
              >
                <div className="mb-3">
                  <p className="theme-text-secondary text-sm">Insights</p>
                  <h3 className="text-lg font-semibold">Spending observations</h3>
                </div>
                <Insights />
              </div>

            </div>

          </div>

          <footer className="mt-10 rounded-3xl border theme-border theme-surface-soft px-5 py-6 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <p className="theme-text-secondary text-sm">Finance Dashboard</p>
                <h3 className="mt-1 text-xl font-semibold">Need help or want to reach out?</h3>
                <p className="theme-text-muted mt-2 text-sm">
                  This demo footer gives the dashboard a more complete product feel. You can replace
                  these details later with your real support and company information.
                </p>
              </div>

              <div>
                <p className="theme-text-secondary text-sm">Contact</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p>Support: support@financedashboard.app</p>
                  <p>Phone: +1 (800) 555-0147</p>
                  <p>Hours: Mon-Fri, 9:00 AM to 6:00 PM</p>
                </div>
              </div>

              <div>
                <p className="theme-text-secondary text-sm">Quick Links</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setShowProfile(true)}
                    className="theme-surface-alt rounded-full px-3 py-2"
                  >
                    Contact Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarNavigate("transactions")}
                    className="theme-surface-alt rounded-full px-3 py-2"
                  >
                    View Transactions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarNavigate("insights")}
                    className="theme-surface-alt rounded-full px-3 py-2"
                  >
                    Open Insights
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t pt-4 theme-border sm:flex-row sm:items-center sm:justify-between">
              <p className="theme-text-muted text-xs">
                © 2026 Finance Dashboard. Built for assignment review and frontend evaluation.
              </p>
              <p className="theme-text-muted text-xs">
                Data source status is shown in the sidebar indicators.
              </p>
            </div>
          </footer>

        </div>

      </div>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="theme-surface w-full max-w-md rounded-3xl border theme-border p-4 shadow-2xl sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="theme-text-secondary text-sm">Profile</p>
                <h2 className="text-2xl font-semibold mt-1">{user?.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="theme-surface-alt rounded-full px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="theme-surface-alt rounded-2xl p-4">
                <p className="theme-text-secondary text-xs uppercase tracking-wide">Username</p>
                <p className="mt-1 text-lg font-medium">{user?.username}</p>
              </div>

              <div className="theme-surface-alt rounded-2xl p-4">
                <p className="theme-text-secondary text-xs uppercase tracking-wide">Access Level</p>
                <p className="mt-1 text-lg font-medium capitalize">{role}</p>
              </div>

              <div className="theme-surface-alt rounded-2xl p-4">
                <p className="theme-text-secondary text-xs uppercase tracking-wide">Session Started</p>
                <p className="mt-1 text-sm">
                  {user?.loginTime
                    ? new Date(user.loginTime).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
