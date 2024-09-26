export interface Footnote {
  reference?: string;
  quote?: string;
  text?: string;
}

export default function parseFootnote(usfm: string): Footnote {
  const footnote: Footnote = {};

  const refMatch = usfm.match(/\\fr\s([\d\.:]+)/); // Matches the verse reference
  const quoteMatch = usfm.match(/\\fq\s([^\\]+)/); // Matches the scripture quote
  const textMatch = usfm.match(/\\ft\s([^\\]+)/); // Matches the explanatory text

  if (refMatch) {
    footnote.reference = refMatch[1];
  }
  if (quoteMatch) {
    footnote.quote = quoteMatch[1].trim();
  }
  if (textMatch) {
    footnote.text = textMatch[1].trim();
  }

  return footnote;
}
