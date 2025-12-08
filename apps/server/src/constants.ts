type SteamPlayer = {
  personaname: string;
  avatarfull: string;
  steamid: string;
};

export type SteamApiResponse = {
  response: {
    players: SteamPlayer[];
  };
};
