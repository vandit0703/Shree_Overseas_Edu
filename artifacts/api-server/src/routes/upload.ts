import { Router } from "express";
import multer from "multer";
import { cloudinary } from "../lib/cloudinary";

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedExt = /\.(jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm)$/i;
    const allowedMime = /^(image|video)\//;
    if (allowedExt.test(file.originalname) || allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },
});

const router = Router();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  // multer with memoryStorage puts the file buffer on req.file.buffer
  const file = req.file as Express.Multer.File & { buffer?: Buffer };
  if (!file.buffer) {
    res.status(500).json({ error: "Uploaded file buffer not available" });
    return;
  }

  const isVideo = /^video\//.test(file.mimetype || "");
  const folder = isVideo ? "videos" : "gallery";

  const uploadOptions: Record<string, unknown> = {
    folder,
    resource_type: isVideo ? "video" : "auto",
    use_filename: false,
    unique_filename: true,
    overwrite: false,
  };

  cloudinary.uploader.upload_stream(
    uploadOptions,
    (error, result) => {
      if (error) {
        // preserve existing validation style
        res.status(500).json({ error: (error && (error as Error).message) || "Upload failed" });
        return;
      }

      const secureUrl = (result && (result as any).secure_url) || null;
      const publicId = (result && (result as any).public_id) || null;

      console.log(`[Upload] File uploaded successfully:`, {
        isVideo,
        originalName: file.originalname,
        publicId: publicId,
        secureUrl: secureUrl,
        resourceType: (result as any).resource_type,
        fullResult: result,
      });

      if (!secureUrl) {
        res.status(500).json({ error: "Failed to get uploaded file URL" });
        return;
      }

      // Keep response shape similar to previous local upload
      res.json({ url: secureUrl, filename: publicId, originalName: file.originalname });
    },
  ).end(file.buffer);
});

router.use(
  (
    err: unknown,
    _req: unknown,
    res: { status: (n: number) => { json: (b: unknown) => void } },
    next: (e?: unknown) => void,
  ) => {
    if (err && typeof err === "object" && (err as { code?: string }).code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File too large." });
      return;
    }
    next(err);
  },
);

export default router;
