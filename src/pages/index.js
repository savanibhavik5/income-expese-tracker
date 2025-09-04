import React, { useState, useEffect } from "react";
import { BillPayment } from "./BillPayment";
import Income from "./Income";
import Dashboard from "./Dashboard";
import Expense from "./Expense";
import Dues from "./Dues";

export default function App() {
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionDate, setTransactionDate] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const fetchIncomeData = async () => {
    try {
      const res = await fetch("/api/getIncome");
      const json = await res.json();
      if (json.data) {
        setMonthlyIncomes(
          json.data.map((row, idx) => ({
            id: `inc${idx}`,
            sheetIndex: idx + 2,
            date: row[0],
            amount: parseFloat(row[1]),
            source: row[2],
            description: row[3],
          }))
        );
      }
    } catch (err) {
      setError("Failed to fetch income data");
    }
    setLoading(false);
  };

  const fetchExpenseData = async () => {
    try {
      const res = await fetch("/api/getExpense", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const json = await res.json();
      if (json.data) {
        setTransactions(
          json.data.map((row, idx) => ({
            id: `exp${idx}`,
            sheetIndex: idx + 2,
            date: row[0],
            amount: parseFloat(row[1]),
            paymentMethod: row[2],
            category: row[3],
            description: row[4],
          }))
        );
      }
    } catch (err) {
      setError("Failed to fetch expense data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const todayString = `${year}-${month}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}`;

    setSelectedMonth(`${year}-${month}`);
    setSelectedYear(year.toString());
    setTransactionDate(todayString);
  }, []);

  useEffect(() => {
    fetchExpenseData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6 font-sans antialiased text-gray-800">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-600 text-center">
            Personal Expense Tracker
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 p-3 sm:p-4 text-sm sm:text-base text-red-700 bg-red-100 rounded-lg shadow-md"
            role="alert"
          >
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 ease-in-out ${
              currentPage === "dashboard"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("income")}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 ease-in-out ${
              currentPage === "income"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setCurrentPage("expenses")}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 ease-in-out ${
              currentPage === "expenses"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setCurrentPage("billpayment")}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 ease-in-out ${
              currentPage === "billpayment"
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Bill Payment
          </button>
          <button
            onClick={() => setCurrentPage("dues")}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 ease-in-out ${
              currentPage === "dues"
                ? "bg-amber-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dues
          </button>
        </div>

        {/* Dynamic Pages */}
        <div className="mt-6">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "income" && <Income />}
          {currentPage === "expenses" && <Expense />}
          {currentPage === "billpayment" && <BillPayment />}
          {currentPage === "dues" && <Dues />}
        </div>
      </div>
    </div>
  );
}
