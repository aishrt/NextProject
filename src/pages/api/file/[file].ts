import fs from "fs";
import path from "path";

const getExtension = (image: string) => {
  try {
    const parts = image.split(".");
    const length = parts.length;
    const ext = parts[length - 1];
    return ext;
  } catch (e) {
    return "png";
  }
};

export default function (req: any, res: any) {
  const { file } = req.query;
  const extension = getExtension(file);
  const filePath = path.join(
    path.dirname(__filename),
    `../../../../../public/uploads/${file}`
  );
  const imageBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", `image/${extension}`);
  res.send(imageBuffer);
}
