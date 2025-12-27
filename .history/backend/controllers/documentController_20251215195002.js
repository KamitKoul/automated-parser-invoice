const Document = require("../models/Document");
const parseDocument = require("../utils/parser");
const fs = require("fs");

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, mimetype, originalname } = req.file;

    const { rawText, extractedData } = await parseDocument(
      path,
      mimetype
    );

    const document = await Document.create({
      userId: req.user._id,
      fileName: originalname,
      fileType: mimetype,
      rawText,
      extractedData
    });

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
  const documents = await Document.find({ userId: req.user._id }).sort({
    createdAt: -1
  });
  res.json(documents);
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
