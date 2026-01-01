"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
	return (
		<div>
			<h2>Something went wrong!</h2>
			<Button onClick={() => reset()}>Try again</Button>
		</div>
	);
}
