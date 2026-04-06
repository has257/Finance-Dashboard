/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();
const API_URL = "https://finance-mock-api.onrender.com/transactions";
const FALLBACK_TRANSACTIONS = [
  { id: 1, date: "2025-01-03", category: "Salary", type: "income", amount: 4500 },
  { id: 2, date: "2025-01-05", category: "Rent", type: "expense", amount: 1400 },
  { id: 3, date: "2025-01-08", category: "Food", type: "expense", amount: 260 },
  { id: 4, date: "2025-01-15", category: "Freelance", type: "income", amount: 1800 },
  { id: 5, date: "2025-02-02", category: "Salary", type: "income", amount: 4500 },
  { id: 6, date: "2025-02-06", category: "Utilities", type: "expense", amount: 320 },
  { id: 7, date: "2025-02-11", category: "Shopping", type: "expense", amount: 680 },
  { id: 8, date: "2025-02-17", category: "Investments", type: "income", amount: 950 },
  { id: 9, date: "2025-03-01", category: "Salary", type: "income", amount: 4500 },
  { id: 10, date: "2025-03-04", category: "Travel", type: "expense", amount: 1200 },
  { id: 11, date: "2025-03-09", category: "Food", type: "expense", amount: 310 },
  { id: 12, date: "2025-03-21", category: "Bonus", type: "income", amount: 2200 },
  { id: 13, date: "2025-04-03", category: "Salary", type: "income", amount: 4500 },
  { id: 14, date: "2025-04-08", category: "Healthcare", type: "expense", amount: 540 },
  { id: 15, date: "2025-04-14", category: "Entertainment", type: "expense", amount: 390 },
  { id: 16, date: "2025-04-25", category: "Freelance", type: "income", amount: 1600 },
  { id: 17, date: "2025-05-02", category: "Salary", type: "income", amount: 4600 },
  { id: 18, date: "2025-05-07", category: "Rent", type: "expense", amount: 1400 },
  { id: 19, date: "2025-05-18", category: "Transportation", type: "expense", amount: 210 },
  { id: 20, date: "2025-05-22", category: "Dividends", type: "income", amount: 700 },
  { id: 21, date: "2025-06-03", category: "Salary", type: "income", amount: 4600 },
  { id: 22, date: "2025-06-09", category: "Food", type: "expense", amount: 340 },
  { id: 23, date: "2025-06-12", category: "Shopping", type: "expense", amount: 890 },
  { id: 24, date: "2025-06-24", category: "Side Hustle", type: "income", amount: 1250 },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(FALLBACK_TRANSACTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataStatus, setDataStatus] = useState("loading");

  const [filter, setFilter] = useState({
    search: "",
    type: "all",
    sort: "latest",
    period: "all",
  });

  const refreshTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data);
      setDataStatus("connected");
    } catch {
      setTransactions(FALLBACK_TRANSACTIONS);
      setError("Mock API is not running. Using local demo transactions.");
      setDataStatus("fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    const optimisticTransaction = {
      ...transaction,
      id: transaction.id || Date.now(),
      amount: Number(transaction.amount),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optimisticTransaction),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const savedTransaction = await response.json();
      setTransactions((prev) => [savedTransaction, ...prev]);
      setError("");
      setDataStatus("connected");
      return savedTransaction;
    } catch {
      setTransactions((prev) => [optimisticTransaction, ...prev]);
      setError("Could not persist to the mock API. Saved locally for this session.");
      setDataStatus("fallback");
      return optimisticTransaction;
    }
  };

  const deleteTransaction = async (transactionId) => {
    const previousTransactions = transactions;
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== transactionId));

    try {
      const response = await fetch(`${API_URL}/${transactionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setError("");
      setDataStatus("connected");
      return true;
    } catch {
      setTransactions(previousTransactions);
      setError("Could not delete from the mock API.");
      setDataStatus("error");
      return false;
    }
  };

  const updateTransaction = async (transactionId, updates) => {
    const previousTransactions = transactions;
    const normalizedTransaction = {
      ...previousTransactions.find((transaction) => transaction.id === transactionId),
      ...updates,
      amount: Number(updates.amount),
    };

    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId ? normalizedTransaction : transaction
      )
    );

    try {
      const response = await fetch(`${API_URL}/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedTransaction),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const savedTransaction = await response.json();
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === transactionId ? savedTransaction : transaction
        )
      );
      setError("");
      setDataStatus("connected");
      return savedTransaction;
    } catch {
      setTransactions(previousTransactions);
      setError("Could not update the transaction in the mock API.");
      setDataStatus("error");
      return null;
    }
  };

  const value = {
    transactions,
    setTransactions,
    refreshTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    filter,
    setFilter,
    loading,
    error,
    dataStatus,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// ✅ Custom hook
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
};
