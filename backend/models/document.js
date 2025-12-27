const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileName: String,
    fileType: String,
    filePath: String,
    fileSize: Number,
    rawText: String,
    extractedData: {
      invoiceNumber: String,
      invoiceDate: String,
      vendorName: String,
      totalAmount: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
