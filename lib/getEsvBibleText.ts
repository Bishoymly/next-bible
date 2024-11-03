export default async function getEsvBibleText(query) {
  const response = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${query}`,
    {
      headers: {
        Authorization: `Token ${process.env.ESV_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  const convertedData = convertEsvSampleToJson(data);
  return convertedData;
}

function convertEsvSampleToJson(esvSample: any) {
  const jsonExample = {
    "0": {
      verseObjects: [],
    },
  };

  let passage = esvSample.passages[0];
  const footnotesSection = passage.split("\n\nFootnotes\n\n")[1];
  const footnotes = extractFootnotes(footnotesSection);
  passage = passage.split("\n\nFootnotes\n\n")[0]; // Remove Footnotes section

  const verses = passage.split(/\[\d+\]/).slice(1);

  verses.forEach((verse, index) => {
    const verseObjects = [];
    let verseText = verse.trim();

    // Remove (ESV) from the last verse
    if (index === verses.length - 1) {
      verseText = verseText.replace(/\(ESV\)/g, "").trim();
    }

    // Split the verse text to insert footnotes in their respective places
    let lastIndex = 0;
    verseText.replace(/\((\d+)\)/g, (match, p1, offset) => {
      if (lastIndex < offset) {
        verseObjects.push({
          text: verseText.substring(lastIndex, offset).trim(),
          type: "text",
        });
      }
      const footnoteText = footnotes[p1].replace(/^\d+:\d+\s*/, "");
      const footnote = {
        tag: "f",
        type: "footnote",
        content: `+ \\fr ${index + 1}.${p1} \\ft ${footnoteText}`,
        endTag: "f*",
        nextChar: " ",
      };
      verseObjects.push(footnote);
      lastIndex = offset + match.length;
      return "";
    });

    if (lastIndex < verseText.length) {
      verseObjects.push({
        text: verseText.substring(lastIndex).trim(),
        type: "text",
      });
    }

    jsonExample[index + 1] = { verseObjects };
  });

  return jsonExample;
}

function extractFootnotes(footnotesSection: string): { [key: string]: string } {
  const footnotes: { [key: string]: string } = {};
  const footnoteRegex = /\((\d+)\) ([\s\S]*?)(?=\(\d+\) |$)/g;
  let match;

  while ((match = footnoteRegex.exec(footnotesSection)) !== null) {
    footnotes[match[1]] = match[2].trim();
  }

  return footnotes;
}
