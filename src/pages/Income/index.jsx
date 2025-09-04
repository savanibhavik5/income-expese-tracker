// import LoadingSpinner1 from "@/component/loadingSpinner";
// import React, { useEffect, useState } from "react";

// const EditIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="lucide lucide-square-pen"
//   >
//     <path d="M12 20h9" />
//     <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="lucide lucide-trash"
//   >
//     <path d="M3 6h18" />
//     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//   </svg>
// );

// const CloseIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="lucide lucide-x-circle"
//   >
//     <circle cx="12" cy="12" r="10" />
//     <path d="m15 9-6 6" />
//     <path d="m9 9 6 6" />
//   </svg>
// );

// const Income = () => {
//   const currentPage = "income";
//   const [editingItem, setEditingItem] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [transactionDate, setTransactionDate] = useState("");
//   const [incomeAmount, setIncomeAmount] = useState("");
//   const [incomeSource, setIncomeSource] = useState("Axis Bank");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("home");
//   const [paymentMethod, setPaymentMethod] = useState("Axis Bank");
//   const [viewType, setViewType] = useState("month");
//   const [incomeDescription, setIncomeDescription] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [monthlyIncomes, setMonthlyIncomes] = useState([]);
//   const [error, setError] = useState(null);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   const filteredIncomes = monthlyIncomes.filter((inc) =>
//     viewType === "month"
//       ? inc?.date?.startsWith(selectedMonth)
//       : inc?.date?.startsWith(selectedYear)
//   );

//   const cancelEdit = () => {
//     setEditingItem(null);
//     setDescription("");
//     setIncomeAmount("");
//     setIncomeDescription("");
//     setIncomeSource("Axis Bank");
//   };

//   const startEdit = (item) => {
//     console.log(item, "Editing item");
//     setEditingItem(item);
//     setTransactionDate(item.date);
//     if (currentPage === "income") {
//       setIncomeAmount(item.amount);
//       setIncomeDescription(item.description);
//       setIncomeSource(item.source);
//     } else if (currentPage === "expenses") {
//       setExpense(item.amount);
//       setDescription(item.description);
//       setCategory(item.category);
//       setPaymentMethod(item.paymentMethod);
//     } else if (currentPage === "credit-card") {
//       // In this app, we only edit CC expenses or payments, not the card itself.
//     }
//   };

//   const fetchIncomeData = async () => {
//     try {
//       const res = await fetch("/api/getIncome");
//       const json = await res.json();

//       if (json.data) {
//         const rows = json.data;

//         // ✅ Skip the first row (header)
//         const formattedData = rows.slice(1).map((row, idx) => ({
//           id: `inc${idx}`,
//           sheetIndex: idx + 2, // because we skipped 1st row, add 2 to get actual sheet index
//           date: row[0],
//           amount: parseFloat(row[1]),
//           source: row[2],
//           description: row[3],
//         }));

//         setMonthlyIncomes(formattedData);
//       }
//     } catch (err) {
//       // console.error("Error fetching income:", err);
//       setError("Failed to fetch income data");
//     }
//     setLoading(false);
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
//       if (currentPage === "income") {
//         apiUrl = "/api/deleteIncome";
//       } else {
//         setError("Unknown page type for delete.");
//         setIsDeleting(false);
//         setItemToDelete(null);
//         return;
//       }

//       const res = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sheetIndex: itemToDelete.sheetIndex }),
//       });
//       if (!res.ok) throw new Error("Failed to delete item");

//       // Refresh data after delete
//       if (currentPage === "income") {
//         await fetchIncomeData();
//         // } else if (currentPage === "expenses") {
//         //   await fetchExpenseData();
//       } // Add fetchCreditCardPayments() if needed
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsDeleting(false);
//     setItemToDelete(null);
//   };

