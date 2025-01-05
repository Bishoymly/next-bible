import getVersions from './getVersions';
import getBooks from './getBooks';
import { getBibleJson } from './getBibleText';
import fs from 'fs';
import path from 'path';

export async function generateSitemapEntries() {
  const entries: { url: string; lastModified: Date }[] = [];
  const versions = getVersions().filter(v => v.id !== 'study' && v.lang);

  console.log(`Processing ${versions.length} versions:`, versions.map(v => v.id).join(', '));

  // Add home page
  entries.push({
    url: '/',
    lastModified: new Date(),
  });

  // Add entries for each version, book, and chapter
  for (const version of versions) {
    console.log(`\nProcessing version: ${version.id} (${version.lang})`);
    
    // Skip versions that don't have a key file
    const keyFile = path.join(process.cwd(), 'public', 'data', `key_${version.lang}.json`);
    if (!fs.existsSync(keyFile)) {
      console.log(`  Skipping version ${version.id}: key file not found at ${keyFile}`);
      continue;
    }

    try {
      const books = getBooks(version.lang);
      console.log(`  Found ${books.length} books for ${version.id}`);
      
      for (const book of books) {
        if (!book || !book.b || !book.slug || !book.n) {
          console.log(`  Skipping invalid book entry:`, book);
          continue;
        }

        try {
          // Check if the Bible data file exists (using .usfm extension)
          const bibleFile = path.join(process.cwd(), 'public', 'data', version.id, `${book.b}.usfm`);
          if (!fs.existsSync(bibleFile)) {
            console.log(`  Skipping book ${book.n} (${book.b}) for version ${version.id}: file not found at ${bibleFile}`);
            continue;
          }

          try {
            const bibleData = getBibleJson(book.b, version.id);
            if (!bibleData?.chapters) {
              console.log(`  Skipping book ${book.n} for version ${version.id}: invalid data format`);
              continue;
            }

            const chapterCount = Object.keys(bibleData.chapters).length;
            console.log(`  Adding ${chapterCount} chapters for ${book.n} (${version.id})`);
            
            for (let chapter = 1; chapter <= chapterCount; chapter++) {
              entries.push({
                url: `/${version.id}/${book.slug}/${chapter}`,
                lastModified: new Date(),
              });
            }
          } catch (error) {
            console.log(`  Error parsing USFM data for ${book.n} (${version.id}):`, error);
            continue;
          }
        } catch (error) {
          console.log(`  Error processing ${book.n} for version ${version.id}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.log(`Error processing version ${version.id}:`, error);
      continue;
    }
  }

  console.log(`\nGenerated sitemap with ${entries.length} entries`);
  return entries;
} 