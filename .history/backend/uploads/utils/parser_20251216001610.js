const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extractFields = (text) => {
  const cleanText = text.replace(/\s+/g, " ");

  const invoiceNumber =
    cleanText.match(/Invoice\s*(no|number)?[:\-]?\s*(\d+)/i)?.[2] || "";

  const invoiceDate =
    cleanText.match(/Date\s*(of\s*issue)?[:\-]?\s*([0-9\/\-]+)/i)?.[2] || "";

  const vendorName =
    cleanText.match(/Seller[:\-]?\s*([A-Za-z\s]+?)\s{2,}/i)?.[1]?.trim() || "";

  // BEST: Total $ ... $ ... $ 306,82
  let totalAmount =
    cleanText.match(/Total\s*\$\s*[\d.,]+\s*\$\s*[\d.,]+\s*\$\s*([\d.,]+)/i)?.[1];

  // Fallback: Gross worth
  if (!totalAmount) {
    totalAmount =
      cleanText.match(/Gross\s*worth\s*([\d.,]+)/i)?.[1];
  }

  // VAT
  let taxAmount =
    cleanText.match(/Total\s*\$\s*[\d.,]+\s*\$\s*([\d.,]+)/i)?.[1] ||
    cleanText.match(/VAT\s*([\d.,]+)/i)?.[1];

  const normalize = (val) =>
    val
      ? Number(
          val
            .replace(/\$/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
        )
      : 0;

  return {
    invoiceNumber,
    invoiceDate,
    vendorName,
    totalAmount: normalize(totalAmount),
    taxAmount: normalize(taxAmount)
  };
};
