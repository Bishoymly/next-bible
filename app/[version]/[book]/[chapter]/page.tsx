import { BibleReader } from "@/components/bible-reader";
import { GetCachedImage } from "@/lib/generateImage";
import getBibleText from "@/lib/getBibleText";
import getBooks from "@/lib/getBooks";

export default async function Read({ params }) {
  const { version, book, chapter } = params;
  const books = getBooks();
  const bookInfo = books.filter((b) => b.n.toLowerCase() === book.replace(/-/g, " "))[0];
  const data = getBibleText().filter((row) => row.field[1] === bookInfo.b && row.field[2] == chapter);
  const imageUrl = await GetCachedImage(book + `-${chapter}-`);
  return <BibleReader data={data} book={book} bookInfo={bookInfo} chapter={chapter} version={version} imageUrl={imageUrl} />;
}
