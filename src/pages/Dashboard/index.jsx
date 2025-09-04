// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
// import SalaryBreakdownChart from "../../component/salaryBreakdownChart";
// import LoadingSpinner1 from "@/component/loadingSpinner";

// export default function Dashboard() {
//   const [monthlyIncomes, setMonthlyIncomes] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchIncomeData = async () => {
//     try {
//       const res = await fetch("/api/getIncome");
//       const json = await res.json();
//       if (json.data) {
//         setMonthlyIncomes(
//           json.data.map((row, idx) => ({
//             id: `inc${idx}`,
//             sheetIndex: idx + 2,
//             date: row[0],
//             amount: parseFloat(row[1]),
//             source: row[2],
//             description: row[3],
//           }))
//         );
//       }
//     } catch (err) {
//       setError("Failed to fetch income data");
//     }
//     setLoading(false);
//   };

//   const fetchExpenseData = async () => {
//     try {
//       const res = await fetch("/api/getExpense");
//       const json = await res.json();
//       if (json.data) {
//         setTransactions(
//           json.data.map((row, idx) => ({
//             id: `exp${idx}`,
//             sheetIndex: idx + 2,
//             date: row[0],
//             amount: parseFloat(row[1]),
//             category: row[2],
//             paymentMethod: row[3],
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
//     fetchIncomeData();
//     fetchExpenseData();
//   }, []);

//   const filteredTransactions = transactions;

//   const filteredIncomes = monthlyIncomes;

//   const cashIncome = filteredIncomes
//     .filter((inc) => inc.source === "Cash")
//     .reduce((sum, inc) => sum + inc.amount, 0);
//   const axisBankIncome = filteredIncomes
//     .filter((inc) => inc.source === "Axis Bank")
//     .reduce((sum, inc) => sum + inc.amount, 0);
//   const iciciBankIncome = filteredIncomes
//     .filter((inc) => inc.source === "ICICI Bank")
//     .reduce((sum, inc) => sum + inc.amount, 0);

//   const cashExpenses = filteredTransactions
//     .filter((t) => t.paymentMethod === "Cash")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const axisBankExpenses = filteredTransactions
//     .filter((t) => t.paymentMethod === "Axis Bank")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const iciciBankExpenses = filteredTransactions
//     .filter((t) => t.paymentMethod === "ICICI Bank")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalSalaryIncome = filteredIncomes
//     .filter(
//       (inc) =>
//         inc.description &&
//         (inc.description.toLowerCase().includes("salary") ||
//           inc.description.toLowerCase().includes("vetan"))
//     )
//     .reduce((sum, inc) => sum + inc.amount, 0);

// const totalExtraIncome = (filteredIncomes || [])
//   .filter(
//     (inc) =>
//       inc.description && !inc.description.toLowerCase().includes("salary")
//   )
//   .reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);

//     console.log(totalExtraIncome,"sdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdf");
//   const homeBudget = totalSalaryIncome * 0.5;
//   const investBudget = totalSalaryIncome * 0.3;
//   const personalBudget = totalSalaryIncome * 0.2;
//   const homeExpenses = filteredTransactions
//     .filter((t) => t.category === "home")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const investExpenses = filteredTransactions
//     .filter((t) => t.category === "invest")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const personalExpenses = filteredTransactions
//     .filter((t) => t.category === "personal")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const remainingHome = homeBudget - homeExpenses;
//   const remainingInvest = investBudget - investExpenses;
//   const remainingPersonal = personalBudget - personalExpenses;

//   const cashBalance = cashIncome - cashExpenses;
//   const axisBankBalance = axisBankIncome - axisBankExpenses;
//   const iciciBankBalance = iciciBankIncome - iciciBankExpenses;

//   const totalBalance = cashBalance + axisBankBalance + iciciBankBalance;

