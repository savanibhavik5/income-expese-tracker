import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { sheetIndex } = req.body;
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

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 825968614, // Your sheetId for "Expeses Detail"
              dimension: "ROWS",
              startIndex: sheetIndex - 1, // 0-based index, header is row 1
              endIndex: sheetIndex, // exclusive
            },
          },
        },
      ],
    },
  });

  res.status(200).json({ success: true });
}