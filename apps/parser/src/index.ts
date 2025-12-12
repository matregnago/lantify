import "./bootstrap";
import { join } from "node:path";
import {
  analyzeDemo,
  DemoSource,
  ExportFormat,
} from "@akiver/cs-demo-analyzer";
import { readdir } from "node:fs/promises";
import { saveDemoData } from "./save-demo-data.js";

async function main() {
  const demosFolderPath = join(import.meta.dir, "../demos");
  const outputFolderPath = join(import.meta.dir, "../output");
  const files = (await readdir(demosFolderPath)).filter((f) =>
    f.endsWith(".dem")
  );

  for (const file of files) {
    const demoPath = join(demosFolderPath, file);

    const demoName = file.split(".")[0] as string;
    const jsonOutputPath = join(outputFolderPath, `${demoName}.json`);
    await analyzeDemo({
      demoPath,
      outputFolderPath,
      format: ExportFormat.JSON,
      source: DemoSource.MatchZy,
      analyzePositions: false,
      minify: false,
      onStderr: console.error,
      onStdout: console.log,
      onStart: () => {
        console.log(`Iniciando parse da demo ${file}...`);
      },
      onEnd: async () => {
        try {
          console.log(
            `Parse da demo ${file} concluído. Salvando dados no banco...`
          );
          await saveDemoData(jsonOutputPath);
          console.log(`Dados da demo ${file} salvos com sucesso no banco.`);
        } catch (error) {
          console.error(
            `Erro ao salvar dados da demo ${file} no banco:`,
            error
          );
        }
      },
    });
  }
}

main();
