export default function groupChildrenByTags(verses, openingTag = "wj", closingTag = "wj*") {
  for (let verseKey in verses) {
    const verseObjects = verses[verseKey].verseObjects;
    const newVerseObjects = [];
    let isGrouping = false;
    let groupedObject = null;

    for (let i = 0; i < verseObjects.length; i++) {
      const currentObject = verseObjects[i];

      // Check if we're starting a grouping with the opening tag
      if (currentObject.tag === openingTag) {
        isGrouping = true;
        groupedObject = currentObject;
        continue;
      }

      // Check if we're ending a grouping with the closing tag
      if (currentObject.tag === closingTag && isGrouping) {
        isGrouping = false;
        newVerseObjects.push(groupedObject);
        newVerseObjects.push(currentObject);
        groupedObject = null;
        continue;
      }

      // If we're currently grouping, push objects into the children array
      if (isGrouping && groupedObject) {
        groupedObject.children.push(currentObject);
      } else {
        // Add objects normally if not within a grouping
        newVerseObjects.push(currentObject);
      }
    }

    // Replace the verseObjects with the modified structure
    verses[verseKey].verseObjects = newVerseObjects;
  }
  return verses;
}
