import { useMemo, useState } from "react";
import {
  BookmarkIcon,
  CardStackIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsVerticalIcon,
  FileTextIcon,
  FontStyleIcon,
  GearIcon,
  Link2Icon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  MixIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  ReaderIcon,
  SpeakerLoudIcon,
  SunIcon,
} from "@radix-ui/react-icons";

const navItems = [
  ["read", "Read", ReaderIcon],
  ["compare", "Compare", MixIcon],
  ["study", "Study", CardStackIcon],
  ["notes", "Notes", Pencil1Icon],
  ["bookmarks", "Bookmarks", BookmarkIcon],
];

const chapters = [
  "The Creation of the World", "The Seventh Day", "The Fall", "Cain and Abel",
  "The Genealogy of Adam", "The Sons of God", "The Flood", "The Covenant",
  "Noah and the Covenant", "The Nations", "The Tower of Babel", "Abram Called",
  "Abram in Egypt", "Abram Rescues Lot", "The Covenant Confirmed",
];

const genesisSections = [
  [null, [
    "In the beginning God created the heavens and the earth.",
    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
  ]],
  ["The First Day", [
    "Then God said, “Let there be light,” and there was light.",
    "God saw that the light was good, and He separated the light from the darkness.",
    "God called the light “day,” and the darkness He called “night.” And there was evening, and there was morning—the first day.",
  ]],
  ["The Second Day", [
    "Then God said, “Let there be an expanse between the waters, to separate water from water.”",
    "So God made the expanse and separated the water beneath it from the water above. And it was so.",
    "God called the expanse “sky.” And there was evening, and there was morning—the second day.",
  ]],
  ["The Third Day", [
    "Then God said, “Let the water under the sky be gathered to one place, and let the dry ground appear.” And it was so.",
    "God called the dry ground “land,” and the gathered waters He called “seas.” And God saw that it was good.",
  ]],
];

const passages = {
  "john 1": {
    book: "John", chapter: 1, subtitle: "The Beginning",
    verses: [
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
      "He was with God in the beginning.",
      "Through Him all things were made, and without Him nothing was made that has been made.",
      "In Him was life, and that life was the light of men.",
      "The Light shines in the darkness, and the darkness has not overcome it.",
    ],
  },
  "psalm 23": {
    book: "Psalm", chapter: 23, subtitle: "The Lord Is My Shepherd",
    verses: [
      "The LORD is my shepherd; I shall not want.",
      "He makes me lie down in green pastures; He leads me beside quiet waters.",
      "He restores my soul; He guides me in the paths of righteousness for the sake of His name.",
      "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me.",
    ],
  },
};

