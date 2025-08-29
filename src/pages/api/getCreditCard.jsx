import { google } from "googleapis";

// export default async function handler(req, res) {
//   if (req.method !== "GET") return res.status(405).end();
//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//       },
//       scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//     });
//     const sheets = google.sheets({ version: "v4", auth });
//     const spreadsheetId = process.env.GOOGLE_SHEET_ID;
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: "Creditcard!A:G", // ✅ check sheet name
//     });
//     res.status(200).json({ data: response.data.values });
//   } catch (error) {
//     console.error("Google Sheets API Error:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   }
// }
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      throw new Error("Missing required environment variables.");
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
      range: "Creditcard!A:G",
    });

    res.status(200).json({ data: response.data.values });
  } catch (error) {
    console.error("Google Sheets API Error:", error);

    // Important: set correct headers before sending a message
    res.setHeader("Content-Type", "application/json");
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
