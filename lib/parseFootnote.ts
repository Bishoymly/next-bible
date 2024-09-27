export interface Footnote {
  reference?: string;
  quote?: string;
  text?: string;
}

export default function parseFootnote(usfm: string): Footnote {
  const footnote: Footnote = {};

  const refMatch = usfm.match(/\\fr\s([\d\.:]+)/); // Matches the verse reference
  const quoteMatch = usfm.match(/\\fq\s([^\\]+)/); // Matches the scripture quote
  const altQuoteMatch = usfm.match(/\\fqa\s([^\\]+)/); // Matches the alternative quote
  const textMatch = usfm.match(/\\ft\s([^\\]+)/); // Matches the explanatory text
  const altTextMatch = usfm.match(/\\fta\s([^\\]+)/); // Matches the alternative text

  // Set the reference, quote, and text fields
  if (refMatch) {
    footnote.reference = refMatch[1];
  }
  if (quoteMatch) {
    footnote.quote = quoteMatch[1].trim();
  } else if (altQuoteMatch) {
    footnote.quote = altQuoteMatch[1].trim();
  }
  if (textMatch) {
    footnote.text = textMatch[1].trim();
  } else if (altTextMatch) {
    footnote.text = altTextMatch[1].trim();
  }

  return footnote;
}
