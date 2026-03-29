import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function versionsDropDown(versions: any, version: any, book: any, chapter: any, version2: any, side: boolean = false) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full px-4 font-label text-[0.9rem] tracking-[0.22em] uppercase">
          {side ? version2.toUpperCase() : version.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-[1.25rem] border border-border bg-popover/95 p-2 backdrop-blur">
        {Object.entries(
          versions
            .filter((v) => (!side ? v.id != "study" : true))
            .reduce((acc, version) => {
              const lang = version.lang || "Other";
              if (!acc[lang]) acc[lang] = [];
              acc[lang].push(version);
              return acc;
            }, {})
        ).map(([lang, versions]: [string, any[]]) => (
          <DropdownMenuGroup key={lang}>
            <DropdownMenuLabel className="font-label text-[0.8rem] font-normal tracking-[0.22em] text-muted-foreground uppercase">{lang}</DropdownMenuLabel>
            {versions.map((v) => (
              <Link
                href={book === null ? `/${v.id}` : chapter === null ? `/${v.id}/${book}` : side ? `/${version}/${book}/${chapter}?side=${v.id}` : `/${v.id}/${book}/${chapter}?side=${version2}`}
                key={v.id}
              >
                <DropdownMenuItem className="rounded-xl px-3 py-3">
                  <span className="mr-2 font-label text-[0.82rem] tracking-[0.18em] uppercase text-accent">{v.id}</span>
                  <span className="text-base">{v.name}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
