// import { Doughnut } from "react-chartjs-2";
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// import React from "react";
// Chart.register(ArcElement, Tooltip, Legend);

// function SalaryBreakdownChart({
//   homeBudget,
//   investBudget,
//   personalBudget,
//   homeExpenses,
//   investExpenses,
//   personalExpenses,
// }) {
//   const budgetData = [homeBudget, investBudget, personalBudget];
//   const expenseData = [homeExpenses, investExpenses, personalExpenses];
//   const totalSalary = budgetData.reduce((a, b) => a + b, 0);

//   const data = {
//     labels: ["Home", "Investment", "Personal"],
//     datasets: [
//       {
//         label: "Budget",
//         data: budgetData,
//         backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
//         borderWidth: 2,
//         borderColor: "#fff",
//         hoverOffset: 8,
//       },
//       {
//         label: "Expenses",
//         data: expenseData,
//         backgroundColor: ["#60a5fa", "#34d399", "#f87171"],
//         borderWidth: 2,
//         borderColor: "#fff",
//         hoverOffset: 8,
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: { size: 16 },
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             return `${context.dataset.label}: ₹${context.parsed}`;
//           },
//         },
//       },
//     },
//     responsive: true,
//     cutout: "70%",
//   };

//   // Center label for total salary
//   const centerLabel = {
//     id: "centerLabel",
//     afterDraw: (chart) => {
//       const { ctx, chartArea } = chart;
//       ctx.save();
//       ctx.font = "bold 22px sans-serif";
//       ctx.fillStyle = "#3b82f6";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(
//         `₹${totalSalary.toFixed(0)}`,
//         chartArea.width / 2 + chartArea.left,
//         chartArea.height / 2 + chartArea.top
//       );
//       ctx.font = "14px sans-serif";
//       ctx.fillStyle = "#374151";
//       ctx.fillText(
//         "Total Salary",
//         chartArea.width / 2 + chartArea.left,
//         chartArea.height / 2 + chartArea.top + 28
//       );
//       ctx.restore();
//     },
//   };

//   // Progress bar helper
//   const ProgressBar = ({ label, budget, expense, color }) => {
//     const percent = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;
//     return (
//       <div className="mb-4">
//         <div className="flex justify-between mb-1">
//           <span className={`font-bold`} style={{ color }}>{label}</span>
//           <span className="text-sm font-semibold text-gray-700">
//             ₹{expense.toFixed(2)} / ₹{budget.toFixed(2)}
//           </span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-4">
//           <div
//             className="h-4 rounded-full"
//             style={{
//               width: `${percent}%`,
//               background: color,
//               transition: "width 0.5s",
//             }}
//           ></div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-md mx-auto mb-8">
//       <div style={{ height: 320 }}>
//         <Doughnut data={data} options={options} plugins={[centerLabel]} />
//       </div>
//       <div className="mt-6">
//         <ProgressBar
//           label="Home"
//           budget={homeBudget}
//           expense={homeExpenses}
//           color="#3b82f6"
//         />
//         <ProgressBar
//           label="Investment"
//           budget={investBudget}
//           expense={investExpenses}
//           color="#10b981"
//         />
//         <ProgressBar
//           label="Personal"
//           budget={personalBudget}
//           expense={personalExpenses}
//           color="#ef4444"
//         />
//       </div>
//       <div className="mt-4 flex justify-center gap-4">
//         <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
//           Home
//         </span>
//         <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
//           Investment
//         </span>
//         <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm">
//           Personal
//         </span>
//       </div>
//     </div>
//   );
// }

// export default SalaryBreakdownChart;

import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import LoadingSpinner1 from "./loadingSpinner";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalaryBreakdownChart({
  homeBudget,
  investBudget,
  personalBudget,
  homeExpenses,
  investExpenses,
  personalExpenses,
  loading,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center mt-1 min-h-[200px]">
        <LoadingSpinner1 />
        <span className="ml-3 text-gray-600 font-semibold">
          Graph Loading...
        </span>
      </div>
    );
  }
  const data = {
    labels: ["Home", "Investment", "Personal"],
    datasets: [
      {
        label: "Budget",
        data: [homeBudget, investBudget, personalBudget],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
        barPercentage: 0.5,
      },
      {
        label: "Expenses",
        data: [homeExpenses, investExpenses, personalExpenses],
        backgroundColor: "#ef4444",
        borderRadius: 8,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 16 } },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ₹${context.parsed.y}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 16 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { font: { size: 14 } },
      },
    },
  };

  return (
    <div className="w-full flex mt-6 justify-center">
      <div className="w-full  bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className="w-full" style={{ height: 320 }}>
          <Bar data={data} options={options} />
        </div>
        <div className="mt-6 flex justify-center gap-6">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-base shadow">
            Home
          </span>
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-base shadow">
            Investment
          </span>
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-base shadow">
            Personal
          </span>
        </div>
      </div>
    </div>
  );
}

export default SalaryBreakdownChart;
