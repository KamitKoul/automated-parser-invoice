const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const protect = require("../middlewares/authMiddleware");
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  downloadDocument,
  getVendors
} = require("../controllers/documentController");

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/", protect, getDocuments);
router.get("/vendors", protect, getVendors);
router.get("/:id", protect, getDocumentById);
router.get("/:id/download", protect, downloadDocument);

module.exports = router;
