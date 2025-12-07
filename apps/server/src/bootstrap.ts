import { config } from "dotenv";
import { join } from "node:path";

config({
  path: join(import.meta.dir, "../../../.env"),
});
