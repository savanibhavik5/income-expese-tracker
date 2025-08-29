// pages/api/addBillPayment.js

import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    orderDetail,
    billNo,
    dateOfPurchase,
    timeOfOrder,
    via,
    orderFrom,
    cardDetail,
    orderStatus,
    cashbackAppliedOnAmount,
    extraCharges,
    totalPaidFromCard,
    paidByParty,
    paidDate,
    margin,
    commission,
    paidFromWallet,
    cashbackPercent,
  } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = "Bill Payment";

    // 1. Get existing data to find last srNo
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });

    const existingRows = readRes.data.values || [];
    const lastSrNo =
      existingRows.length > 0
        ? parseInt(existingRows[existingRows.length - 1][0])
        : 0;
    const newSrNo = lastSrNo + 1;

    // 2. Prepare row: srNo + all fields
    const newRow = [
      newSrNo,
      name,
      orderDetail,
      billNo,
      dateOfPurchase,
      timeOfOrder,
      via,
      orderFrom,
      cardDetail,
      orderStatus,
      cashbackAppliedOnAmount,
      extraCharges,
      totalPaidFromCard,
      paidByParty,
      paidDate,
      margin,
      commission,
      paidFromWallet,
      cashbackPercent,
    ];

    // 3. Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [newRow],
      },
    });

    res
      .status(200)
      .json({ message: "Expense saved successfully", srNo: newSrNo });
  } catch (error) {
    console.error("Error saving expense:", error);
    res
      .status(500)
      .json({ message: "Failed to save expense", error: error.message });
  }
}
