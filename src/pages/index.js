import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SalaryBreakdownChart from "../component/salaryBreakdownChart";
import LoadingSpinner from "../component/loadingSpinner";
import LoadingSpinner1 from "../component/loadingSpinner";
import { BillPayment } from "./BillPayment";
import { Expense } from "./Expense";
import Income from "./Income";
import Dashboard from "./Dashboard";

// Firebase imports ko comment kiya gaya hai
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithCustomToken, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
// import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Firestore के लिए वैश्विक चर को comment kiya gaya hai
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// HTML के लिए SVG icons
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-square-pen"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-trash"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-x-circle"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default function App() {
  // Firebase state variables ko comment kiya gaya hai
  // const [db, setDb] = useState(null);
  // const [auth, setAuth] = useState(null);
  // const [userId, setUserId] = useState(null);
  // const [isAuthReady, setIsAuthReady] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // App data state
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [viewType, setViewType] = useState("month");

  // Dummy data set kiya gaya hai kyunki Firebase se data nahi aa raha hai
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [creditCardPayments, setCreditCardPayments] = useState([
    {
      id: "ccp1",
      amount: 13000,
      description: "CC Bill Payment",
      date: "2025-07-28",
    },
  ]);
  const [creditCardLimit, setCreditCardLimit] = useState(100000);

  // Forms state
  const [expense, setExpense] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("Axis Bank");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeSource, setIncomeSource] = useState("Axis Bank");
  const [transactionDate, setTransactionDate] = useState("");
  const [creditCardPaymentAmount, setCreditCardPaymentAmount] = useState("");
  const [creditCardPaymentDescription, setCreditCardPaymentDescription] =
    useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // const handleAddIncome = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   try {
  //     const res = await fetch("/api/addIncome", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         date: transactionDate,
  //         amount: parseFloat(incomeAmount),
  //         source: incomeSource,
  //         description: incomeDescription,
  //       }),
  //     });
  //     if (!res.ok) throw new Error("Failed to add income");
  //     await fetchIncomeData(); // Sheet se latest data fetch karein
  //     setIncomeAmount("");
  //     setIncomeDescription("");
  //     setIncomeSource("Axis Bank");
  //     setTransactionDate(new Date().toISOString().slice(0, 10));
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // const handleAddIncome = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   try {
  //     if (editingItem && editingItem.sheetIndex) {
  //       // Edit mode: update existing entry
  //       const res = await fetch("/api/updateIncome", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           sheetIndex: editingItem.sheetIndex,
  //           date: transactionDate,
  //           amount: parseFloat(incomeAmount),
  //           source: incomeSource,
  //           description: incomeDescription,
  //         }),
  //       });
  //       if (!res.ok) throw new Error("Failed to update income");
  //       setEditingItem(null);
  //     } else {
  //       // Add mode: create new entry
  //       const res = await fetch("/api/addIncome", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           date: transactionDate,
  //           amount: parseFloat(incomeAmount),
  //           source: incomeSource,
  //           description: incomeDescription,
  //         }),
  //       });
  //       if (!res.ok) throw new Error("Failed to add income");
  //     }
  //     await fetchIncomeData();
  //     setIncomeAmount("");
  //     setIncomeDescription("");
  //     setIncomeSource("Axis Bank");
  //     setTransactionDate(new Date().toISOString().slice(0, 10));
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   try {
  //     if (editingItem && editingItem.sheetIndex) {
  //       // Update mode
  //       const res = await fetch("/api/updateIncome", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           sheetIndex: editingItem.sheetIndex,
  //           date: transactionDate,
  //           amount: parseFloat(incomeAmount),
  //           source: incomeSource,
  //           description: incomeDescription,
  //         }),
  //       });
  //       if (!res.ok) throw new Error("Failed to update income");
  //       setEditingItem(null);
  //     } else {
  //       // Add mode
  //       const res = await fetch("/api/addIncome", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           date: transactionDate,
  //           amount: parseFloat(incomeAmount),
  //           source: incomeSource,
  //           description: incomeDescription,
  //         }),
  //       });
  //       if (!res.ok) throw new Error("Failed to add income");
  //     }
  //     await fetchIncomeData();
  //     setIncomeAmount("");
  //     setIncomeDescription("");
  //     setIncomeSource("Axis Bank");
  //     setTransactionDate(new Date().toISOString().slice(0, 10));
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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
    setLoading(false); // <-- Add this line
  };

  const fetchExpenseData = async () => {
    try {
      const res = await fetch("/api/getExpense");
      const json = await res.json();
      if (json.data) {
        setTransactions(
          json.data.map((row, idx) => ({
            id: `exp${idx}`,
            sheetIndex: idx + 2,
            date: row[0],
            amount: parseFloat(row[1]),
            category: row[2],
            paymentMethod: row[3],
            description: row[4],
          }))
        );
      }
    } catch (err) {
      setError("Failed to fetch expense data");
    }
    setLoading(false); // <-- Add this line
  };
  // ...existing code...
  useEffect(() => {
    fetchIncomeData();
  }, []);

  // Firebase initialization and authentication ko comment kiya gaya hai
  // useEffect(() => {
  //   const initFirebase = async () => {
  //     try {
  //       const app = initializeApp(firebaseConfig);
  //       const firestore = getFirestore(app);
  //       const firebaseAuth = getAuth(app);
  //       setDb(firestore);
  //       setAuth(firebaseAuth);
  //       onAuthStateChanged(firebaseAuth, async (user) => {
  //         if (user) {
  //           setUserId(user.uid);
  //         } else {
  //           try {
  //             await signInAnonymously(firebaseAuth);
  //           } catch (authError) {
  //             setError("Authentication failed.");
  //             console.error("Anonymous sign-in failed:", authError);
  //           }
  //         }
  //         setIsAuthReady(true);
  //       });
  //       if (initialAuthToken) {
  //         try {
  //           await signInWithCustomToken(firebaseAuth, initialAuthToken);
  //         } catch (tokenError) {
  //           setError("Custom token sign-in failed. Signing in anonymously.");
  //           console.error("Custom token sign-in failed:", tokenError);
  //           await signInAnonymously(firebaseAuth);
  //         }
  //       }
  //     } catch (e) {
  //       setError("Failed to initialize Firebase.");
  //       console.error("Firebase initialization error:", e);
  //       setIsAuthReady(true);
  //     }
  //   };
  //   initFirebase();
  // }, []);

  // Firebase listeners for real-time data fetching (Read) ko comment kiya gaya hai
  // useEffect(() => {
  //   if (db && userId) {
  //     setLoading(true);
  //     const expenseUnsub = onSnapshot(collection(db, 'artifacts', appId, 'users', userId, 'expenses'), (snapshot) => {
  //       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date || '' }));
  //       data.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       setTransactions(data);
  //     }, (err) => setError("Failed to fetch expenses."));
  //     const incomeUnsub = onSnapshot(collection(db, 'artifacts', appId, 'users', userId, 'incomes'), (snapshot) => {
  //       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date || '' }));
  //       data.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       setMonthlyIncomes(data);
  //     }, (err) => setError("Failed to fetch incomes."));
  //     const ccPaymentUnsub = onSnapshot(collection(db, 'artifacts', appId, 'users', userId, 'creditCardPayments'), (snapshot) => {
  //       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date || '' }));
  //       data.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       setCreditCardPayments(data);
  //     }, (err) => setError("Failed to fetch credit card payments."));
  //     setLoading(false);
  //     return () => {
  //       expenseUnsub();
  //       incomeUnsub();
  //       ccPaymentUnsub();
  //     };
  //   }
  // }, [db, userId, appId]);

  // Initial date setup

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

  // --- CRUD Functions ko comment kiya gaya hai ---

  // Handle Add (Create) - now with dummy data
  const handleAddData = async (e, type) => {
    e.preventDefault();
    setError("Database is commented out, cannot add data.");
    // Dummy logic for demonstration
    // if (type === 'income') {
    //   const newIncome = { id: Date.now().toString(), amount: parseFloat(incomeAmount), description: incomeDescription, source: incomeSource, date: transactionDate };
    //   setMonthlyIncomes([...monthlyIncomes, newIncome]);
    // }
  };

  // Handle Edit (Update) - now with dummy data
  const startEdit = (item) => {
    // console.log(item, "Editing item");
    setEditingItem(item);
    setTransactionDate(item.date);
    if (currentPage === "income") {
      setIncomeAmount(item.amount);
      setIncomeDescription(item.description);
      setIncomeSource(item.source);
    } else if (currentPage === "expenses") {
      setExpense(item.amount);
      setDescription(item.description);
      setCategory(item.category);
      setPaymentMethod(item.paymentMethod);
    } else if (currentPage === "credit-card") {
      // In this app, we only edit CC expenses or payments, not the card itself.
    }
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    setError("Database is commented out, cannot update data.");
    // Dummy logic for demonstration
    // if (!editingItem) return;
    // const updatedData = { ...editingItem, amount: parseFloat(expense), description, category, paymentMethod, date: transactionDate };
    // const updatedList = transactions.map(item => item.id === updatedData.id ? updatedData : item);
    // setTransactions(updatedList);
    // cancelEdit();
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setExpense("");
    setDescription("");
    setCategory("home");
    setPaymentMethod("Axis Bank");
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeSource("Axis Bank");
    setCreditCardPaymentAmount("");
    setCreditCardPaymentDescription("");
  };

  // Handle Delete (Delete) - now with dummy data
  const handleDeleteConfirm = (item) => {
    // console.log(item, "Deleting item");
    setItemToDelete(item);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    setError(null);
    if (!itemToDelete || !itemToDelete.sheetIndex) {
      setError("Cannot delete: sheetIndex missing.");
      // setIsDeleting(false);
      // setItemToDelete(null);
      return;
    }
    // console.log(
    //   itemToDelete,
    //   "Deleting item with sheetIndex:",
    //   itemToDelete.sheetIndex
    // );
    try {
      const res = await fetch("/api/deleteIncome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetIndex: itemToDelete.sheetIndex - 1 }),
      });
      if (!res.ok) throw new Error("Failed to delete income");
      await fetchIncomeData();
    } catch (err) {
      setError(err.message);
    }
    setIsDeleting(false);
    setItemToDelete(null);
  };

  // --- Calculations ---
  const allYears = Array.from(
    new Set([
      ...transactions.map((t) => new Date(t.date).getFullYear()),
      ...monthlyIncomes.map((inc) => new Date(inc.date).getFullYear()),
      ...creditCardPayments.map((p) => new Date(p.date).getFullYear()),
    ])
  ).sort((a, b) => b - a);

  const filteredTransactions = transactions.filter((t) =>
    viewType === "month"
      ? t?.date?.startsWith(selectedMonth)
      : t?.date?.startsWith(selectedYear)
  );

  const filteredIncomes = monthlyIncomes.filter((inc) =>
    viewType === "month"
      ? inc?.date?.startsWith(selectedMonth)
      : inc?.date?.startsWith(selectedYear)
  );

  const filteredCreditCardPayments = creditCardPayments.filter((p) =>
    viewType === "month"
      ? p?.date?.startsWith(selectedMonth)
      : p?.date?.startsWith(selectedYear)
  );

  const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const cashIncome = filteredIncomes
    .filter((inc) => inc.source === "Cash")
    .reduce((sum, inc) => sum + inc.amount, 0);
  const axisBankIncome = filteredIncomes
    .filter((inc) => inc.source === "Axis Bank")
    .reduce((sum, inc) => sum + inc.amount, 0);
  const iciciBankIncome = filteredIncomes
    .filter((inc) => inc.source === "ICICI Bank")
    .reduce((sum, inc) => sum + inc.amount, 0);

  const cashExpenses = filteredTransactions
    .filter((t) => t.paymentMethod === "Cash")
    .reduce((sum, t) => sum + t.amount, 0);
  const axisBankExpenses = filteredTransactions
    .filter((t) => t.paymentMethod === "Axis Bank")
    .reduce((sum, t) => sum + t.amount, 0);
  const iciciBankExpenses = filteredTransactions
    .filter((t) => t.paymentMethod === "ICICI Bank")
    .reduce((sum, t) => sum + t.amount, 0);
  const creditCardExpenses = filteredTransactions
    .filter((t) => t.paymentMethod === "Credit Card")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashBalance = cashIncome - cashExpenses;
  const axisBankBalance = axisBankIncome - axisBankExpenses;
  const iciciBankBalance = iciciBankIncome - iciciBankExpenses;

  const totalCreditCardPayments = filteredCreditCardPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const creditCardOutstanding = creditCardExpenses - totalCreditCardPayments;
  const creditCardBalance = creditCardLimit - creditCardOutstanding;

  const totalBalance = cashBalance + axisBankBalance + iciciBankBalance;

  const totalSalaryIncome = filteredIncomes
    .filter(
      (inc) =>
        inc.description &&
        (inc.description.toLowerCase().includes("salary") ||
          inc.description.toLowerCase().includes("vetan"))
    )
    .reduce((sum, inc) => sum + inc.amount, 0);

  const totalExtraIncome = filteredIncomes
    .filter(
      (inc) =>
        inc.description &&
        !inc.description.toLowerCase().includes("salary") &&
        !inc.description.toLowerCase().includes("vetan")
    )
    .reduce((sum, inc) => sum + inc.amount, 0);

  const homeBudget = totalSalaryIncome * 0.5;
  const investBudget = totalSalaryIncome * 0.3;
  const personalBudget = totalSalaryIncome * 0.2;

  const homeExpenses = filteredTransactions
    .filter((t) => t.category === "home")
    .reduce((sum, t) => sum + t.amount, 0);
  const investExpenses = filteredTransactions
    .filter((t) => t.category === "invest")
    .reduce((sum, t) => sum + t.amount, 0);
  const personalExpenses = filteredTransactions
    .filter((t) => t.category === "personal")
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingHome = homeBudget - homeExpenses;
  const remainingInvest = investBudget - investExpenses;
  const remainingPersonal = personalBudget - personalExpenses;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md">
          <p className="font-bold text-gray-700">{`${payload[0].name}`}</p>
          <p className="text-sm text-gray-600">
            Total Expenses:{" "}
            <span className="font-semibold">
              ₹{payload[0].value.toFixed(2)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Dynamically change the titles.
  const mainTitle = viewType === "month" ? "Monthly Data" : "Yearly Data";
  const expenseTitle =
    viewType === "month"
      ? "Monthly Expense Distribution"
      : "Yearly Expense Distribution";
  const incomeTitle =
    viewType === "month" ? "Total Monthly Income" : "Total Yearly Income";
  const expenseLabel =
    viewType === "month" ? "Total Monthly Expenses" : "Total Yearly Expenses";
  const [loading, setLoading] = useState(false);
  // Loading state ko comment kiya gaya hai aur app seedha render ho raha hai
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner /> {/* Apna spinner yahan use karein */}
        <div className="ml-4 text-gray-600 text-lg font-semibold">
          लोड हो रहा है...
        </div>
      </div>
    );
  }

  //expenxe ke liye data

  // const fetchExpenseData = async () => {
  //   try {
  //     const res = await fetch("/api/getExpense");
  //     const json = await res.json();
  //     if (json.data) {
  //       setTransactions(
  //         json.data.map((row, idx) => ({
  //           id: `exp${idx}`,
  //           sheetIndex: idx + 2, // row 2 is first data row
  //           date: row[0],
  //           amount: parseFloat(row[1]),
  //           category: row[2],
  //           paymentMethod: row[3],
  //           description: row[4],
  //         }))
  //       );
  //     }
  //   } catch (err) {
  //     setError("Failed to fetch expense data");
  //   }
  // };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    try {
      if (editingItem && editingItem.sheetIndex) {
        // Update mode
        const res = await fetch("/api/updateExpense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetIndex: editingItem.sheetIndex,
            date: transactionDate,
            amount: parseFloat(expense),
            category,
            paymentMethod,
            description,
          }),
        });
        if (!res.ok) throw new Error("Failed to update expense");
        setEditingItem(null);
      } else {
        // Add mode
        const res = await fetch("/api/addExpense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: transactionDate,
            amount: parseFloat(expense),
            category,
            paymentMethod,
            description,
          }),
        });
        if (!res.ok) throw new Error("Failed to add expense");
      }
      await fetchExpenseData();
      setExpense("");
      setDescription("");
      setCategory("home");
      setPaymentMethod("Axis Bank");
      setTransactionDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError(err.message);
    }
  };

  // const handleDeleteExpense = async (itemToDelete) => {
  //   setError(null);
  //   if (!itemToDelete || !itemToDelete?.sheetIndex) {
  //     setError("Cannot delete: sheetIndex missing.");
  //     setIsDeleting(false);
  //     setItemToDelete(null);
  //     return;
  //   }
  //   try {
  //     const res = await fetch("/api/deleteExpense", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ sheetIndex: itemToDelete?.sheetIndex }),
  //     });
  //     if (!res.ok) throw new Error("Failed to delete expense");
  //     await fetchExpenseData();
  //   } catch (err) {
  //     setError(err.message);
  //   }
  //   setIsDeleting(false);
  //   setItemToDelete(null);
  // };

  const handleDeleteExpense = async (itemToDelete) => {
    setError(null);
    if (!itemToDelete || !itemToDelete.sheetIndex) {
      setError("Cannot delete: sheetIndex missing.");
      setIsDeleting(false);
      setItemToDelete(null);
      return;
    }
    try {
      let apiUrl = "";
      if (currentPage === "income") {
        apiUrl = "/api/deleteIncome";
      } else if (currentPage === "expenses") {
        apiUrl = "/api/deleteExpense";
      } else if (currentPage === "credit-card") {
        // If you have a separate API for credit card payments, use it here
        apiUrl = "/api/deleteCreditCardPayment";
      } else {
        setError("Unknown page type for delete.");
        setIsDeleting(false);
        setItemToDelete(null);
        return;
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetIndex: itemToDelete.sheetIndex - 1 }),
      });
      if (!res.ok) throw new Error("Failed to delete item");

      // Refresh data after delete
      if (currentPage === "income") {
        await fetchIncomeData();
      } else if (currentPage === "expenses") {
        await fetchExpenseData();
      } // Add fetchCreditCardPayments() if needed
    } catch (err) {
      setError(err.message);
    }
    setIsDeleting(false);
    setItemToDelete(null);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl text-center w-full sm:text-4xl font-extrabold text-indigo-600">
            Personal Expense Tracker
          </h1>
          {/* User ID display ko comment kiya gaya hai */}
          {/* <div className="bg-gray-200 rounded-lg p-2 text-sm text-gray-700">
            आपका User ID: <span className="font-mono break-all">{userId}</span>
          </div> */}
        </div>

        {error && (
          <div
            className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md"
            role="alert"
          >
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {/* Navigation Bar */}
        <div className="mb-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-300 ease-in-out ${
              currentPage === "dashboard"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("income")}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-300 ease-in-out ${
              currentPage === "income"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setCurrentPage("expenses")}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-300 ease-in-out ${
              currentPage === "expenses"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setCurrentPage("billpayment")}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-300 ease-in-out ${
              currentPage === "billpayment"
                ? "bg-black text-white shadow-lg" // Active: solid black
                : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive: light gray with black text
            }`}
          >
            Bill Payment
          </button>

          {/* <button
            onClick={() => setCurrentPage("credit-card")}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-300 ease-in-out ${
              currentPage === "credit-card"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Credit Card
          </button> */}
        </div>

        {currentPage === "dashboard" && (
          <Dashboard />
          // <div className="mb-8 p-6 bg-indigo-100 rounded-lg shadow-md text-center">
          //   <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          //     Dashboard
          //   </h2>
          //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          //     <div className="p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
          //       <h3 className="text-xl font-bold mb-2 text-green-700">
          //         Total Income
          //       </h3>
          //       <p className="text-3xl font-extrabold text-green-900">
          //         ₹ {totalIncome.toFixed(2)}
          //       </p>
          //     </div>
          //     <div className="p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
          //       <h3 className="text-xl font-bold mb-2 text-red-700">
          //         Total Expenses
          //       </h3>
          //       <p className="text-3xl font-extrabold text-red-900">
          //         ₹ {totalExpenses.toFixed(2)}
          //       </p>
          //     </div>
          //     <div className="p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
          //       <h3 className="text-xl font-bold mb-2 text-purple-700">
          //         Net Balance
          //       </h3>
          //       <p
          //         className={`text-3xl font-extrabold ${
          //           totalBalance >= 0 ? "text-green-900" : "text-red-900"
          //         }`}
          //       >
          //         ₹ {totalBalance.toFixed(2)}
          //       </p>
          //     </div>
          //   </div>
          //   <div>
          //     {/* Loading spinner show karo jab tak loading true hai */}
          //     {loading ? (
          //       <div className="flex items-center justify-center min-h-[300px]">
          //         <LoadingSpinner1 />
          //         <span className="ml-3 text-gray-600 font-semibold">
          //           लोड हो रहा है...
          //         </span>
          //       </div>
          //     ) : (
          //       <SalaryBreakdownChart
          //         homeBudget={homeBudget}
          //         investBudget={investBudget}
          //         personalBudget={personalBudget}
          //         homeExpenses={homeExpenses}
          //         investExpenses={investExpenses}
          //         personalExpenses={personalExpenses}
          //         loading={loading}
          //       />
          //     )}
          //   </div>

          //   <div className="mt-8 flex justify-center align-items-center">
          //     <div className="w-full max-w-3xl bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-8 border border-green-200">
          //       <h2 className="text-2xl font-extrabold text-green-700 mb-6 tracking-tight">
          //         Salary Income Breakdown
          //       </h2>
          //       <div className="flex justify-center mb-8 gap-4">
          //         <div className="mt- grid grid-cols-1 mdgrid-cols-2 gap:-6">
          //           <div className="p-6 bg-green-50 rounded-lg shadow-md border-4 border-green-500">
          //             <h3 className="text-xl font-bold mb-2 text-green-700">
          //               Salary Income
          //             </h3>
          //             <p className="text-3xl font-extrabold text-green-900">
          //               ₹ {totalSalaryIncome.toFixed(2)}
          //             </p>
          //           </div>
          //         </div>
          //       </div>
          //       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          //         <div className="flex items-center gap-3">
          //           <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-lg shadow">
          //             Total Salary Income
          //           </span>
          //           <span className="text-3xl font-extrabold text-green-900 tracking-wide">
          //             ₹ {totalSalaryIncome.toFixed(2)}
          //           </span>
          //         </div>
          //         <div className="flex gap-2">
          //           <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
          //             50% Home
          //           </span>
          //           <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
          //             30% Investment
          //           </span>
          //           <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm">
          //             20% Personal
          //           </span>
          //         </div>
          //       </div>
          //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          //         {/* Home */}
          //         <div className="bg-blue-50 rounded-xl shadow border-4 border-blue-500 p-6 flex flex-col justify-between">
          //           <h3 className="text-lg font-bold text-blue-700 mb-2">
          //             Home (50%)
          //           </h3>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Budget:
          //             </span>
          //             <span className="text-xl font-bold text-blue-900">
          //               ₹ {homeBudget.toFixed(2)}
          //             </span>
          //           </div>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Expense:
          //             </span>
          //             <span className="text-xl font-bold text-red-600">
          //               ₹ {homeExpenses.toFixed(2)}
          //             </span>
          //           </div>
          //           <div>
          //             <span className="block text-gray-700 font-semibold">
          //               Balance:
          //             </span>
          //             <span
          //               className={`text-xl font-bold ${
          //                 remainingHome >= 0 ? "text-green-700" : "text-red-700"
          //               }`}
          //             >
          //               ₹ {remainingHome.toFixed(2)}
          //             </span>
          //           </div>
          //         </div>
          //         {/* Investment */}
          //         <div className="bg-green-50 rounded-xl shadow border-4 border-green-500 p-6 flex flex-col justify-between">
          //           <h3 className="text-lg font-bold text-green-700 mb-2">
          //             Investment (30%)
          //           </h3>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Budget:
          //             </span>
          //             <span className="text-xl font-bold text-green-900">
          //               ₹ {investBudget.toFixed(2)}
          //             </span>
          //           </div>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Expense:
          //             </span>
          //             <span className="text-xl font-bold text-red-600">
          //               ₹ {investExpenses.toFixed(2)}
          //             </span>
          //           </div>
          //           <div>
          //             <span className="block text-gray-700 font-semibold">
          //               Balance:
          //             </span>
          //             <span
          //               className={`text-xl font-bold ${
          //                 remainingInvest >= 0
          //                   ? "text-green-700"
          //                   : "text-red-700"
          //               }`}
          //             >
          //               ₹ {remainingInvest.toFixed(2)}
          //             </span>
          //           </div>
          //         </div>
          //         {/* Personal */}
          //         <div className="bg-red-50 rounded-xl shadow border-4 border-red-500 p-6 flex flex-col justify-between">
          //           <h3 className="text-lg font-bold text-red-700 mb-2">
          //             Personal (20%)
          //           </h3>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Budget:
          //             </span>
          //             <span className="text-xl font-bold text-red-900">
          //               ₹ {personalBudget.toFixed(2)}
          //             </span>
          //           </div>
          //           <div className="mb-2">
          //             <span className="block text-gray-700 font-semibold">
          //               Expense:
          //             </span>
          //             <span className="text-xl font-bold text-red-600">
          //               ₹ {personalExpenses.toFixed(2)}
          //             </span>
          //           </div>
          //           <div>
          //             <span className="block text-gray-700 font-semibold">
          //               Balance:
          //             </span>
          //             <span
          //               className={`text-xl font-bold ${
          //                 remainingPersonal >= 0
          //                   ? "text-green-700"
          //                   : "text-red-700"
          //               }`}
          //             >
          //               ₹ {remainingPersonal.toFixed(2)}
          //             </span>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        )}

        {/* {currentPage === "dashboard" && (
          <>
            <div className="mb-8 p-6 bg-indigo-100 rounded-lg shadow-md text-center">
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => {
                    setViewType("month");
                    const currentMonthYear = new Date()
                      .toISOString()
                      .slice(0, 7);
                    setSelectedMonth(currentMonthYear);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    viewType === "month"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  View by Month
                </button>
                <button
                  onClick={() => {
                    setViewType("year");
                    const currentYear = new Date().getFullYear().toString();
                    setSelectedYear(currentYear);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    viewType === "year"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  View by Year
                </button>
              </div>

              <div className="flex justify-center gap-4">
                {viewType === "year" ? (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="p-3 rounded-lg border-2 border-indigo-400 focus:outline-none focus:border-indigo-600"
                  >
                    {allYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="p-3 rounded-lg border-2 border-indigo-400 focus:outline-none focus:border-indigo-600"
                  />
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                {expenseTitle} (
                {viewType === "month" ? selectedMonth : selectedYear})
              </h2>
              <div style={{ width: "100%", minHeight: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 font-semibold text-gray-600 flex-wrap">
                <div className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[0] }}
                  ></span>
                  Home
                </div>
                <div className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[1] }}
                  ></span>
                  Investment
                </div>
                <div className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[2] }}
                  ></span>
                  Personal
                </div>
              </div>
            </div>

            <div className="mb-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
                <h2 className="text-2xl font-bold mb-2 text-green-700">
                  {incomeTitle}
                </h2>
                <p className="text-4xl font-extrabold text-green-900">
                  ₹ {totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
                <h2 className="text-2xl font-bold mb-2 text-red-700">
                  {expenseLabel}
                </h2>
                <p className="text-4xl font-extrabold text-red-900">
                  ₹ {totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
                <h2 className="text-xl font-bold mb-2 text-purple-700">
                  Total Balance
                </h2>
                <p
                  className={`text-3xl font-extrabold ${
                    totalBalance >= 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  ₹ {totalBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg shadow-md border-b-4 border-yellow-500">
                <h2 className="text-xl font-bold mb-2 text-yellow-700">
                  Cash Balance
                </h2>
                <p
                  className={`text-3xl font-extrabold ${
                    cashBalance >= 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  ₹ {cashBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg shadow-md border-b-4 border-blue-500">
                <h2 className="text-xl font-bold mb-2 text-blue-700">
                  Axis Bank Balance
                </h2>
                <p
                  className={`text-3xl font-extrabold ${
                    axisBankBalance >= 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  ₹ {axisBankBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
                <h2 className="text-xl font-bold mb-2 text-purple-700">
                  ICICI Bank Balance
                </h2>
                <p
                  className={`text-3xl font-extrabold ${
                    iciciBankBalance >= 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  ₹ {iciciBankBalance.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md border-b-4 border-purple-500 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">
                Credit Card Balance
              </h2>
              <p
                className={`text-4xl font-extrabold ${
                  creditCardBalance >= 0 ? "text-green-900" : "text-red-900"
                }`}
              >
                ₹ {creditCardBalance.toFixed(2)}
              </p>
              <p className="mt-2 text-lg text-gray-600">
                Total Outstanding:{" "}
                <span className="font-semibold text-red-700">
                  ₹ {creditCardOutstanding.toFixed(2)}
                </span>{" "}
                / Limit:{" "}
                <span className="font-semibold text-green-700">
                  ₹ {creditCardLimit.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  Salary Income
                </h2>
                <p className="text-4xl font-extrabold text-green-900">
                  ₹ {totalSalaryIncome.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  Extra Income
                </h2>
                <p className="text-4xl font-extrabold text-purple-900">
                  ₹ {totalExtraIncome.toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {incomeTitle}
                </h2>
                <p className="text-4xl font-extrabold text-indigo-900">
                  ₹ {totalIncome.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Salary-Based 50-30-20 Budget
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg shadow-md border-b-4 border-blue-500">
                  <h3 className="text-xl font-bold mb-2 text-blue-700">
                    50% Home
                  </h3>
                  <p className="text-2xl font-extrabold text-blue-900">
                    ₹ {homeBudget.toFixed(2)}
                  </p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
                  <h3 className="text-xl font-bold mb-2 text-green-700">
                    30% Investment
                  </h3>
                  <p className="text-2xl font-extrabold text-green-900">
                    ₹ {investBudget.toFixed(2)}
                  </p>
                </div>
                <div className="p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
                  <h3 className="text-xl font-bold mb-2 text-red-700">
                    20% Personal
                  </h3>
                  <p className="text-2xl font-extrabold text-red-900">
                    ₹ {personalBudget.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Remaining Balances (from Salary Budget)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-100 rounded-lg shadow-inner border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold mb-1 text-blue-800">Home</h3>
                  <p
                    className={`text-xl font-extrabold ${
                      remainingHome >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {remainingHome.toFixed(2)}
                  </p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-inner border-l-4 border-green-500">
                  <h3 className="text-lg font-bold mb-1 text-green-800">
                    Investment
                  </h3>
                  <p
                    className={`text-xl font-extrabold ${
                      remainingInvest >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {remainingInvest.toFixed(2)}
                  </p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-inner border-l-4 border-red-500">
                  <h3 className="text-lg font-bold mb-1 text-red-800">
                    Personal
                  </h3>
                  <p
                    className={`text-xl font-extrabold ${
                      remainingPersonal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {remainingPersonal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )} */}

        {currentPage === "income" && <Income />}

        {currentPage === "expenses" && (
          <>
            <form
              onSubmit={handleExpenseSubmit}
              className="mb-8 p-6 bg-red-50 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                {editingItem ? "Edit Expense" : "New Expense jodein"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="expense-date"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="expense-date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="expense-amount"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Amount
                  </label>
                  <input
                    id="expense-amount"
                    type="number"
                    value={expense}
                    step="0.01"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setExpense(val);
                      }
                    }}
                    placeholder="Amount"
                    min="0"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="expense-payment-method"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="expense-payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
                    required
                  >
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="expense-category"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
                    required
                  >
                    <option value="home">Home</option>
                    <option value="invest">Investment</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="expense-description"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Description
                  </label>
                  <input
                    id="expense-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (e.g., Groceries)"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  {editingItem ? "Update Expense" : "Add Expense"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Expense History (
                {viewType === "month" ? selectedMonth : selectedYear})
              </h2>
              {loading ? (
                <div className="text-center text-gray-500 py-4">
                  <LoadingSpinner1 />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No transactions found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Category
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Payment Method
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-t border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-4">{transaction?.date}</td>
                          <td className="py-3 px-4 text-red-600 font-medium">
                            ₹ {transaction?.amount?.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {transaction?.category}
                          </td>
                          <td className="py-3 px-4">
                            {transaction?.paymentMethod}
                          </td>
                          <td className="py-3 px-4">
                            {transaction?.description}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(transaction)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(transaction)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {currentPage === "billpayment" && <BillPayment />}

        {/* {currentPage === "credit-card" && (
          <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">
                Credit Card Expenses (
                {viewType === "month" ? selectedMonth : selectedYear})
              </h2>
              <p className={`text-4xl font-extrabold text-red-900`}>
                ₹ {creditCardOutstanding.toFixed(2)}
              </p>
              <p className="mt-2 text-lg text-gray-600">
                Total Limit:{" "}
                <span className="font-semibold text-green-700">
                  ₹ {creditCardLimit.toFixed(2)}
                </span>
                <br />
                Total Payments:{" "}
                <span className="font-semibold text-green-700">
                  ₹ {totalCreditCardPayments.toFixed(2)}
                </span>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError("Database is commented out, cannot add/update data.");
              }}
              className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                {editingItem
                  ? "Edit Credit Card Expense"
                  : "New Credit Card Expense jodein"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="cc-expense-date"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="cc-expense-date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="cc-expense-amount"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Amount
                  </label>
                  <input
                    id="cc-expense-amount"
                    type="number"
                    value={expense}
                    onChange={(e) => setExpense(e.target.value)}
                    placeholder="Amount"
                    min="0"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="cc-expense-payment-method"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="cc-expense-payment-method"
                    value="Credit Card"
                    disabled
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-gray-200 cursor-not-allowed"
                  >
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="cc-expense-description"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Description
                  </label>
                  <input
                    id="cc-expense-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (e.g., Online Shopping)"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor="cc-expense-category"
                      className="font-semibold text-gray-600 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="cc-expense-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      required
                    >
                      <option value="home">Home</option>
                      <option value="invest">Investment</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  {editingItem ? "Update Expense" : "Add Expense"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError("Database is commented out, cannot add/update data.");
              }}
              className="mb-8 p-6 bg-green-50 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                {editingItem
                  ? "Edit Credit Card Payment"
                  : "Credit Card Bill Payment jodein"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="cc-payment-date"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="cc-payment-date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="cc-payment-amount"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Payment Amount
                  </label>
                  <input
                    id="cc-payment-amount"
                    type="number"
                    value={creditCardPaymentAmount}
                    onChange={(e) => setCreditCardPaymentAmount(e.target.value)}
                    placeholder="Payment Amount"
                    min="0"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="cc-payment-description"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <input
                    id="cc-payment-description"
                    type="text"
                    value={creditCardPaymentDescription}
                    onChange={(e) =>
                      setCreditCardPaymentDescription(e.target.value)
                    }
                    placeholder="Description (e.g., Monthly Payment)"
                    className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  {editingItem ? "Update Payment" : "Add Payment"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Credit Card Expenses
              </h2>
              {filteredTransactions.filter(
                (t) => t.paymentMethod === "Credit Card"
              ).length === 0 ? (
                <p className="text-center text-gray-500">
                  Koi credit card kharch nahi joda gaya hai.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Category
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions
                        .filter((t) => t.paymentMethod === "Credit Card")
                        .map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-t border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-4">
                              {transaction.description}
                            </td>
                            <td className="py-3 px-4 text-red-600 font-medium">
                              ₹ {transaction.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              {transaction.category}
                            </td>
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(transaction)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteConfirm(transaction)
                                  }
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Credit Card Payment History
              </h2>
              {filteredCreditCardPayments.length === 0 ? (
                <p className="text-center text-gray-500">
                  Koi credit card bhugtan nahi joda gaya hai.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCreditCardPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-4">
                            {payment.description || "Payment"}
                          </td>
                          <td className="py-3 px-4 text-green-600 font-medium">
                            ₹ {payment.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">{payment.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(payment)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(payment)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )} */}
      </div>

      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Are you sure you want to delete this item?
            </h3>
            <p className="mb-4 text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