//   const totalIncome = filteredIncomes.reduce((sum, inc) => {
//     const amount = parseFloat(inc.amount);
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalExpenses = filteredTransactions.reduce((sum, t) => {
//     const amount = parseFloat(t.amount);
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   return (
//     <div className="mb-8 p-3 bg-indigo-100 rounded-lg shadow-md text-center">
//       <h2 className="text-2xl font-bold mb-4 text-indigo-700">Dashboard</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
//           <h3 className="text-xl font-bold mb-2 text-green-700">
//             Total Income
//           </h3>
//           <p className="text-3xl font-extrabold text-green-900">
//             ₹ {totalIncome.toFixed(2)}
//           </p>
//         </div>
//         <div className="p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
//           <h3 className="text-xl font-bold mb-2 text-red-700">
//             Total Expenses
//           </h3>
//           <p className="text-3xl font-extrabold text-red-900">
//             ₹ {totalExpenses.toFixed(2)}
//           </p>
//         </div>
//         <div className="p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
//           <h3 className="text-xl font-bold mb-2 text-purple-700">
//             Net Balance
//           </h3>
//           <p
//             className={`text-3xl font-extrabold ${
//               totalBalance >= 0 ? "text-green-900" : "text-red-900"
//             }`}
//           >
//             ₹ {totalBalance.toFixed(2)}
//           </p>
//         </div>
//       </div>
//       <div>
//         {/* Loading spinner show karo jab tak loading true hai */}
//         {loading ? (
//           <div className="flex items-center justify-center min-h-[300px]">
//             <LoadingSpinner1 />
//           </div>
//         ) : (
//           <SalaryBreakdownChart
//             homeBudget={homeBudget}
//             investBudget={investBudget}
//             personalBudget={personalBudget}
//             homeExpenses={homeExpenses}
//             investExpenses={investExpenses}
//             personalExpenses={personalExpenses}
//             loading={loading}
//           />
//         )}
//       </div>

//       <div className="mt-8 flex justify-center align-items-center">
//         <div className="w-full max-w-3xl bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-3 border border-green-200">
//           <h2 className="text-2xl font-extrabold text-green-700 mb-6 tracking-tight">
//             Income Breakdown
//           </h2>
//           <div className="flex justify-center mb-8 gap-4">
//             <div className="mt- grid grid-cols-1 mdgrid-cols-2 gap:-6">
//               <div className="p-3 bg-green-50 rounded-lg shadow-md border-4 border-green-500">
//                 <h3 className="text-xl font-bold mb-2 text-green-700">
//                   Salary Income
//                 </h3>
//                 <p className="text-2xl font-extrabold text-green-900">
//                   ₹ {totalSalaryIncome.toFixed(2)||0}
//                 </p>
//               </div>
//             </div>
//             <div className="mt- grid grid-cols-1 mdgrid-cols-2 gap:-6">
//               <div className="p-3 bg-green-50 rounded-lg shadow-md border-4 border-green-500">
//                 <h3 className="text-xl font-bold mb-2 text-green-700">
//                   Extra Income
//                 </h3>
//                 <p className="text-2xl font-extrabold text-green-900">
//                   ₹ {totalExtraIncome.toFixed(2) || 0}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex flex-wrap w-full  justify-between gap-2 mb-3">
//               <span className="bg-blue-100  text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
//                 Home
//               </span>
//               <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
//                 Investment
//               </span>
//               <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold">
//                 Personal
//               </span>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-blue-50 rounded-xl shadow border-4 border-blue-500 p-3 flex flex-col justify-between">
//               <h3 className="text-lg font-bold text-blue-700 mb-2">
//                 Home (50%)
//               </h3>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Budget:
//                 </span>
//                 <span className="text-xl font-bold text-blue-900">
//                   ₹ {homeBudget.toFixed(2)}
//                 </span>
//               </div>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Expense:
//                 </span>
//                 <span className="text-xl font-bold text-red-600">
//                   ₹ {homeExpenses.toFixed(2)}
//                 </span>
//               </div>
//               <div>
//                 <span className="block text-gray-700 font-semibold">
//                   Balance:
//                 </span>
//                 <span
//                   className={`text-xl font-bold ${
//                     remainingHome >= 0 ? "text-green-700" : "text-red-700"
//                   }`}
//                 >
//                   ₹ {remainingHome.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//             {/* Investment */}
//             <div className="bg-green-50 rounded-xl shadow border-4 border-green-500 p-3 flex flex-col justify-between">
//               <h3 className="text-lg font-bold text-green-700 mb-2">
//                 Investment (30%)
//               </h3>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Budget:
//                 </span>
//                 <span className="text-xl font-bold text-green-900">
//                   ₹ {investBudget.toFixed(2)}
//                 </span>
//               </div>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Expense:
//                 </span>
//                 <span className="text-xl font-bold text-red-600">
//                   ₹ {investExpenses.toFixed(2)}
//                 </span>
//               </div>
//               <div>
//                 <span className="block text-gray-700 font-semibold">
//                   Balance:
//                 </span>
//                 <span
//                   className={`text-xl font-bold ${
//                     remainingInvest >= 0 ? "text-green-700" : "text-red-700"
//                   }`}
//                 >
//                   ₹ {remainingInvest.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//             {/* Personal */}
//             <div className="bg-red-50 rounded-xl shadow border-4 border-red-500 p-3 flex flex-col justify-between">
//               <h3 className="text-lg font-bold text-red-700 mb-2">
//                 Personal (20%)
//               </h3>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Budget:
//                 </span>
//                 <span className="text-xl font-bold text-red-900">
//                   ₹ {personalBudget.toFixed(2)}
//                 </span>
//               </div>
//               <div className="mb-2">
//                 <span className="block text-gray-700 font-semibold">
//                   Expense:
//                 </span>
//                 <span className="text-xl font-bold text-red-600">
//                   ₹ {personalExpenses.toFixed(2)}
//                 </span>
//               </div>
//               <div>
//                 <span className="block text-gray-700 font-semibold">
//                   Balance:
//                 </span>
//                 <span
//                   className={`text-xl font-bold ${
//                     remainingPersonal >= 0 ? "text-green-700" : "text-red-700"
//                   }`}
//                 >
//                   ₹ {remainingPersonal.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import SalaryBreakdownChart from "../../component/salaryBreakdownChart";
import LoadingSpinner1 from "@/component/loadingSpinner";

export default function Dashboard() {
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch income data", err);
    }
    setLoading(false);
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
      console.error("Failed to fetch expense data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
  }, []);

  const filteredTransactions = transactions;
  const filteredIncomes = monthlyIncomes;

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

  const totalSalaryIncome = filteredIncomes
    .filter(
      (inc) =>
        inc.description &&
        (inc.description.toLowerCase().includes("salary") ||
          inc.description.toLowerCase().includes("vetan"))
    )
    .reduce((sum, inc) => sum + inc.amount, 0);

  const totalExtraIncome = (filteredIncomes || [])
    .filter(
      (inc) =>
        inc.description && !inc.description.toLowerCase().includes("salary")
    )
    .reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);

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

  const cashBalance = cashIncome - cashExpenses;
  const axisBankBalance = axisBankIncome - axisBankExpenses;
  const iciciBankBalance = iciciBankIncome - iciciBankExpenses;

  const totalBalance = cashBalance + axisBankBalance + iciciBankBalance;

  const totalIncome = filteredIncomes.reduce((sum, inc) => {
    const amount = parseFloat(inc.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalExpenses = filteredTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const categorizedExpenses = homeExpenses + investExpenses + personalExpenses;
  const otherExpenses = totalExpenses - categorizedExpenses;

  return (
    <div className="mb-6 p-3 sm:p-4 md:p-6 bg-indigo-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-indigo-700">
        Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 sm:p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-green-700">
            Total Income
          </h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-green-900">
            ₹ {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-red-700">
            Total Expenses
          </h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-red-900">
            ₹ {totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">
            Net Balance
          </h3>
          <p
            className={`text-2xl sm:text-3xl font-extrabold ${
              totalBalance >= 0 ? "text-green-900" : "text-red-900"
            }`}
          >
            ₹ {totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <LoadingSpinner1 />
          </div>
        ) : (
          <SalaryBreakdownChart
            homeBudget={homeBudget}
            investBudget={investBudget}
            personalBudget={personalBudget}
            homeExpenses={homeExpenses}
            investExpenses={investExpenses}
            personalExpenses={personalExpenses}
            loading={loading}
          />
        )}
      </div>
      {/* Other Income & Expense Section */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-3xl bg-gradient-to-br from-yellow-50 via-white to-orange-50 rounded-2xl shadow-xl p-4 sm:p-6 border border-yellow-300">
          <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-700 mb-6">
            Other Income & Expense
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg shadow-md border-4 border-yellow-500">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-yellow-700">
                Other Income
              </h3>
              <p className="text-xl sm:text-2xl font-extrabold text-green-900">
                ₹ {totalExtraIncome.toFixed(2) || 0}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg shadow-md border-4 border-orange-500">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-orange-700">
                Other Expense
              </h3>
              <p className="text-xl sm:text-2xl font-extrabold text-red-900">
                ₹ {otherExpenses.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-4xl bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-4 sm:p-6 border border-green-200">
          <h2 className="text-xl sm:text-2xl font-extrabold text-green-700 mb-6">
            Income Breakdown
          </h2>

          {/* Salary & Extra Income */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg shadow-md border-4 border-green-500">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-green-700">
                Salary Income
              </h3>
              <p className="text-xl sm:text-2xl font-extrabold text-green-900">
                ₹ {totalSalaryIncome.toFixed(2) || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg shadow-md border-4 border-green-500">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-green-700">
                Extra Income
              </h3>
              <p className="text-xl sm:text-2xl font-extrabold text-green-900">
                ₹ {totalExtraIncome.toFixed(2) || 0}
              </p>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap justify-center sm:justify-between gap-2 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              Home
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Investment
            </span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              Personal
            </span>
          </div>

          {/* Budget Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Home */}
            <div className="bg-blue-50 rounded-xl shadow border-4 border-blue-500 p-4 flex flex-col justify-between">
              <h3 className="text-base sm:text-lg font-bold text-blue-700 mb-2">
                Home (50%)
              </h3>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Budget:
                </span>
                <span className="text-lg sm:text-xl font-bold text-blue-900">
                  ₹ {homeBudget.toFixed(2)}
                </span>
              </div>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Expense:
                </span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  ₹ {homeExpenses.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold">
                  Balance:
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    remainingHome >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ₹ {remainingHome.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Investment */}
            <div className="bg-green-50 rounded-xl shadow border-4 border-green-500 p-4 flex flex-col justify-between">
              <h3 className="text-base sm:text-lg font-bold text-green-700 mb-2">
                Investment (30%)
              </h3>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Budget:
                </span>
                <span className="text-lg sm:text-xl font-bold text-green-900">
                  ₹ {investBudget.toFixed(2)}
                </span>
              </div>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Expense:
                </span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  ₹ {investExpenses.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold">
                  Balance:
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    remainingInvest >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ₹ {remainingInvest.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Personal */}
            <div className="bg-red-50 rounded-xl shadow border-4 border-red-500 p-4 flex flex-col justify-between">
              <h3 className="text-base sm:text-lg font-bold text-red-700 mb-2">
                Personal (20%)
              </h3>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Budget:
                </span>
                <span className="text-lg sm:text-xl font-bold text-red-900">
                  ₹ {personalBudget.toFixed(2)}
                </span>
              </div>
              <div className="mb-2">
                <span className="block text-gray-700 font-semibold">
                  Expense:
                </span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  ₹ {personalExpenses.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-gray-700 font-semibold">
                  Balance:
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    remainingPersonal >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ₹ {remainingPersonal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
