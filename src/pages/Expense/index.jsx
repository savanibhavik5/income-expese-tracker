// import { EditIcon, TrashIcon } from "@/component/Icon";
// import LoadingSpinner1 from "@/component/loadingSpinner";
// import React, { useEffect, useState } from "react";

// const index = () => {
//   const [editingItem, setEditingItem] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [expense, setExpense] = useState("");
//   const [error, setError] = useState(null);
//   const [transactionDate, setTransactionDate] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Axis Bank");
//   const [category, setCategory] = useState("home");
//   const [description, setDescription] = useState("");
//   const [viewType, setViewType] = useState("month");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [transactions, setTransactions] = useState([]);
//   const currentPage = "expense";

//   const handleExpenseSubmit = async (e) => {
//     e?.preventDefault();
//     setError(null);
//     try {
//       if (editingItem && editingItem.sheetIndex) {
//         // Update mode
//         const res = await fetch("/api/updateExpense", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             sheetIndex: editingItem.sheetIndex,
//             date: transactionDate,
//             amount: parseFloat(expense),
//             category,
//             paymentMethod,
//             description,
//           }),
//         });
//         if (!res.ok) throw new Error("Failed to update expense");
//         setEditingItem(null);
//       } else {
//         // Add mode
//         const res = await fetch("/api/addExpense", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             date: transactionDate,
//             amount: parseFloat(expense),
//             category,
//             paymentMethod,
//             description,
//           }),
//         });
//         if (!res.ok) throw new Error("Failed to add expense");
//       }
//       await fetchExpenseData();
//       setExpense("");
//       setDescription("");
//       setCategory("home");
//       setPaymentMethod("Axis Bank");
//       setTransactionDate(new Date().toISOString().slice(0, 10));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDeleteExpense = async (itemToDelete) => {
//     setError(null);
//     if (!itemToDelete || !itemToDelete.sheetIndex) {
//       setError("Cannot delete: sheetIndex missing.");
//       setIsDeleting(false);
//       setItemToDelete(null);
//       return;
//     }
//     try {
//       let apiUrl = "";
//       if (currentPage === "expense") {
//         apiUrl = "/api/deleteExpense";
//       } else {
//         setError("Unknown page type for delete.");
//         setIsDeleting(false);
//         setItemToDelete(null);
//         return;
//       }
//       console.log(itemToDelete.sheetIndex, "Deleting item at sheetIndex");
//       const res = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sheetIndex: itemToDelete.sheetIndex }),
//       });
//       if (!res.ok) throw new Error("Failed to delete item");
//       if (currentPage === "expense") {
//         await fetchExpenseData();
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsDeleting(false);
//     setItemToDelete(null);
//   };

//   const filteredTransactions = transactions.filter((t) =>
//     viewType === "month"
//       ? t?.date?.startsWith(selectedMonth)
//       : t?.date?.startsWith(selectedYear)
//   );

//   //   const startEdit = (item) => {
//   //     console.log(item, item.amount, "Editing item");
//   //     setEditingItem(item);
//   //     setTransactionDate(item.date);
//   //     if (currentPage === "expenses") {
//   //  const safeAmount =
//   //       typeof item.amount === "number"
//   //         ? item.amount.toFixed(2)
//   //         : parseFloat(item.amount || 0).toFixed(2);
//   //     setExpense(safeAmount);
//   //       setDescription(item?.description);
//   //       setCategory(item?.category);
//   //       setPaymentMethod(item?.paymentMethod);
//   //     }
//   //   };

//   const startEdit = (item) => {
//     setEditingItem(item);
//     setTransactionDate(item.date);

//     if (currentPage === "expense") {
//       const formattedAmount =
//         typeof item.amount === "number"
//           ? item.amount.toFixed(2)
//           : parseFloat(item.amount || 0).toFixed(2);
//       setExpense(formattedAmount);
//       setDescription(item?.description || "");
//       setCategory(item?.category || "home");
//       setPaymentMethod(item?.paymentMethod || "Axis Bank");
//     }
//   };

//   const cancelEdit = () => {
//     setEditingItem(null);
//     setTransactionDate("");
//     setExpense("");
//     setDescription("");
//     setCategory("home");
//     setPaymentMethod("Axis Bank");
//   };

