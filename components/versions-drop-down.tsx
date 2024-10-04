import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function versionsDropDown(versions: any, version: any, book: any, chapter: any, version2: any, side: boolean = false) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className={inter.className}>
          {side ? version2.toUpperCase() : version.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
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
            <DropdownMenuLabel className="font-normal text-muted-foreground">{lang}</DropdownMenuLabel>
            {versions.map((v) => (
              <Link
                href={book === null ? `/${v.id}` : chapter === null ? `/${v.id}/${book}` : side ? `/${version}/${book}/${chapter}?side=${v.id}` : `/${v.id}/${book}/${chapter}?side=${version2}`}
                key={v.id}
              >
                <DropdownMenuItem>
                  <b>{v.id.toUpperCase()}</b>&nbsp;{v.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
