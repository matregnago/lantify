import Image from "next/image";
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
		{
			label: "Duelos",
			ref: "/duels",
		},
		// {
		//   label: "Estatísticas",
		//   ref: "/stats",
		// }
	];

	return (
		<nav className="flex flex-row items-center gap-4 md:gap-8 p-4 border-b sticky top-0 bg-background z-10">
			<Link
				href="/"
				className="mr-4  text-xl md:text-2xl font-bold flex flex-row gap-2 items-center"
			>
				<Image
					width={50}
					height={50}
					src="/rizzi-careca.png"
					alt="rizzi careca"
				/>
				Lantify
			</Link>
			<div className="flex flex-row items-center gap-8">
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
