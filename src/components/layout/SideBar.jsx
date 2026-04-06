import {
  Home,
  BarChart3,
  PieChart,
  CreditCard,
  Lightbulb,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useFinance } from "../../Context/FinanceContext";
import { AdminOnly } from "../ProtectedComponent";

export default function Sidebar({ onAdminClick, onNavigate, onOverviewClick, onProfileClick, theme, onThemeChange }) {
  const { logout } = useAuth();
  const { dataStatus } = useFinance();
  const [activeItem, setActiveItem] = useState("home");

  const statusLabels = {
    connected: "API connected",
    fallback: "Using fallback demo data",
    error: "Recent API action failed",
    loading: "Checking data source",
  };

  const handleNavigate = (section) => {
    setActiveItem(section);
    onNavigate?.(section);
  };

  return (
    <div className="theme-sidebar fixed inset-x-0 bottom-0 z-40 flex h-20 items-center justify-between border-t px-4 sm:top-0 sm:bottom-auto sm:left-0 sm:right-auto sm:h-screen sm:w-20 sm:flex-col sm:justify-between sm:border-r sm:border-t-0 sm:px-0 sm:py-6">

      {/* TOP SECTION */}
      <div className="hidden sm:flex sm:flex-col sm:items-center sm:gap-6">
        {/* Small dots */}
        <div className="flex gap-2" title={statusLabels[dataStatus] || "Status unknown"}>
          <div className={`h-2 w-2 rounded-full ${dataStatus === "connected" ? "bg-green-400" : "bg-green-400/20"}`}></div>
          <div className={`h-2 w-2 rounded-full ${dataStatus === "fallback" || dataStatus === "loading" ? "bg-yellow-400" : "bg-yellow-400/20"}`}></div>
          <div className={`h-2 w-2 rounded-full ${dataStatus === "error" ? "bg-red-400" : "bg-red-400/20"}`}></div>
        </div>

        {/* Main icon */}
        <button
          type="button"
          title="Overview"
          onClick={onOverviewClick}
          className="theme-surface-alt p-4 rounded-full transition hover:scale-105"
        >
          <LayoutDashboard className="text-green-400" />
        </button>
      </div>

      {/* MIDDLE MENU */}
      <div className="flex items-center gap-2 sm:flex-col sm:gap-6">
        <Icon title="Home" isActive={activeItem === "home"} onClick={() => handleNavigate("home")}>
          <Home />
        </Icon>
        <Icon title="Analytics" isActive={activeItem === "charts"} onClick={() => handleNavigate("charts")}>
          <BarChart3 />
        </Icon>
        <Icon title="Spending" isActive={activeItem === "spending"} onClick={() => handleNavigate("spending")}>
          <PieChart />
        </Icon>
        <Icon title="Transactions" isActive={activeItem === "transactions"} onClick={() => handleNavigate("transactions")}>
          <CreditCard />
        </Icon>
        <Icon title="Insights" isActive={activeItem === "insights"} onClick={() => handleNavigate("insights")}>
          <Lightbulb />
        </Icon>
        
        {/* Admin Only - Lock Icon */}
        <AdminOnly fallback={<span className="hidden" aria-hidden="true" />}>
          <Icon 
            title="Admin Panel" 
            onClick={onAdminClick}
            className="bg-purple-900/50 hover:bg-purple-800"
          >
            <Lock className="text-purple-400" />
          </Icon>
        </AdminOnly>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex items-center gap-2 sm:flex-col sm:gap-4">
        <div className="theme-toggle hidden rounded-full p-3 sm:flex sm:flex-col sm:items-center sm:gap-2">
          <button
            type="button"
            title="Light mode"
            onClick={() => onThemeChange?.("light")}
            className={`transition ${theme === "light" ? "text-yellow-500" : "theme-text-secondary hover:text-yellow-300"}`}
          >
            <Sun />
          </button>
          <button
            type="button"
            title="Dark mode"
            onClick={() => onThemeChange?.("dark")}
            className={`transition ${theme === "dark" ? "text-blue-300" : "theme-text-secondary hover:text-blue-300"}`}
          >
            <Moon />
          </button>
        </div>

        <Icon
          title="Profile"
          isActive={activeItem === "profile"}
          onClick={() => {
            setActiveItem("profile");
            onProfileClick?.();
          }}
        >
          <User />
        </Icon>
        <Icon 
          title="Logout" 
          onClick={logout}
          className="hover:bg-red-900"
        >
          <LogOut className="text-red-400" />
        </Icon>
      </div>
    </div>
  );
}

function Icon({ children, title, onClick, className = "", isActive = false }) {
  return (
    <button
      type="button"
      className={`theme-icon-button rounded-full p-3 transition sm:cursor-pointer ${isActive ? "is-active ring-1 ring-green-400/40" : ""} ${className}`}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
