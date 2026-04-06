import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import useFinanceData from "../../hooks/useFinancedata";

export default function CategoryPie({ matchedCategory = null }) {
  const [view, setView] = useState("expense");
  const { spendingBreakdown, incomeBreakdown } = useFinanceData();
  const effectiveView = matchedCategory
    ? matchedCategory.income >= matchedCategory.expense
      ? "income"
      : "expense"
    : view;

  const sourceData = effectiveView === "expense" ? spendingBreakdown : incomeBreakdown;
  const data = sourceData.length
    ? sourceData
    : [{ name: effectiveView === "expense" ? "No expenses" : "No income", value: 1 }];

  const COLORS = effectiveView === "expense"
    ? ["#ef4444", "#f97316", "#f59e0b", "#ec4899", "#8b5cf6"]
    : ["#22c55e", "#10b981", "#3b82f6", "#14b8a6", "#84cc16"];

  return (
    <div className="theme-surface p-6 rounded-2xl shadow-lg">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setView("expense")}
          className={`rounded-lg px-3 py-2 text-sm transition ${effectiveView === "expense" ? "bg-red-500 text-white" : "theme-surface-alt"}`}
        >
          Expense Categories
        </button>
        <button
          type="button"
          onClick={() => setView("income")}
          className={`rounded-lg px-3 py-2 text-sm transition ${effectiveView === "income" ? "bg-green-500 text-black" : "theme-surface-alt"}`}
        >
          Income Categories
        </button>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={60}
            labelLine={{ stroke: "#9ca3af" }}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={
                  matchedCategory && entry.name.toLowerCase() !== matchedCategory.name.toLowerCase()
                    ? 0.35
                    : 1
                }
                stroke={
                  matchedCategory && entry.name.toLowerCase() === matchedCategory.name.toLowerCase()
                    ? "#f8fafc"
                    : "none"
                }
                strokeWidth={matchedCategory && entry.name.toLowerCase() === matchedCategory.name.toLowerCase() ? 2 : 0}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {sourceData.slice(0, 5).map((item, index) => (
          <div
            key={item.name}
            className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm ${
              matchedCategory && item.name.toLowerCase() === matchedCategory.name.toLowerCase()
                ? "theme-surface-alt"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{item.name}</span>
            </div>
            <span className="theme-text-secondary">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
