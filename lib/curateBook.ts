export default async function curateBook(language: string, book: string) {
  const Arabic = language === "Arabic";
  return {
    overviewParagraphs: [Arabic ? `تتوفر الدراسة الإرشادية لفصل من ${book} في صفحة الدراسة.` : `Guided study for each chapter of ${book} is available on the study page.`],
    sections: [],
  };
}
