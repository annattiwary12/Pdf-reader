import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";

// Create BullMQ queue
const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379, // Port must be a number, not string
  },
});

// Setup Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "✅ API is working!" });
});

// PDF Upload Endpoint
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "❌ No PDF file uploaded." });
  }

  const jobData = {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  };

  try {
    await queue.add("file-ready", jobData); // 👈 Pass raw object, not JSON.stringify
    res.json({ message: "✅ PDF uploaded and job queued." });
  } catch (err) {
    console.error("❌ Failed to add job:", err);
    res.status(500).json({ error: "Failed to queue file for processing." });
  }
});

// Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
