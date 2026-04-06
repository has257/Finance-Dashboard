import { useFinance } from "../Context/FinanceContext";

function formatMonthKey(date) {
  const parsedDate = new Date(date);

  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleString("default", { month: "short" });
}

function mapCategoryTotals(transactions) {
  return transactions.reduce((totals, transaction) => {
    totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
    return totals;
  }, {});
}

function sortBreakdown(categoryTotals) {
  return Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((itemA, itemB) => itemB.value - itemA.value);
}

export default function useFinanceData() {
  const { transactions, filter } = useFinance();
  const sortedTransactions = [...transactions].sort(
    (transactionA, transactionB) => new Date(transactionA.date) - new Date(transactionB.date)
  );
  const latestTransaction = sortedTransactions[sortedTransactions.length - 1] || null;
  const latestMonthKey = latestTransaction ? formatMonthKey(latestTransaction.date) : null;
  const scopedTransactions =
    filter.period === "monthly" && latestMonthKey
      ? transactions.filter((transaction) => formatMonthKey(transaction.date) === latestMonthKey)
      : transactions;

  const incomeTransactions = scopedTransactions.filter((transaction) => transaction.type === "income");
  const expenseTransactions = scopedTransactions.filter((transaction) => transaction.type === "expense");

  const income = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = income - expenses;

  const spendingBreakdown = sortBreakdown(mapCategoryTotals(expenseTransactions));
  const incomeBreakdown = sortBreakdown(mapCategoryTotals(incomeTransactions));

  const highestSpendingCategory = spendingBreakdown.length
    ? spendingBreakdown.reduce((highest, current) =>
        current.value > highest.value ? current : highest
      ).name
    : "None";

  const monthlyMap = scopedTransactions.reduce((months, transaction) => {
    const monthKey = formatMonthKey(transaction.date);

    if (!months[monthKey]) {
      months[monthKey] = {
        income: 0,
        expense: 0,
        incomeCategories: {},
        expenseCategories: {},
      };
    }

    months[monthKey][transaction.type] += transaction.amount;
    const categoryKey = transaction.type === "income" ? "incomeCategories" : "expenseCategories";
    months[monthKey][categoryKey][transaction.category] =
      (months[monthKey][categoryKey][transaction.category] || 0) + transaction.amount;
    return months;
  }, {});

  const monthlyComparison = Object.entries(monthlyMap)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, totals]) => ({
      month,
      label: formatMonthLabel(month),
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
      incomeBreakdown: sortBreakdown(totals.incomeCategories),
      expenseBreakdown: sortBreakdown(totals.expenseCategories),
    }));

  const latestMonth = monthlyComparison[monthlyComparison.length - 1] || null;
  const previousMonth = monthlyComparison[monthlyComparison.length - 2] || null;

  let observation = "Add a few more transactions to surface a monthly trend.";
  let balanceChange = 0;

  if (latestMonth && previousMonth) {
    balanceChange = latestMonth.balance - previousMonth.balance;

    if (latestMonth.expense > latestMonth.income) {
      observation = `Expenses exceeded income in ${latestMonth.label}.`;
    } else if (balanceChange > 0) {
      observation = `Net balance improved in ${latestMonth.label}.`;
    } else if (balanceChange < 0) {
      observation = `Net balance softened in ${latestMonth.label}.`;
    } else {
      observation = `Income and expenses were stable in ${latestMonth.label}.`;
    }
  } else if (latestMonth) {
    observation =
      latestMonth.expense > latestMonth.income
        ? `Expenses exceeded income in ${latestMonth.label}.`
        : `Income stayed ahead of expenses in ${latestMonth.label}.`;
  }

  const latestTransactionDate = scopedTransactions.length
    ? new Date(
        [...scopedTransactions].sort((transactionA, transactionB) => {
          return new Date(transactionB.date) - new Date(transactionA.date);
        })[0].date
      )
    : null;

  const incomeDelta = previousMonth
    ? latestMonth.income - previousMonth.income
    : latestMonth
      ? latestMonth.income
      : 0;

  const expenseDelta = previousMonth
    ? latestMonth.expense - previousMonth.expense
    : latestMonth
      ? latestMonth.expense
      : 0;

  return {
    transactions: scopedTransactions,
    allTransactions: transactions,
    income,
    expenses,
    balance,
    spendingBreakdown,
    incomeBreakdown,
    highestSpendingCategory,
    monthlyComparison,
    latestMonth,
    previousMonth,
    latestTransactionDate,
    observation,
    incomeDelta,
    expenseDelta,
    balanceChange,
  };
}
