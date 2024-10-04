export function getBookSlug(books, language, name) {
  const book = books.filter((b) => b.n === name);
  if (book.length > 0) {
    return book[0].slug;
  } else {
    return name.replace(/ /g, "-").toLowerCase();
  }
}
