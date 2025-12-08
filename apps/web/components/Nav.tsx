import Link from "next/link";
import { Button } from "./ui/button";

export function Nav() {
  const buttons = [
    {
      label: "Ranking",
      ref: "/ranking",
    },
  ];

  return (
    <nav className="flex flex-row items-center justify-between p-4 border-b">
      <p>LANTIFY</p>
      {buttons.map((b) => (
        <Link href={b.ref} key={b.ref}>
          <Button>{b.label}</Button>
        </Link>
      ))}
    </nav>
  );
}
