import "./bootstrap";
import { getMatchData, listMatches } from "./match.js";
import { profilePage } from "./player-profile.js";

async function main() {
  const server = Bun.serve({
    routes: {
      "/matches": listMatches,
      "/matches/:id": getMatchData,
      "/profile/:id": profilePage,
      "/": () => new Response("API Working!"),
    },

    port: 3333,
  });
  console.log(`API running on ${server.url}`);
}

main();
