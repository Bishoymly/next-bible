# Scripture foundation

`npm run data:build` reads only the bundled USFM files and writes deterministic normalized chapter and search artifacts under `public/generated/scripture`. Each translation has 66 books and 1,189 chapters. Search indexes contain exact plain verse text with version, book, slug, chapter, and verse metadata.

`npm run data:verify` rejects missing verse text, incomplete canons, missing search entries, and unsafe source metadata.

Translation provenance is recorded in `public/data/sources.json`. BSB source and license information are at the Berean Bible licensing and downloads pages. ASV, KJV, and AVD provenance is supplied by the linked eBible.org records. The bundled KJV copyright notice includes the UK printing-right caveat, which is reflected in the metadata.

Offline study is separate from application builds. `npm run study:build -- bsb genesis 1` requires `OPENAI_API_KEY`, passes the complete normalized chapter text to `gpt-5.6-terra` with medium reasoning, validates the response, and writes a static artifact. Runtime code never calls a model or KV.

Legacy Ask imports are explicit. `npm run legacy:import` downloads the legacy sitemap and writes `public/generated/legacy/manifest.json`; it is not run by `next build`. Legacy domains must be attached to the deployment for host redirects in `next.config.mjs` to activate.
