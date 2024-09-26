import fs from "fs";
import path from "path";

export default function getVersions() {
  const filePath = path.join(process.cwd(), "public", "data", `versions.json`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const versions = JSON.parse(fileContents);
  return versions;
}
