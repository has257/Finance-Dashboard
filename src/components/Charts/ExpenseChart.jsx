import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart() {
  const data = [
    { month: "Jan", expense: 2400 },
    { month: "Feb", expense: 1398 },
    { month: "Mar", expense: 3800 },
    { month: "Apr", expense: 2900 },
    { month: "May", expense: 3200 },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Expenses
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expense" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}