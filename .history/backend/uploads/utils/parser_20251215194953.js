const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extractFields = (text) => {
  const invoiceNumber =
    text.match(/Invoice\s*No[:\-]?\s*(\S+)/i)?.[1] || "";

  const invoiceDate =
    text.match(/Date[:\-]?\s*([0-9\/\-]+)/i)?.[1] || "";

  const vendorName =
    text.match(/From[:\-]?\s*(.+)/i)?.[1]?.split("\n")[0] || "";

  const totalAmount =
    text.match(/Total[:\-]?\s*₹?\s*([\d,]+)/i)?.[1]?.replace(",", "") || 0;

  const taxAmount =
    text.match(/Tax[:\-]?\s*₹?\s*([\d,]+)/i)?.[1]?.replace(",", "") || 0;

  return {
    invoiceNumber,
    invoiceDate,
    vendorName,
    totalAmount: Number(totalAmount),
    taxAmount: Number(taxAmount)
  };
};

const parseDocument = async (filePath, fileType) => {
  let text = "";

  if (fileType === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    text = data.text;
  } else {
    const result = await Tesseract.recognize(filePath, "eng");
    text = result.data.text;
  }

  const extractedData = extractFields(text);

  return { rawText: text, extractedData };
};

module.exports = parseDocument;