function PrimaryNav({ mode, setMode }) {
  return (
    <nav className="primary-nav" aria-label="Bible tools">
      <div className="nav-stack">
        {navItems.map(([id, label, Icon]) => (
          <button key={id} className={`nav-button ${mode === id ? "active" : ""}`} onClick={() => setMode(id)} aria-pressed={mode === id} title={label}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </div>
      <button className="nav-button settings" title="Settings"><GearIcon /><span>Settings</span></button>
    </nav>
  );
}

function StudyPanel({ mode, reference, question, setQuestion, askQuestion }) {
  const anchorReference = reference.replace(/:1–\d+$/, ":1–2");
  if (mode === "compare") {
    return (
      <aside className="study-panel">
        <div className="panel-heading"><h2>Compare translations</h2><MixIcon /></div>
        <div className="translation-block"><span>BSB</span><p>In the beginning God created the heavens and the earth.</p></div>
        <div className="translation-block"><span>ASV</span><p>In the beginning God created the heavens and the earth.</p></div>
        <div className="translation-block"><span>KJV</span><p>In the beginning God created the heaven and the earth.</p></div>
        <p className="source-note">Differences are highlighted when wording changes meaning or emphasis.</p>
      </aside>
    );
  }

  if (mode === "notes") {
    return (
      <aside className="study-panel">
        <div className="panel-heading"><h2>Notes on {reference}</h2><Pencil1Icon /></div>
        <textarea className="notes-area" defaultValue="Creation begins with God—not with chaos, chance, or human effort." aria-label="Passage notes" />
        <button className="primary-button"><CheckIcon /> Save note</button>
        <p className="source-note">Prototype only—notes remain in this browser session.</p>
      </aside>
    );
  }

  if (mode === "bookmarks") {
    return (
      <aside className="study-panel">
        <div className="panel-heading"><h2>Bookmarks</h2><BookmarkIcon /></div>
        {["Genesis 1:1–2", "Psalm 23:1–4", "John 1:1–5"].map((item) => (
          <button className="bookmark-row" key={item}><BookmarkIcon /><span>{item}</span><ChevronRightIcon /></button>
        ))}
      </aside>
    );
  }

  return (
    <aside className="study-panel">
      <div className="panel-heading"><h2>Study this passage</h2><MagicWandIcon /></div>
      <section className="insight-section">
        <h3><ReaderIcon /> Insight</h3>
        <p><strong>{anchorReference}</strong> establishes God as the sovereign Creator. “In the beginning” signals the start of all time, while the chaos of the earth highlights the transformation God brings through His word and Spirit.</p>
      </section>
      <section className="references-section">
        <h3><Link2Icon /> Scripture references</h3>
        <a href="#colossians"><span><u>Colossians 1:16–17</u><small>For by Him all things were created, in heaven and on earth, visible and invisible…</small></span><ChevronRightIcon /></a>
        <a href="#psalm"><span><u>Psalm 33:6, 9</u><small>By the word of the LORD the heavens were made… For He spoke, and it came to be.</small></span><ChevronRightIcon /></a>
      </section>
      <form className="ask-form" onSubmit={(event) => { event.preventDefault(); askQuestion(question); }}>
        <label htmlFor="passage-question">Ask about this passage</label>
        <div className="ask-control">
          <input id="passage-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={`Ask about ${reference.split(":")[0]}`} />
          <button type="submit" aria-label="Ask question"><PaperPlaneIcon /></button>
        </div>
        <small>Answers are generated from Scripture. Verify important details.</small>
      </form>
    </aside>
  );
}

export function App() {
  const [mode, setMode] = useState("read");
  const [translation, setTranslation] = useState("BSB");
  const [theme, setTheme] = useState("light");
  const [activeChapter, setActiveChapter] = useState(1);
  const [passage, setPassage] = useState({ book: "Genesis", chapter: 1, subtitle: "The Creation of the World" });
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [toast, setToast] = useState("");

  const content = useMemo(() => passages[`${passage.book.toLowerCase()} ${passage.chapter}`], [passage]);
  const verseCount = passage.book === "Genesis" ? 10 : (content?.verses.length || 5);
  const reference = `${passage.book} ${passage.chapter}:1–${verseCount}`;

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function submitSearch(value) {
    const normalized = value.trim().toLowerCase().replace(/:.*/, "");
    if (passages[normalized]) {
      setPassage(passages[normalized]);
      setActiveChapter(passages[normalized].chapter);
      setMode("read");
      notify(`Opened ${passages[normalized].book} ${passages[normalized].chapter}`);
    } else if (normalized === "genesis 1" || normalized === "genesis") {
      setPassage({ book: "Genesis", chapter: 1, subtitle: chapters[0] });
      setActiveChapter(1);
    } else if (value.trim()) {
      setQuestion(value.trim());
      setMode("study");
      notify("Question added to the grounded study panel");
    }
    setSearchOpen(false);
  }

  function askQuestion(value) {
    if (!value.trim()) return;
    notify("Grounded answer ready with 2 Scripture references");
    setQuestion("");
  }

  return (
    <div className="bible-app" data-theme={theme}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Bible home">Bible</a>
        <form className="global-search" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }} onSubmit={(event) => { event.preventDefault(); submitSearch(search); }}>
          <MagnifyingGlassIcon />
          <input value={search} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); if (event.key === "Enter") { event.preventDefault(); submitSearch(search); } }} onFocus={() => setSearchOpen(true)} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }} placeholder="Go to a passage, search Scripture, or ask a question" aria-label="Search or ask" />
          <kbd>⌘ K</kbd>
          {searchOpen && (
            <div className="search-popover">
              <button type="button" onClick={() => submitSearch("John 1")}><ReaderIcon /><span><strong>John 1</strong><small>Open a passage</small></span></button>
              <button type="button" onClick={() => submitSearch("Psalm 23")}><MagnifyingGlassIcon /><span><strong>Psalm 23</strong><small>Open a passage</small></span></button>
              {search.trim() && <button type="button" onClick={() => submitSearch(search)}><MagicWandIcon /><span><strong>Ask about “{search}”</strong><small>Study with Scripture references</small></span></button>}
            </div>
          )}
        </form>
        <div className="topbar-actions">
          <select value={translation} onChange={(event) => setTranslation(event.target.value)} aria-label="Translation">
            <option>BSB</option><option>ASV</option><option>KJV</option>
          </select>
          <button className="theme-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}><SunIcon /><span>{theme === "light" ? "Light" : "Dark"}</span><ChevronRightIcon /></button>
        </div>
      </header>

      <div className="workspace">
        <PrimaryNav mode={mode} setMode={setMode} />

        <aside className="chapter-rail">
          <div className="rail-title"><ChevronLeftIcon /><h2>{passage.book}</h2></div>
          <button className="overview-button">Book overview <ChevronRightIcon /></button>
          <p className="rail-label">Chapters</p>
          <div className="chapter-list">
            {chapters.map((name, index) => (
              <button className={passage.book === "Genesis" && activeChapter === index + 1 ? "active" : ""} key={name} onClick={() => { setActiveChapter(index + 1); setPassage({ book: "Genesis", chapter: index + 1, subtitle: name }); notify(`Opened Genesis ${index + 1}`); }}>
                <span>{index + 1}</span><small>{name}</small>
              </button>
            ))}
          </div>
          <button className="show-more">Show more <ChevronRightIcon /></button>
        </aside>

        <main className="reader" id="top">
          <div className="reader-heading">
            <div><h1>{passage.book} {passage.chapter}</h1><p>{passage.subtitle}</p></div>
            <div className="reader-tools"><button aria-label="Listen" onClick={() => notify("Audio playback is ready for connection")}><SpeakerLoudIcon /></button><button aria-label="Text settings"><FontStyleIcon /></button><button aria-label="More options"><DotsVerticalIcon /></button></div>
          </div>

          {content ? (
            <section className="scripture simple-verses">
              {content.verses.map((verse, index) => <p key={verse}><sup>{index + 1}</sup>{verse}</p>)}
            </section>
          ) : passage.chapter === 1 ? (
            <section className="scripture">
              {genesisSections.map(([title, verses], sectionIndex) => (
                <div className="passage-section" key={title || "opening"}>
                  {title && <h2>{title}</h2>}
                  <p>{verses.map((verse, index) => { const number = genesisSections.slice(0, sectionIndex).reduce((total, section) => total + section[1].length, 0) + index + 1; return <span className="verse" key={verse}><sup>{number}</sup>{verse}{" "}</span>; })}</p>
                </div>
              ))}
            </section>
          ) : (
            <section className="empty-chapter"><FileTextIcon /><h2>{passage.subtitle}</h2><p>This prototype focuses on the unified reading and study flow. Full chapter text will connect to the Bible data source.</p></section>
          )}
        </main>

        <StudyPanel mode={mode} reference={reference} question={question} setQuestion={setQuestion} askQuestion={askQuestion} />
      </div>
      {toast && <div className="toast" role="status"><CheckIcon />{toast}</div>}
    </div>
  );
}
