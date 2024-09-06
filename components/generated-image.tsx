"use server";
import GenerateImage from "@/lib/generateImage";
import { Suspense } from "react";

export async function BookImage(book) {
  return (
    <Suspense>
      <GetBookImage book={book} />
    </Suspense>
  );
}

export async function GetBookImage(book) {
  const url = await GenerateImage({ key: book + "/intro", prompt: `generate a sketch drawing for the book of ${book}` });
  if (url) return <img src={url} alt={book} width={300} height={300} className="rounded shadow-md mb-6" />;
  else return <></>;
}
