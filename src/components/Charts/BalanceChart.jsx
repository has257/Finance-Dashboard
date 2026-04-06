import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import useFinanceData from "../../hooks/useFinancedata";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="theme-surface rounded-xl border theme-border px-4 py-3 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-green-400">Income: ${point.income.toLocaleString()}</p>
      <p className="text-red-400">Expenses: ${point.expense.toLocaleString()}</p>
      <p className="text-blue-400">Balance: ${point.balance.toLocaleString()}</p>
      {point.incomeBreakdown?.length > 0 && (
        <p className="mt-2 text-xs theme-text-secondary">
          Income mix: {point.incomeBreakdown.slice(0, 2).map((item) => `${item.name} (${item.value})`).join(", ")}
        </p>
      )}
      {point.expenseBreakdown?.length > 0 && (
        <p className="text-xs theme-text-secondary">
          Expense mix: {point.expenseBreakdown.slice(0, 2).map((item) => `${item.name} (${item.value})`).join(", ")}
        </p>
      )}
    </div>
  );
}

export default function BalanceChart({ monthsToShow = null }) {
  const { monthlyComparison } = useFinanceData();
  const chartSource =
    monthsToShow && monthlyComparison.length > monthsToShow
      ? monthlyComparison.slice(-monthsToShow)
      : monthlyComparison;
  const data = chartSource.length
    ? chartSource.map((month) => ({
        month: month.label,
        income: month.income,
        expense: month.expense,
        balance: month.balance,
        incomeBreakdown: month.incomeBreakdown,
        expenseBreakdown: month.expenseBreakdown,
      }))
    : [{ month: "No data", income: 0, expense: 0, balance: 0, incomeBreakdown: [], expenseBreakdown: [] }];

  return (
    <div className="h-[300px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid stroke="#1f2937" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<TrendTooltip />} />
          <Legend />
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
