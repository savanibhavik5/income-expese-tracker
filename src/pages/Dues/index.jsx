import React, { useEffect, useState } from "react";
import LoadingSpinner1 from "@/component/loadingSpinner";

const Dues = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDue = async () => {
      try {
        const res = await fetch("/api/getDues");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);

        const json = await res.json();
        if (json.data) {
          // Filter out "Grand Total"
          const filtered = json.data.filter(
            (row) => row.name !== "Grand Total"
          );
          setData(filtered);
        } else {
          setError("No due data found.");
        }
      } catch (err) {
        setError("Error fetching due data");
      } finally {
        setLoading(false);
      }
    };
    fetchDue();
  }, []);

  // ===== Format Function with Minus Fix =====
  const formatINR = (amount) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount || 0));

    return amount < 0 ? `- ${formatted}` : formatted;
  };

  // ===== Summary Values =====
  const totalPayment = data.reduce(
    (sum, row) => sum + (parseFloat(row.total) || 0),
    0
  );
  const totalPending = data.reduce(
    (sum, row) => sum + (parseFloat(row.pending) || 0),
    0
  );
  const totalBenefit = data.reduce(
    (sum, row) => sum + (parseFloat(row.benefit) || 0),
    0
  );

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-md mb-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
        Payment Dues
      </h2>

      {/* ===== Summary Cards ===== */}
      {!loading && !error && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 sm:p-6 bg-green-50 rounded-lg shadow-md border-b-4 border-green-500">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-green-700">
              Total Payment
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-900">
              {formatINR(totalPayment)}
            </p>
          </div>
          <div className="p-4 sm:p-6 bg-red-50 rounded-lg shadow-md border-b-4 border-red-500">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-red-700">
              Total Pending
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-900">
              {formatINR(totalPending)}
            </p>
          </div>
          <div className="p-4 sm:p-6 bg-purple-50 rounded-lg shadow-md border-b-4 border-purple-500">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-purple-700">
              Total Benefit
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-purple-900">
              {formatINR(totalBenefit)}
            </p>
          </div>
        </div>
      )}

      {/* ===== Table Section ===== */}
      {loading ? (
        <div className="text-center text-gray-500 py-4">
          <LoadingSpinner1 />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No pending payments 🎉
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-600">
                  Sr No
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-600">
                  Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-gray-600">
                  Total
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-gray-600">
                  Pending
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-gray-600">
                  Cashback
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-gray-600">
                  Benefit
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4">{idx + 1}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">{row.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-bold text-blue-600">
                    {formatINR(row.total)}
                  </td>
                  <td
                    className={`py-2 sm:py-3 px-2 sm:px-4 text-right font-bold ${
                      row.pending >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatINR(row.pending)}
                  </td>

                  <td
                    className={`py-2 sm:py-3 px-2 sm:px-4 text-right ${
                      row.cashback >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatINR(row.cashback)}
                  </td>
                  <td
                    className={`py-2 sm:py-3 px-2 sm:px-4 text-right ${
                      row.benefit > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatINR(row.benefit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dues;
