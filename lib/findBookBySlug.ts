/**
 * Finds a book by slug, accepting variations with or without dashes.
 * For example, "2corinthians" will match "2-corinthians"
 */
export function findBookBySlug(books: any[], slug: string): any | undefined {
  // First try exact match
  let book = books.find((b) => b.slug === slug);
  if (book) {
    return book;
  }

  // Try normalizing by adding hyphen after number (e.g., "2corinthians" -> "2-corinthians")
  // Pattern: number followed by lowercase letter -> number-hyphen-lowercase letter
  const normalized = slug.replace(/^(\d+)([a-z])/i, '$1-$2');
  if (normalized !== slug) {
    book = books.find((b) => b.slug === normalized);
    if (book) {
      return book;
    }
  }

  // Try comparing by removing all dashes from both sides
  const slugWithoutDashes = slug.replace(/-/g, '');
  book = books.find((b) => b.slug.replace(/-/g, '') === slugWithoutDashes);
  if (book) {
    return book;
  }

  return undefined;
}

