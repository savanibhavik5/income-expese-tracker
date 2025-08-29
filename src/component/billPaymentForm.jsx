import React, { useState, useEffect } from "react";

export const ExpenseForm = () => {
  const initialFormData = {
    name: "",
    orderDetail: "",
    billNo: "",
    dateOfPurchase: "",
    timeOfOrder: "",
    via: "",
    orderFrom: "",
    cardDetail: "",
    orderStatus: "",
    cashbackAppliedOnAmount: "",
    extraCharges: "",
    totalPaidFromCard: "",
    paidByParty: "",
    paidDate: "",
    margin: "",
    commission: "",
    paidFromWallet: "",
    cashbackPercent: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const numberFields = [
    "cashbackAppliedOnAmount",
    "extraCharges",
    "totalPaidFromCard",
    "paidByParty",
    "margin",
    "commission",
    "paidFromWallet",
    "cashbackPercent",
  ];

  const validateNumber = (value) => {
    return /^-?\d+(\.\d{1,2})?$/.test(value); // Allows negative or positive numbers with up to 2 decimals
  };

  const newErrors = {};
  Object.entries(formData).forEach(([key, value]) => {
    if (!value) {
      newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
    } else if (numberFields.includes(key)) {
      if (isNaN(value)) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be a number`;
      } else if (!validateNumber(value)) {
        newErrors[key] = `${key.replace(
          /([A-Z])/g,
          " $1"
        )} can have up to 2 decimal places`;
      } else if (key === "cashbackPercent") {
        const num = parseFloat(value);
        if (num < 0 || num > 100) {
          newErrors[key] = "Cashback Percent must be between 0 and 100";
        }
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // 1. Validation logic
    const newErrors = {};
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    // 2. If there are errors, show and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    // 3. Proceed if no errors
    try {
      const res = await fetch("/api/addBillPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setFormData(initialFormData);
        setErrors({});
        fetchExpenses();
      } else {
        setError(result.message || "Failed to save expense");
      }
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/getExpense");
      // console.log(res, "first");

      const json = await res.json();
      // console.log(json, "eeeeeeeeeeeeeeeeeeeeeeee");
      if (json.data) {
        const rows = json.data;
const formatted = rows.slice(1).map((row, idx) => ({
          srNo: row[0] || idx + 1,
          name: row[1] || "-",
          variant: row[2] || "-",
          card_type: row[3] || "-",
          type: row[4] || "-",
          limit: parseInt(row[5]) || 0,
          remainingLimit: parseInt(row[6]) || 0,
        }));
        setExpenses(formatted);
        // setExpenses(json.data);
      }
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Expense Entry Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Object.keys(initialFormData).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="font-semibold text-gray-600 mb-1 capitalize"
            >
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              id={key}
              name={key}
              type={
                numberFields.includes(key)
                  ? "number"
                  : key.includes("date")
                  ? "date"
                  : key.includes("time")
                  ? "time"
                  : "text"
              }
              step={numberFields.includes(key) ? "0.01" : undefined}
              value={formData[key]}
              onChange={handleChange}
              className={`p-3 rounded-lg border-2 ${
                errors[key] ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-blue-500`}
              required
            />
            {errors[key] && (
              <span className="text-red-500 text-sm mt-1">{errors[key]}</span>
            )}
          </div>
        ))}
        <div className="col-span-full flex gap-4 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            {submitting ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Expense Table */}
      <div className="mt-8 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Expense Records</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses recorded.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Sr No
                </th>
                {Object.keys(initialFormData).map((field) => (
                  <th
                    key={field}
                    className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700"
                  >
                    {field.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {expense.srNo || index + 1}
                  </td>
                  {Object.keys(initialFormData).map((field) => (
                    <td key={field} className="py-2 px-4 text-sm text-gray-700">
                      {expense[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