//   const fetchExpenseData = async () => {
//     try {
//       const res = await fetch("/api/getExpense", {
//         method: "GET",
//         headers: {
//           "Cache-Control": "no-cache", // Add this
//         },
//       });
//       const json = await res.json();
//       if (json.data) {
//         setTransactions(
//           json.data.map((row, idx) => ({
//             id: `exp${idx}`,
//             sheetIndex: idx + 2,
//             date: row[0],
//             amount: parseFloat(row[1]),
//             paymentMethod: row[2],
//             category: row[3],
//             description: row[4],
//           }))
//         );
//       }
//     } catch (err) {
//       setError("Failed to fetch expense data");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchExpenseData();
//   }, []);

//   return (
//     <div>
//       <>
//         <form
//           onSubmit={handleExpenseSubmit}
//           className="mb-8 p-6 bg-red-50 rounded-lg shadow-md"
//         >
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">
//             {editingItem ? "Edit Expense" : "New Expense jodein"}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//             <div className="flex flex-col">
//               <label
//                 htmlFor="expense-date"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Date
//               </label>
//               <input
//                 id="expense-date"
//                 type="date"
//                 value={transactionDate}
//                 onChange={(e) => setTransactionDate(e.target.value)}
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="expense-amount"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Amount
//               </label>
//               <input
//                 id="expense-amount"
//                 type="number"
//                 value={expense}
//                 step="0.01"
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   if (/^\d*\.?\d{0,2}$/.test(val)) {
//                     setExpense(val);
//                   }
//                 }}
//                 placeholder="Amount"
//                 min="0"
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="expense-payment-method"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Payment Method
//               </label>
//               <select
//                 id="expense-payment-method"
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
//                 required
//               >
//                 <option value="Axis Bank">Axis Bank</option>
//                 <option value="ICICI Bank">ICICI Bank</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Credit Card">Credit Card</option>
//               </select>
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="expense-category"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Category
//               </label>
//               <select
//                 id="expense-category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
//                 required
//               >
//                 <option value="home">Home</option>
//                 <option value="invest">Investment</option>
//                 <option value="personal">Personal</option>
//               </select>
//             </div>
//             <div className="flex flex-col md:col-span-2">
//               <label
//                 htmlFor="expense-description"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Description
//               </label>
//               <input
//                 id="expense-description"
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Description (e.g., Groceries)"
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500"
//                 required
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//             >
//               {editingItem ? "Update Expense" : "Add Expense"}
//             </button>
//             {editingItem && (
//               <button
//                 type="button"
//                 onClick={cancelEdit}
//                 className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//         <div className="bg-gray-50 p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">
//             Expense History (
//             {viewType === "month" ? selectedMonth : selectedYear})
//           </h2>
//           {loading ? (
//             <div className="text-center text-gray-500 py-4">
//               <LoadingSpinner1 />
//             </div>
//           ) : filteredTransactions.length === 0 ? (
//             <div className="text-center text-gray-500 py-4">
//               No transactions found
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-lg shadow-sm">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Date
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Amount
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Category
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Payment Method
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Description
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-600">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.map((transaction) => (
//                     <tr
//                       key={transaction.id}
//                       className="border-t border-gray-200 hover:bg-gray-100"
//                     >
//                       <td className="py-3 px-4">{transaction?.date}</td>
//                       <td className="py-3 px-4 text-red-600 font-medium">
//                         ₹ {transaction?.amount?.toFixed(2)}
//                       </td>
//                       <td className="py-3 px-4">
//                         {transaction?.paymentMethod}
//                       </td>
//                       <td className="py-3 px-4 capitalize">
//                         {transaction?.category}
//                       </td>
//                       <td className="py-3 px-4">{transaction?.description}</td>
//                       <td className="py-3 px-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => startEdit(transaction)}
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                           >
//                             <EditIcon />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteExpense(transaction)}
//                             className="text-red-600 hover:text-red-800 transition-colors"
//                           >
//                             <TrashIcon />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </>
//     </div>
//   );
// };

// export default index;

import { EditIcon, TrashIcon } from "@/component/Icon";
import LoadingSpinner1 from "@/component/loadingSpinner";
import React, { useEffect, useState } from "react";

const Expense = () => {
  const [editingItem, setEditingItem] = useState(null);
  const [expense, setExpense] = useState("");
  const [error, setError] = useState(null);
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Axis Bank");
  const [category, setCategory] = useState("home");
  const [description, setDescription] = useState("");
  const [viewType, setViewType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const currentPage = "expense";

  const handleExpenseSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    try {
      if (editingItem && editingItem.sheetIndex) {
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
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setExpense("");
    setDescription("");
    setCategory("home");
    setPaymentMethod("Axis Bank");
    setTransactionDate(new Date().toISOString().slice(0, 10));
  };

  const handleDeleteExpense = async (itemToDelete) => {
    setError(null);
    if (!itemToDelete || !itemToDelete.sheetIndex) {
      setError("Cannot delete: sheetIndex missing.");
      return;
    }
    try {
      const res = await fetch("/api/deleteExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetIndex: itemToDelete.sheetIndex }),
      });
      if (!res.ok) throw new Error("Failed to delete expense");
      await fetchExpenseData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setTransactionDate(item.date);
    const formattedAmount =
      typeof item.amount === "number"
        ? item.amount.toFixed(2)
        : parseFloat(item.amount || 0).toFixed(2);
    setExpense(formattedAmount);
    setDescription(item?.description || "");
    setCategory(item?.category || "home");
    setPaymentMethod(item?.paymentMethod || "Axis Bank");
  };

  const cancelEdit = () => {
    setEditingItem(null);
    resetForm();
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
            paymentMethod: row[2],
            category: row[3],
            description: row[4],
          }))
        );
      }
    } catch {
      setError("Failed to fetch expense data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const filteredTransactions = transactions.filter((t) =>
    viewType === "month"
      ? t?.date?.startsWith(selectedMonth)
      : t?.date?.startsWith(selectedYear)
  );

  return (
    <div className="px-2 sm:px-4 md:px-6">
      {/* Form */}
      <form
        onSubmit={handleExpenseSubmit}
        className="mb-8 p-4 sm:p-6 bg-red-50 rounded-lg shadow-md"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          {editingItem ? "Edit Expense" : "Add New Expense"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Date */}
          <div className="flex flex-col">
            <label
              htmlFor="expense-date"
              className="font-semibold text-gray-600 mb-1 text-sm sm:text-base"
            >
              Date
            </label>
            <input
              id="expense-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-sm sm:text-base"
              required
            />
          </div>
          {/* Amount */}
          <div className="flex flex-col">
            <label
              htmlFor="expense-amount"
              className="font-semibold text-gray-600 mb-1 text-sm sm:text-base"
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
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-sm sm:text-base"
              required
            />
          </div>
          {/* Payment Method */}
          <div className="flex flex-col">
            <label
              htmlFor="expense-payment-method"
              className="font-semibold text-gray-600 mb-1 text-sm sm:text-base"
            >
              Payment Method
            </label>
            <select
              id="expense-payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-sm sm:text-base"
              required
            >
              <option value="Axis Bank">Axis Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Category */}
          <div className="flex flex-col">
            <label
              htmlFor="expense-category"
              className="font-semibold text-gray-600 mb-1 text-sm sm:text-base"
            >
              Category
            </label>
            <select
              id="expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-sm sm:text-base"
              required
            >
              <option value="home">Home</option>
              <option value="invest">Investment</option>
              <option value="personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Description */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-2">
            <label
              htmlFor="expense-description"
              className="font-semibold text-gray-600 mb-1 text-sm sm:text-base"
            >
              Description
            </label>
            <input
              id="expense-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (e.g., Groceries)"
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md transition"
          >
            {editingItem ? "Update Expense" : "Save Expense"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={cancelEdit}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Expense History */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Expense History ({viewType === "month" ? selectedMonth : selectedYear}
          )
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 py-6">
            <LoadingSpinner1 />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
                    Payment Method
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">
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
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      {transaction?.date}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-red-600 font-bold">
                      ₹ {transaction?.amount?.toFixed(2)}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      {transaction?.paymentMethod}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 capitalize">
                      {transaction?.category}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      {transaction?.description}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
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
    </div>
  );
};

export default Expense;
