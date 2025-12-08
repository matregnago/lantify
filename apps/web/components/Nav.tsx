import Link from "next/link";

export function Nav() {
  const buttons = [
    {
      label: "Partidas",
      ref: "/",
    },
    {
      label: "Ranking",
      ref: "/ranking",
    },
  ];

  return (
    <nav className="flex flex-row items-center gap-8 p-4 border-b">
      <Link href="/" className="mr-4 text-xl font-bold">
        Lantify
      </Link>
      {buttons.map((b) => (
        <Link
          href={b.ref}
          key={b.ref}
          className="text-muted-foreground hover:text-primary max-md:hidden"
        >
          {b.label}
        </Link>
      ))}
    </nav>
  );
}
