import fs from "fs";
import path from "path";

export default function getBibleText() {
  const filePath = path.join(process.cwd(), "public", "data", "t_asv.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const text = JSON.parse(fileContents).resultset.row;
  return text;
}
