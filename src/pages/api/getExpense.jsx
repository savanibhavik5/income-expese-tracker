// import { google } from "googleapis";

// export default async function handler(req, res) {
//   if (req.method !== "GET") return res.status(405).end();

//   const auth = new google.auth.GoogleAuth({
//     credentials: {
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     },
//     scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//   });

//   const sheets = google.sheets({ version: "v4", auth });
//   const spreadsheetId = process.env.GOOGLE_SHEET_ID;

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Expeses Detail!A:E",
//   });

//   res.status(200).json({ data: response.data.values });
// }

import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      throw new Error("Missing Google API environment variables.");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Expeses Detail!A2:E", // ✅ double-check sheet name spelling
    });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ data: response.data.values });
  } catch (error) {
    console.error("Error fetching expenses:", error);

    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      error: "Failed to fetch expenses",
      message: error.message,
    });
  }
}
