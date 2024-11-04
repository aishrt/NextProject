import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const uploadFile = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

  // Define the upload directory path
  const uploadDir = path.join(process.cwd(), "public/uploads");

  try {
    // Ensure the directory exists or create it
    await mkdir(uploadDir, { recursive: true });

    // Write the file to the uploads directory
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the file path or URL
    return `/${filename}`;
  } catch (error) {
    console.error("Error occurred while uploading the file:", error);
    throw error; // Ensure the error gets passed up to be handled
  }
};
