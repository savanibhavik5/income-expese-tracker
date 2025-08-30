import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { sheetIndex, date, amount, source, description } = req.body;
  if (!sheetIndex) {
    return res.status(400).json({ error: "sheetIndex is required" });
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    // Get actual sheetId for "Income Source"
    const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetInfo.data.sheets.find(
      (s) => s.properties.title === "Income Source"
    );
    const actualSheetId = sheet ? sheet.properties.sheetId : 0;
    console.log(
      ` ========> Updating Row: ${sheetIndex} in SheetId: ${actualSheetId}`
    );
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Income Source!A${sheetIndex}:D${sheetIndex}`, // 0-based index, header is row 1
      valueInputOption: "RAW",
      requestBody: {
        values: [[date, amount, source, description]],
      },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}
