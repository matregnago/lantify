import type { DemoFile, NewKill } from "./types.js";

export const createKills = (data: DemoFile, matchId: string) => {
	const kills: NewKill[] = [];
	for (const kill of data.kills) {
		kills.push({
			matchId,
			roundNumber: kill.roundNumber,
			frame: kill.frame,
			tick: kill.tick,
			weaponType: kill.weaponType,
			weaponName: kill.weaponName,
			killerName: kill.killerName,
			killerSteamId: kill.killerSteamId,
			killerSide: kill.killerSide,
			killerTeamName: kill.killerTeamName,
			killerX: kill.killerX,
			killerY: kill.killerY,
			killerZ: kill.killerZ,
			isKillerAirborne: kill.is_killer_airborne,
			isKillerBlinded: kill.is_killer_blinded,
			isKillerControllingBot: kill.isKillerControllingBot,
			victimName: kill.victimName,
			victimSteamId: kill.victimSteamId,
			victimSide: kill.victimSide,
			victimTeamName: kill.victimTeamName,
			victimX: kill.victimX,
			victimY: kill.victimY,
			victimZ: kill.victimZ,
			isVictimAirborne: kill.is_victim_airborne,
			isVictimBlinded: kill.is_victim_blinded,
			isVictimControllingBot: kill.isVictimControllingBot,
			isVictimInspectingWeapon: kill.isVictimInspectingWeapon,
			assisterName: kill.assisterName,
			assisterSteamId: kill.assisterSteamId,
			assisterSide: kill.assisterSide,
			assisterTeamName: kill.assisterTeamName,
			assisterX: kill.assisterX,
			assisterY: kill.assisterY,
			assisterZ: kill.assisterZ,
			isAssisterControllingBot: kill.isAssisterControllingBot,
			isAssistedFlash: kill.isAssistedFlash,
			isHeadshot: kill.isHeadshot,
			penetratedObjects: kill.penetratedObjects,
			isThroughSmoke: kill.isThroughSmoke,
			isNoScope: kill.isNoScope,
			isTradeKill: kill.isTradeKill,
			isTradeDeath: kill.isTradeDeath,
			distance: kill.distance,
		});
	}
	return kills;
};
