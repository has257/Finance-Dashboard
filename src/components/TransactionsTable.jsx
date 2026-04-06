import React, { useState } from "react";
import { useFinance } from "../Context/FinanceContext";
import { useAuth } from "../Context/AuthContext";

export default function TransactionsTable() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    filter,
    setFilter,
    loading,
    error,
  } = useFinance();
  const { hasRole } = useAuth();
  const canAddTransactions = hasRole("admin");
  const canManageTransactions = hasRole("admin");

  const [newTransaction, setNewTransaction] = useState({
    date: "",
    category: "",
    type: "expense",
    amount: "",
  });
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState({
    date: "",
    category: "",
    type: "expense",
    amount: "",
  });

  const handleAddTransaction = async () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date) {
      setFormError("Date, category, and amount are required.");
      return;
    }

    setFormError("");

    await addTransaction({
      ...newTransaction,
      amount: Number(newTransaction.amount),
    });

    setNewTransaction({
      date: "",
      category: "",
      type: "expense",
      amount: "",
    });
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
  };

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction({
      date: transaction.date,
      category: transaction.category,
      type: transaction.type,
      amount: String(transaction.amount),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTransaction({
      date: "",
      category: "",
      type: "expense",
      amount: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction.category || !editingTransaction.amount || !editingTransaction.date) {
      alert("Please fill all fields");
      return;
    }

    const updated = await updateTransaction(editingId, {
      ...editingTransaction,
      amount: Number(editingTransaction.amount),
    });

    if (updated) {
      cancelEditing();
    }
  };

  const latestDate = transactions.length
    ? new Date(
        [...transactions].sort((transactionA, transactionB) => {
          return new Date(transactionB.date) - new Date(transactionA.date);
        })[0].date
      )
    : null;

  let filteredData = transactions
    .filter((t) =>
      t.category.toLowerCase().includes(filter.search.toLowerCase())
    )
    .filter((t) =>
      filter.type === "all" ? true : t.type === filter.type
    )
    .filter((t) =>
      filter.period === "monthly"
        ? latestDate
          ? (() => {
              const transactionDate = new Date(t.date);
              return (
                transactionDate.getFullYear() === latestDate.getFullYear() &&
                transactionDate.getMonth() === latestDate.getMonth()
              );
            })()
          : true
        : true
    );

  let sortedData = [...filteredData];

  if (filter.sort === "latest") {
    sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (filter.sort === "oldest") {
    sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filter.sort === "high") {
    sortedData.sort((a, b) => b.amount - a.amount);
  } else if (filter.sort === "low") {
    sortedData.sort((a, b) => a.amount - b.amount);
  }

  return (
    <div>

      {/* 🔥 Controls */}
      <div className="flex gap-2 flex-wrap mb-5">

        <select
          value={filter.sort}
          onChange={(e) =>
            setFilter({ ...filter, sort: e.target.value })
          }
          className="theme-input px-3 py-2 rounded-lg text-sm"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="high">Amount High</option>
          <option value="low">Amount Low</option>
        </select>

        <input
          placeholder="Search category..."
          value={filter.search}
          onChange={(e) =>
            setFilter({ ...filter, search: e.target.value })
          }
          className="theme-input px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-400"
        />

        <select
          value={filter.type}
          onChange={(e) =>
            setFilter({ ...filter, type: e.target.value })
          }
          className="theme-input px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-600/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      {canAddTransactions && (
        <div className="theme-surface-alt p-4 rounded-xl mb-5 flex gap-2 flex-wrap">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm">
              <span className="text-red-400">*</span> Required fields for new transactions
            </p>
            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>

          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            aria-label="Date"
            className={`theme-surface px-2 py-1 rounded text-sm outline-none ${formError && !newTransaction.date ? "ring-1 ring-red-400" : ""}`}
          />

          <input
            placeholder="Category *"
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            className={`theme-surface px-2 py-1 rounded text-sm outline-none ${formError && !newTransaction.category ? "ring-1 ring-red-400" : ""}`}
          />

          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            className="theme-surface px-2 py-1 rounded text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount *"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            className={`theme-surface px-2 py-1 rounded text-sm outline-none ${formError && !newTransaction.amount ? "ring-1 ring-red-400" : ""}`}
          />

          <button
            onClick={handleAddTransaction}
            className="bg-green-500 px-4 py-1 rounded-lg text-black font-semibold hover:bg-green-400 transition"
          >
            Add
          </button>

        </div>
      )}

      {/* 🔥 Table */}
      <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">

        <thead className="theme-text-secondary border-b theme-border">
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Category</th>
            <th className="text-left py-2">Type</th>
            <th className="text-right py-2">Amount</th>
            {canManageTransactions && (
              <th className="text-right py-2">Action</th>
            )}
          </tr>
        </thead>

        <tbody className="theme-text-secondary">

          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4 theme-text-muted">
                Loading transactions...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 theme-text-muted">
                No transactions found
              </td>
            </tr>
          ) : (
            sortedData.map((t) => (
              <tr key={t.id} className="border-b theme-border transition hover:opacity-80">

                <td className="py-3">
                  {editingId === t.id ? (
                    <input
                      type="date"
                      value={editingTransaction.date}
                      onChange={(event) =>
                        setEditingTransaction({ ...editingTransaction, date: event.target.value })
                      }
                      className="theme-surface w-full rounded px-2 py-1 text-sm outline-none"
                    />
                  ) : (
                    t.date
                  )}
                </td>

                <td className="font-medium">
                  {editingId === t.id ? (
                    <input
                      value={editingTransaction.category}
                      onChange={(event) =>
                        setEditingTransaction({ ...editingTransaction, category: event.target.value })
                      }
                      className="theme-surface w-full rounded px-2 py-1 text-sm outline-none"
                    />
                  ) : (
                    t.category
                  )}
                </td>

                <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                  {editingId === t.id ? (
                    <select
                      value={editingTransaction.type}
                      onChange={(event) =>
                        setEditingTransaction({ ...editingTransaction, type: event.target.value })
                      }
                      className="theme-surface w-full rounded px-2 py-1 text-sm outline-none"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  ) : (
                    t.type
                  )}
                </td>

                <td className="text-right font-semibold">
                  {editingId === t.id ? (
                    <input
                      type="number"
                      value={editingTransaction.amount}
                      onChange={(event) =>
                        setEditingTransaction({ ...editingTransaction, amount: event.target.value })
                      }
                      className="theme-surface w-28 rounded px-2 py-1 text-right text-sm outline-none"
                    />
                  ) : (
                    `$${t.amount.toLocaleString()}`
                  )}
                </td>

                {canManageTransactions && (
                  <td className="text-right">
                    <div className="flex justify-end gap-3">
                      {editingId === t.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-400 hover:text-green-300 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="theme-text-secondary hover:text-white transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(t)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))
          )}

        </tbody>

      </table>
      </div>

    </div>
  );
}
