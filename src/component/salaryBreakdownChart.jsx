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

// Register chart.js components
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

  // Chart Data
  const data = {
    labels: ["Home", "Investment", "Personal"],
    datasets: [
      {
        label: "Budget",
        data: [homeBudget, investBudget, personalBudget],
        backgroundColor: ["#3b82f6", "#10b981", "#ef4444"], // Blue, Green, Red
        borderRadius: 8,
        barPercentage: 0.5,
      },
      {
        label: "Expenses",
        data: [homeExpenses, investExpenses, personalExpenses],
        backgroundColor: ["#93c5fd", "#6ee7b7", "#fca5a5"], // Light Blue, Green, Red
        borderRadius: 8,
        barPercentage: 0.5,
      },
    ],
  };

  // Chart Options
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
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
        ticks: {
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="w-full flex mt-6 justify-center px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center">
        {/* Chart Container */}
        <div className="w-full h-[250px] sm:h-[300px] md:h-[320px]">
          <Bar data={data} options={options} />
        </div>

        {/* Labels */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm sm:text-base">
            Home
          </span>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm sm:text-base">
            Investment
          </span>
          <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm sm:text-base">
            Personal
          </span>
        </div>
      </div>
    </div>
  );
}

export default SalaryBreakdownChart;
