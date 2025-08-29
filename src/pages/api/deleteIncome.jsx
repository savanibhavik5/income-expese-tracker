import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { sheetIndex } = req.body;
  if (typeof sheetIndex !== "number" || sheetIndex < 2) {
    // sheetIndex should be >= 2 (assuming row 1 is header)
    return res
      .status(400)
      .json({ error: "Valid sheetIndex is required (>=2)" });
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

    // Debug log
    // console.log("SheetId:", actualSheetId, "Deleting Row:", sheetIndex);

    // Delete the row (shift rows up)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: actualSheetId,
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
  } catch (err) {
    // console.error("Delete error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

// import { google } from "googleapis";

// export default async function handler(req, res) {
//   if (req.method !== "DELETE") return res.status(405).end();

//   const { sheetIndex } = req.body;
//   if (!sheetIndex) {
//     return res.status(400).json({ error: "sheetIndex is required" });
//   }

//   const auth = new google.auth.GoogleAuth({
//     credentials: {
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     },
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const sheets = google.sheets({ version: "v4", auth });
//   const spreadsheetId = process.env.GOOGLE_SHEET_ID;

//   // Get actual sheetId dynamically
//   const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
//   const sheet = sheetInfo.data.sheets.find(
//     (s) => s.properties.title === "Income Source"
//   );
//   const actualSheetId = sheet ? sheet.properties.sheetId : 0;

//   console.log("SheetId:", actualSheetId, "Deleting Row:", sheetIndex);

//   try {
//     await sheets.spreadsheets.batchUpdate({
//       spreadsheetId,
//       requestBody: {
//         requests: [
//           {
//             deleteDimension: {
//               range: {
//                 sheetId: actualSheetId,
//                 dimension: "ROWS",
//                 startIndex: sheetIndex, // 0-based index, header is row 1
//                 endIndex: sheetIndex, // exclusive
//               },
//             },
//           },
//         ],
//       },
//     });
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// }
