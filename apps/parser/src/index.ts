import "./bootstrap";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
	analyzeDemo,
	DemoSource,
	ExportFormat,
} from "@akiver/cs-demo-analyzer";
import { saveDemoData } from "./save-demo-data.js";

async function main() {
	const { values } = parseArgs({
		args: Bun.argv,
		options: {
			"skip-demo-parse": {
				type: "boolean",
			},
		},
		strict: true,
		allowPositionals: true,
	});
	const demosFolderPath = join(import.meta.dir, "../demos");
	const outputFolderPath = join(import.meta.dir, "../output");

	if (!values["skip-demo-parse"]) {
		const files = (await readdir(demosFolderPath)).filter((f) =>
			f.endsWith(".dem"),
		);
		const dataPromises = [];
		for (const file of files) {
			const demoPath = join(demosFolderPath, file);

			const demoName = file.split(".")[0] as string;
			const jsonOutputPath = join(outputFolderPath, `${demoName}.json`);
			dataPromises.push(
				analyzeDemo({
					demoPath,
					outputFolderPath,
					format: ExportFormat.JSON,
					source: DemoSource.MatchZy,
					analyzePositions: false,
					minify: false,
					onStderr: console.error,
					onStdout: console.log,
					onStart: () => {
						console.log(`Fazendo o parse da demo ${file}...`);
					},
					onEnd: async () => {
						try {
							console.log(
								`Parse da demo ${file} concluído. Salvando dados no banco...`,
							);
							await saveDemoData(jsonOutputPath);
						} catch (error) {
							console.error(
								`Erro ao salvar dados da demo ${file} no banco:`,
								error,
							);
						}
					},
				}),
			);
		}
		try {
			await Promise.all(dataPromises);
		} catch (error) {
			console.error("Erro ao processar as demos:", error);
		}
	} else {
		const outputFolderPath = join(import.meta.dir, "../output");
		const files = (await readdir(outputFolderPath)).filter((f) =>
			f.endsWith(".json"),
		);
		const dataPromises = [];
		for (const file of files) {
			const jsonPath = join(outputFolderPath, file);
			dataPromises.push(saveDemoData(jsonPath));
		}
		try {
			await Promise.all(dataPromises);
		} catch (error) {
			console.error("Erro ao salvar os dados no banco:", error);
		}
	}
}

main();
