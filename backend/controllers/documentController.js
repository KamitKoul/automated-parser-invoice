const Document = require("../models/document");
const parseDocument = require("../uploads/utils/parser");
const fs = require("fs");

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, mimetype, originalname, size } = req.file;

    const { rawText, extractedData } = await parseDocument(
      path,
      mimetype
    );

    const document = await Document.create({
      userId: req.user._id,
      fileName: originalname,
      fileType: mimetype,
      filePath: path,
      fileSize: size,
      rawText,
      extractedData
    });

    // respond with created doc


    res.status(201).json({
      message: "Document uploaded and parsed successfully",
      document
    });
  } catch (error) {
    res.status(500).json({
      message: "Document processing failed",
      error: error.message
    });
  }
};

exports.getDocuments = async (req, res) => {
  const { search, vendor, from, to, minTotal, maxTotal, page = 1, limit = 50 } = req.query;

  const filter = { userId: req.user._id };

  if (vendor) {
    filter['extractedData.vendorName'] = { $regex: vendor, $options: 'i' };
  }

  if (search) {
    filter.$or = [
      { 'extractedData.invoiceNumber': { $regex: search, $options: 'i' } },
      { fileName: { $regex: search, $options: 'i' } }
    ];
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  if (minTotal || maxTotal) {
    filter['extractedData.totalAmount'] = {};
    if (minTotal) filter['extractedData.totalAmount'].$gte = Number(minTotal);
    if (maxTotal) filter['extractedData.totalAmount'].$lte = Number(maxTotal);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const docs = await Document.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalCount = await Document.countDocuments(filter);

  res.json({ docs, totalCount });
};

exports.getDocumentById = async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (document.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json(document);
};

exports.downloadDocument = async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) return res.status(404).json({ message: "Document not found" });
  if (document.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!document.filePath) return res.status(404).json({ message: "File not available" });

  res.download(document.filePath, document.fileName);
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ensure user owns the document
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this document" });
    }

    // Attempt to delete the file from filesystem
    if (document.filePath) {
      fs.unlink(document.filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    await document.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

exports.getVendors = async (req, res) => {
  const vendors = await Document.distinct('extractedData.vendorName', { userId: req.user._id });
  res.json(vendors.filter(Boolean));
};
