import fs from "fs/promises";
import path from "path";
import { cloudinary } from "./cloudinary";
import { getApiServerDir } from "./paths";

const uploadUrlPrefix = "/api/uploads/";

export async function deleteUploadedFile(
  url: string | null | undefined
): Promise<void> {
  if (!url) return;

  // Cloudinary file
  if (isCloudinaryUrl(url)) {
    await deleteFromCloudinary(url);
    return;
  }

  // Local file
  const pathname = getUploadPathname(url);
  if (!pathname?.startsWith(uploadUrlPrefix)) return;

  const filename = path.basename(
    decodeURIComponent(pathname.slice(uploadUrlPrefix.length))
  );

  if (!filename) return;

  const uploadDir = path.join(getApiServerDir(import.meta.url), "uploads");
  const filePath = path.join(uploadDir, filename);

  if (path.dirname(filePath) !== uploadDir) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export async function deleteUploadedFiles(
  ...urls: Array<string | null | undefined>
): Promise<void> {
  await Promise.all(urls.map((url) => deleteUploadedFile(url)));
}

function isCloudinaryUrl(url: string): boolean {
  return (
    url.includes("cloudinary.com") ||
    url.includes("res.cloudinary.com")
  );
}

async function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);

  if (!publicId) {
    console.warn(`Could not extract Cloudinary public ID from: ${url}`);
    return;
  }

  try {
    const isVideo = isCloudinaryVideoUrl(url);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? "video" : "image",
      invalidate: true,
    });

    if (result.result === "ok") {
      console.log(`✓ Deleted from Cloudinary: ${publicId}`);
    } else {
      console.warn(
        `Cloudinary delete failed for ${publicId}:`,
        result.result
      );
    }
  } catch (error) {
    console.error(
      `Error deleting Cloudinary resource ${publicId}:`,
      error
    );
  }
}

function isCloudinaryVideoUrl(url: string): boolean {
  return (
    url.includes("/video/upload/") ||
    /\.(mp4|mov|avi|webm|mkv)$/i.test(url)
  );
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    const uploadIndex = pathParts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let remaining = pathParts.slice(uploadIndex + 1);

    if (remaining[0]?.match(/^v\d+$/)) {
      remaining = remaining.slice(1);
    }

    if (!remaining.length) {
      return null;
    }

    let publicId = remaining.join("/");

    publicId = publicId.replace(/\.[^.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
}

function getUploadPathname(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  if (url.startsWith(uploadUrlPrefix)) {
    return url;
  }

  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
}