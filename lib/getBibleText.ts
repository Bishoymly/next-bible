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

export function swapSectionAndParagraph(data) {
  // Remove 'p' element from verse[0]
  if (data["0"] && data["0"].verseObjects) {
    data["0"].verseObjects = data["0"].verseObjects.filter((obj) => obj.tag !== "p");
  }

  // Iterate through all verses
  for (const key in data) {
    const verse = data[key].verseObjects;

    // Check if there is an 's1' followed by a 'p'
    for (let i = 0; i < verse.length - 1; i++) {
      if (verse[i].tag === "s1" && verse[i + 1].tag === "p") {
        // Swap the 's1' and 'p' elements
        const temp = verse[i];
        verse[i] = verse[i + 1];
        verse[i + 1] = temp;
      }
    }
  }

  return data;
}
