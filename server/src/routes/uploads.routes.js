import { Router } from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const uploadDirectory = path.resolve("uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) =>
    callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, file.mimetype.startsWith("image/")),
});

router.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "An image file is required" });
  return res
    .status(201)
    .json({
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
});

export default router;