//   useEffect(() => {
//     fetchIncomeData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       if (editingItem && editingItem.sheetIndex) {
//         // Update mode
//         const res = await fetch("/api/updateIncome", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             sheetIndex: editingItem.sheetIndex,
//             date: transactionDate,
//             amount: parseFloat(incomeAmount),
//             source: incomeSource,
//             description: incomeDescription,
//           }),
//         });
//         if (!res.ok) throw new Error("Failed to update income");
//         setEditingItem(null);
//       } else {
//         // Add mode
//         const res = await fetch("/api/addIncome", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             date: transactionDate,
//             amount: parseFloat(incomeAmount),
//             source: incomeSource,
//             description: incomeDescription,
//           }),
//         });
//         if (!res.ok) throw new Error("Failed to add income");
//       }
//       await fetchIncomeData();
//       setIncomeAmount("");
//       setIncomeDescription("");
//       setIncomeSource("Axis Bank");
//       setTransactionDate(new Date().toISOString().slice(0, 10));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <>
//         {/* Add/Edit Income Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="mb-8 p-6 bg-green-50 rounded-lg shadow-md"
//         >
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">
//             {editingItem ? "Edit Income" : "Add New Income"}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div className="flex flex-col">
//               <label
//                 htmlFor="income-date"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Date
//               </label>
//               <input
//                 id="income-date"
//                 type="date"
//                 value={transactionDate}
//                 onChange={(e) => setTransactionDate(e.target.value)}
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="income-amount"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Amount
//               </label>
//               <input
//                 id="income-amount"
//                 type="number"
//                 value={incomeAmount}
//                 onChange={(e) => {
//                   // Only allow up to 2 decimals
//                   const val = e.target.value;
//                   // Regex: allow only numbers with up to 2 decimals
//                   if (/^\d*\.?\d{0,2}$/.test(val)) {
//                     setIncomeAmount(val);
//                   }
//                 }}
//                 placeholder="Amount"
//                 min="0"
//                 step="0.01" // <-- Add this for 2 decimal support
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="income-source"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Source
//               </label>
//               <select
//                 id="income-source"
//                 value={incomeSource}
//                 onChange={(e) => setIncomeSource(e.target.value)}
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
//                 required
//               >
//                 <option value="Axis Bank">Axis Bank</option>
//                 <option value="ICICI Bank">ICICI Bank</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="flex flex-col">
//               <label
//                 htmlFor="income-description"
//                 className="font-semibold text-gray-600 mb-1"
//               >
//                 Description
//               </label>
//               <input
//                 id="income-description"
//                 type="text"
//                 value={incomeDescription}
//                 onChange={(e) => setIncomeDescription(e.target.value)}
//                 placeholder="Description (e.g., Salary, Bonus)"
//                 className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
//                 required
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//             >
//               {editingItem ? "Update Income" : "Save Income"}
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

//         {/* Income History List */}
//         <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">
//             Income History (
//             {viewType === "month" ? selectedMonth : selectedYear})
//           </h2>
//           {loading ? (
//             <div className="text-center text-gray-500 py-4">
//               <LoadingSpinner1 />
//             </div>
//           ) : filteredIncomes.length === 0 ? (
//             <div className="text-center text-gray-500 py-4">
//               No data available
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
//                       Source
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
//                   {filteredIncomes.map((income) => {
//                     // console.log(filteredIncomes[1]);
//                     return (
//                       <tr
//                         key={income.id}
//                         className="border-t border-gray-200 hover:bg-gray-100"
//                       >
//                         <td className="py-3 px-4">{income.date}</td>
//                         <td className="py-3 px-4 font-bold text-green-600">
//                           ₹ {income.amount.toFixed(2)}
//                         </td>
//                         <td className="py-3 px-4">{income.source}</td>
//                         <td className="py-3 px-4">{income.description}</td>
//                         <td className="py-3 px-4">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => startEdit(income)}
//                               className="text-blue-600 hover:text-blue-800 transition-colors"
//                             >
//                               <EditIcon />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteExpense(income)}
//                               className="text-red-600 hover:text-red-800 transition-colors"
//                             >
//                               <TrashIcon />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </>
//     </div>
//   );
// };
// export default Income;
import LoadingSpinner1 from "@/component/loadingSpinner";
import React, { useEffect, useState } from "react";

