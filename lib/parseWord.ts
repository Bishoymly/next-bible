export interface ParsedData {
  text: string;
  strong: string;
}

export default function parseWord(input: string): ParsedData {
  // Split the string by '|'
  const [textPart, strongPart] = input.split("|");

  // Extract the strong number from the strong part using regex
  let strongMatch = null;
  if (strongPart) {
    strongMatch = strongPart.match(/strong="([^"]+)"/);
  }

  return {
    text: textPart.trim(), // Trim any extra spaces from the text part
    strong: strongMatch ? strongMatch[1] : "", // Extract the strong value if found
  };
}
