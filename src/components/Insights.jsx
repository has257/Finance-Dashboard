import React from "react";
import useFinanceData from "../hooks/useFinancedata";

const Insights = () => {
  const { highestSpendingCategory, monthlyComparison, observation } = useFinanceData();

  return (
    <div className="theme-surface p-5 rounded-2xl shadow-lg mt-4">
      <h2 className="text-sm theme-text-secondary mb-3">Insights</h2>

      <p>
        <span className="theme-text-secondary">Highest Spending Category:</span>{" "}
        {highestSpendingCategory}
      </p>
      <p className="mt-2">
        <span className="theme-text-secondary">Monthly Comparison:</span>
      </p>

      {monthlyComparison.map((month) => (
        <p key={month.month} className="text-sm theme-text-secondary">
          {month.label} → Income: ${month.income.toLocaleString()} | Expense: ${month.expense.toLocaleString()}
        </p>
      ))}

      <p className="mt-3">
        <span className="theme-text-secondary">Observation:</span> {observation}
      </p>
    </div>
  );
};

export default Insights;
