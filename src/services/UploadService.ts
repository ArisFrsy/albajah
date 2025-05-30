// lib/uploadService.ts
import fs from "fs";
import path from "path";

export const saveFileToLocal = async (file: File | null): Promise<string> => {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Pastikan folder ada
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (!file) {
    throw new Error("No file provided for upload");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  console.log(`Saving file to: ${filePath}`);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
};
