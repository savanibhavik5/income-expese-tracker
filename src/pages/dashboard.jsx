import React from "react";

export default function Dashboard() {
  return (
    <>
      {/* Date Selector, now with Month/Year view options */}
      <div className="mb-8 p-6 bg-indigo-100 rounded-lg shadow-md text-center">
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => {
              setViewType("month");
              const currentMonthYear = new Date().toISOString().slice(0, 7);
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

      {/* Monthly/Yearly Pie Chart */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {expenseTitle} ({viewType === "month" ? selectedMonth : selectedYear})
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
        {/* Pie Chart Legend */}
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

      {/* Total Income and Expense Dashboard */}
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

      {/* Cash and Bank Balance Dashboard - now with total balance box */}
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

      {/* Credit Card Dashboard */}
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

      {/* Income Dashboards */}
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

      {/* 50-30-20 Dashboard */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Salary-Based 50-30-20 Budget
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg shadow-md border-b-4 border-blue-500">
            <h3 className="text-xl font-bold mb-2 text-blue-700">50% Home</h3>
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

      {/* Separate Remaining Balances Dashboard */}
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
            <h3 className="text-lg font-bold mb-1 text-red-800">Personal</h3>
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
  );
}
