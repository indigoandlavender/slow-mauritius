import { google } from "googleapis";

// Convert Google Drive URLs to thumbnail format for reliable image loading
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  
  let fileId: string | null = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }
  
  return url;
}

const getGoogleSheetsClient = () => {
  const base64Creds = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!base64Creds) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_BASE64 is not set");
  }

  const credentials = JSON.parse(
    Buffer.from(base64Creds, "base64").toString("utf-8")
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;

export async function getSheetData(tabName: string) {
  const sheets = getGoogleSheetsClient();
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching sheet "${tabName}":`, error.message);
    return [];
  }
}

// Fetch data from Nexus database
export async function getNexusData(tabName: string) {
  const sheets = getGoogleSheetsClient();
  
  if (!NEXUS_SHEET_ID) {
    console.error("NEXUS_SHEET_ID is not set");
    return [];
  }
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching Nexus sheet "${tabName}":`, error.message);
    return [];
  }
}

export async function appendSheetData(tabName: string, values: any[][]) {
  const sheets = getGoogleSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:ZZ`,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

export async function updateSheetRow(
  tabName: string,
  rowIndex: number,
  values: any[]
) {
  const sheets = getGoogleSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A${rowIndex}:ZZ${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });
}

export async function getNextId(prefix: string, tabName: string) {
  const data = await getSheetData(tabName);
  const existingIds = data
    .map((row: any) => row.id || "")
    .filter((id: string) => id.startsWith(prefix))
    .map((id: string) => parseInt(id.replace(prefix, ""), 10))
    .filter((num: number) => !isNaN(num));

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  return `${prefix}${String(maxId + 1).padStart(3, "0")}`;
}
