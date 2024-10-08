export function getBookSlug(books, language, name) {
  // handling some arabic book names
  switch (name) {
    case "مزمور":
      return "psalms";
    case "سفر الملوك الأول":
      return "1-kings";
    case "سفر الملوك الثاني":
      return "2-kings";
    case "سفر الأمثال":
      return "proverbs";
    case "سفر الجامعة":
      return "ecclesiastes";
  }

  const book = books.filter((b) => b.n === name || b.short === name);
  if (book.length > 0) {
    return book[0].slug;
  } else {
    return name.replace(/ /g, "-").toLowerCase();
  }
}