/* ------------------- ICONS ------------------- */
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="lucide lucide-square-pen">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="lucide lucide-trash">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

/* ------------------- MAIN COMPONENT ------------------- */
const Income = () => {
  const currentPage = "income";
  const [editingItem, setEditingItem] = useState(null);
  const [transactionDate, setTransactionDate] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("Axis Bank");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [viewType, setViewType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [error, setError] = useState(null);

  const filteredIncomes = monthlyIncomes.filter((inc) =>
    viewType === "month"
      ? inc?.date?.startsWith(selectedMonth)
      : inc?.date?.startsWith(selectedYear)
  );

  const cancelEdit = () => {
    setEditingItem(null);
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeSource("Axis Bank");
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setTransactionDate(item.date);
    setIncomeAmount(item.amount);
    setIncomeDescription(item.description);
    setIncomeSource(item.source);
  };

  const fetchIncomeData = async () => {
    try {
      const res = await fetch("/api/getIncome");
      const json = await res.json();

      if (json.data) {
        const rows = json.data;
        const formattedData = rows.slice(1).map((row, idx) => ({
          id: `inc${idx}`,
          sheetIndex: idx + 2,
          date: row[0],
          amount: parseFloat(row[1]),
          source: row[2],
          description: row[3],
        }));
        setMonthlyIncomes(formattedData);
      }
    } catch {
      setError("Failed to fetch income data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingItem && editingItem.sheetIndex) {
        // Update
        const res = await fetch("/api/updateIncome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetIndex: editingItem.sheetIndex,
            date: transactionDate,
            amount: parseFloat(incomeAmount),
            source: incomeSource,
            description: incomeDescription,
          }),
        });
        if (!res.ok) throw new Error("Failed to update income");
        setEditingItem(null);
      } else {
        // Add
        const res = await fetch("/api/addIncome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: transactionDate,
            amount: parseFloat(incomeAmount),
            source: incomeSource,
            description: incomeDescription,
          }),
        });
        if (!res.ok) throw new Error("Failed to add income");
      }
      await fetchIncomeData();
      setIncomeAmount("");
      setIncomeDescription("");
      setIncomeSource("Axis Bank");
      setTransactionDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6">
      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 sm:p-6 bg-green-50 rounded-lg shadow-md"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          {editingItem ? "Edit Income" : "Add New Income"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Date */}
          <div className="flex flex-col">
            <label htmlFor="income-date" className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Date
            </label>
            <input
              id="income-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
          {/* Amount */}
          <div className="flex flex-col">
            <label htmlFor="income-amount" className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Amount
            </label>
            <input
              id="income-amount"
              type="number"
              value={incomeAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(val)) {
                  setIncomeAmount(val);
                }
              }}
              min="0"
              step="0.01"
              placeholder="Amount"
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
          {/* Source */}
          <div className="flex flex-col">
            <label htmlFor="income-source" className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Source
            </label>
            <select
              id="income-source"
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value)}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            >
              <option value="Axis Bank">Axis Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="income-description" className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Description
            </label>
            <input
              id="income-description"
              type="text"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              placeholder="Description (e.g., Salary)"
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md transition"
          >
            {editingItem ? "Update Income" : "Save Income"}
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

      {/* Income History */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Income History ({viewType === "month" ? selectedMonth : selectedYear})
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 py-6">
            <LoadingSpinner1 />
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">Date</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">Amount</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">Source</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">Description</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr key={income.id} className="border-t border-gray-200 hover:bg-gray-100">
                    <td className="py-2 sm:py-3 px-3 sm:px-4">{income.date}</td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 font-bold text-green-600">
                      ₹ {income.amount.toFixed(2)}
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">{income.source}</td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">{income.description}</td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(income)}
                          className="text-blue-600 hover:text-blue-800 transition-colors">
                          <EditIcon />
                        </button>
                        <button onClick={() => handleDeleteExpense(income)}
                          className="text-red-600 hover:text-red-800 transition-colors">
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

export default Income;
