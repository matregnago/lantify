import Link from "next/link";

export function Nav() {
  const buttons = [
    {
      label: "Partidas",
      ref: "/",
    },
    // {
    //   label: "Ranking",
    //   ref: "/ranking",
    // },
  ];

  return (
    <nav className="flex flex-row items-center gap-4 md:gap-8 p-4 border-b ">
      <Link href="/" className="mr-4  text-xl md:text-2xl font-bold">
        Lantify
      </Link>
      <div className="flex flex-row items-center gap-2">
        {buttons.map((b) => (
          <Link
            href={b.ref}
            key={b.ref}
            className="text-muted-foreground hover:text-primary"
          >
            {b.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
