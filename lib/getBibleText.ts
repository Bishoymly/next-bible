import fs from "fs";
import path from "path";

var usfm = require("usfm-js");

export default function getBibleText() {
  const filePath = path.join(process.cwd(), "public", "data", "t_asv.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const text = JSON.parse(fileContents).resultset.row;
  return text;
}

export function getBibleJson(b, version) {
  const filePath = path.join(process.cwd(), "public", "data", version, `${b}.usfm`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const text = usfm.toJSON(fileContents);
  return text;
}
