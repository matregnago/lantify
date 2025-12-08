import * as s from "@repo/database/schema";

export type PlayerDTO = typeof s.players.$inferSelect & {
  avatarUrl: string;
  steamNickname: string;
};

export type TeamDTO = typeof s.teams.$inferSelect & {
  players?: PlayerDTO[];
};

export type MatchDTO = typeof s.matches.$inferSelect & {
  teams: TeamDTO[];
};
