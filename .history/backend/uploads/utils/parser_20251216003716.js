const fs = require("fs");
const pdfParse = require("pdf-parse");
const { createWorker } = require("tesseract.js");

/* -------------------------------------------------------
   TEXT UTILITIES
------------------------------------------------------- */

// Normalize OCR / PDF text
const normalizeText = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();

// Normalize currency / numeric values safely
const normalizeNumber = (value) => {
  if (!value) return 0;

  let num = value.replace(/\s+/g, "");

  // Handle European formats: 1.234,56 → 1234.56
  if (num.includes(",") && (!num.includes(".") || num.lastIndexOf(",") > num.lastIndexOf("."))) {
    num = num.replace(/\./g, "").replace(",", ".");
  } else {
    num = num.replace(/,/g, "");
  }

  const parsed = parseFloat(num);
  return isNaN(parsed) ? 0 : parsed;
};

// Find first matching value from multiple regex patterns
const findValue = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
};

/* -------------------------------------------------------
   FIELD EXTRACTION
------------------------------------------------------- */

const extractFields = (rawText) => {
  const text = normalizeText(rawText);

  /* -------- Invoice Number -------- */
  const invoiceNumber = findValue(text, [
    /Invoice\s*(No|Number)?[:#\-\s]*([A-Z0-9\-]+)/i,
    /Bill\s*No[:#\-\s]*([A-Z0-9\-]+)/i,
    /\b#\s*([A-Z0-9\-]{3,})\b/
  ]);

  /* -------- Invoice Date -------- */
  const invoiceDate = findValue(text, [
    /Date\s*of\s*issue[:\-\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i,
    /(Invoice\s*Date|Bill\s*Date|Dated)[:\-\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i,
    /\b([0-9]{4}[\/\-][0-9]{2}[\/\-][0-9]{2})\b/
  ]);

  /* -------- Vendor / Seller -------- */
  let vendorName = findValue(text, [
    /(Seller|Vendor|From|Billed\s*By)[:\-\s]*(?:Client[:\-\s]*)?([A-Za-z,&.\s]+)/i,
    /Company\s*Name[:\-\s]*([A-Za-z,&.\s]+)/i,
    /Business\s*Name[:\-\s]*([A-Za-z,&.\s]+)/i
  ]);

  // Heuristic fallback: first meaningful non-numeric line
  if (!vendorName) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (
        !line.match(/invoice|bill|date|page|iban|tax|id/i) &&
        !line.match(/\d{3,}/)
      ) {
        vendorName = line;
        break;
      }
    }
  }

  /* -------- TOTAL & TAX (STRICT SUMMARY-BASED) -------- */

  // Match: Total $ 258,96 $ 25,90 $ 284,86
  const totalRow = text.match(
    /Total\s*[$₹€£]?\s*([\d\s.,]+)\s*[$₹€£]?\s*([\d\s.,]+)\s*[$₹€£]?\s*([\d\s.,]+)/i
  );

  let totalAmount = 0;
  let taxAmount = 0;

  if (totalRow) {
    totalAmount = normalizeNumber(totalRow[3]); // Gross
    taxAmount = normalizeNumber(totalRow[2]);   // VAT
  }

  /* -------- SAFE FALLBACKS -------- */

  // Gross worth fallback
  if (!totalAmount) {
    totalAmount = normalizeNumber(
      findValue(text, [
        /Gross\s*worth[:\-\s$₹€£]*([\d\s.,]+)/i,
        /Grand\s*Total[:\-\s$₹€£]*([\d\s.,]+)/i,
        /Amount\s*Due[:\-\s$₹€£]*([\d\s.,]+)/i
      ])
    );
  }

  // VAT fallback (never generic "Tax")
  if (!taxAmount) {
    taxAmount = normalizeNumber(
      findValue(text, [
        /\bVAT\b[:\-\s$₹€£]*([\d\s.,]+)/i,
        /\bGST\b[:\-\s$₹€£]*([\d\s.,]+)/i,
        /\bTax\s*Amount\b[:\-\s$₹€£]*([\d\s.,]+)/i
      ])
    );
  }

  return {
    invoiceNumber,
    invoiceDate,
    vendorName: vendorName || "Unknown Vendor",
    totalAmount,
    taxAmount
  };
};

/* -------------------------------------------------------
   DOCUMENT PARSER
------------------------------------------------------- */

const parseDocument = async (filePath, fileType) => {
  let text = "";

  try {
    if (fileType === "application/pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      const buffer = fs.readFileSync(filePath);
      const worker = await createWorker("eng");
      const result = await worker.recognize(buffer);
      text = result.data.text;
      await worker.terminate();
    }

    const extractedData = extractFields(text);

    return {
      rawText: text,
      extractedData
    };
  } catch (error) {
    console.error("[Parser Error]", error);
    throw new Error("Document parsing failed");
  }
};

module.exports = parseDocument;
