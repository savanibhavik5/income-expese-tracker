// /pages/api/getDue.js
import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // .env me rakho
    const range = "Pivot Of Bill!A2:E"; // Adjust karo sheet ke hisaab se

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    console.log(rows, "rows due wala");
    const formatted = rows
      .map((row, idx) => ({
        id: idx + 1,
        name: row[0],
        total: parseInt(row[1]) || 0,
        pending: parseInt(row[2]) || 0,
        cashback: parseInt(row[3]) || 0,
        benefit: parseInt(row[4]) || 0,
      }))
      .filter(
        (row) => (row.name && row.name !== "Grand Total") || row.name == " "
      );

    res.status(200).json({ data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch due data" });
  }
}
