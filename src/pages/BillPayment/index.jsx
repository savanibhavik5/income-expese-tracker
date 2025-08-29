import ExpenseForm from "@/component/billPaymentForm";
import LoadingSpinner1 from "@/component/loadingSpinner";
import React, { useEffect, useState } from "react";

export const BillPayment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheetData = async () => {
    try {
      const res = await fetch("/api/getCreditCard");

      // Check content-type before parsing
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch error: ${res.status} - ${errorText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON, got: ${text}`);
      }

      const json = await res.json();
      // console.log(json.data, "json data");

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
        setData(formatted);
      } else {
        setError("No data found in Google Sheet.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch credit card data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Credit Card Data
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 py-4">
          <LoadingSpinner1 />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No data available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Sr No
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Name
                </th>
                {/* <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Variant
                </th> */}
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Card Type
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Type
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Limit
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">
                  Remaining Limit
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((card, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{card.srNo}</td>
                  <td className="py-3 px-4">{card.name}</td>
                  {/* <td className="py-3 px-4">{card.variant}</td> */}
                  <td className="py-3 px-4">{card.card_type}</td>
                  <td className="py-3 px-4">{card.type}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">
                    {formatINR(card.limit)}
                  </td>
                  <td className="py-3 px-4 font-bold text-green-600">
                    {formatINR(card.remainingLimit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExpenseForm />
    </div>
  );
};

export default BillPayment;
