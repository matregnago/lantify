import type { WeaponName, WeaponType } from "@akiver/cs-demo-analyzer";
import type * as schema from "@repo/database/schema";

export type NewMatch = typeof schema.matches.$inferInsert;
export type NewTeam = typeof schema.teams.$inferInsert;
export type NewPlayer = typeof schema.players.$inferInsert;
export type NewDuel = typeof schema.playerDuels.$inferInsert;
export type NewClutch = typeof schema.clutches.$inferInsert;

export type DemoFile = {
	checksum: string;
	date: string;
	mapName: string;
	demoFileName: string;
	teamA: DemoTeam;
	teamB: DemoTeam;
	winner: DemoTeam;
	players: DemoPlayers;
	kills: DemoKill[];
	playersFlashed: DemoFlash[];
	shots: DemoShot[];
	damages: DemoDamage[];
	clutches: DemoClutch[];
};

export type DemoTeam = {
	name: string;
	letter: string;
	score: number;
	scoreFirstHalf: number;
	scoreSecondHalf: number;
	currentSide: number;
};

export interface DemoKill {
	frame: number;
	tick: number;
	roundNumber: number;
	weaponType: WeaponType;
	weaponName: WeaponName;
	killerName: string;
	killerSteamId: string;
	killerSide: number;
	killerTeamName: string;
	killerX: number;
	killerY: number;
	killerZ: number;
	is_killer_airborne: boolean;
	is_killer_blinded: boolean;
	isKillerControllingBot: boolean;
	victimName: string;
	victimSteamId: string;
	victimSide: number;
	victimTeamName: string;
	victimX: number;
	victimY: number;
	victimZ: number;
	is_victim_airborne: boolean;
	is_victim_blinded: boolean;
	isVictimControllingBot: boolean;
	isVictimInspectingWeapon: boolean;
	assisterName?: string;
	assisterSteamId?: string;
	assisterSide?: number;
	assisterTeamName?: string;
	assisterX?: number;
	assisterY?: number;
	assisterZ?: number;
	isAssisterControllingBot?: boolean;
	isAssistedFlash?: boolean;
	isHeadshot: boolean;
	penetratedObjects: number;
	isThroughSmoke: boolean;
	isNoScope: boolean;
	isTradeKill: boolean;
	isTradeDeath: boolean;
	distance: number;
}

export type DemoClutch = {
	frame: number;
	tick: number;
	roundNumber: number;
	opponentCount: number;
	side: number;
	hasWon: boolean;
	clutcherSteamId: string;
	clutcherName: string;
	clutcherSurvived: boolean;
	clutcherKillCount: number;
};

export interface DemoPlayers {
	[steamId: string]: DemoPlayer;
}

export interface DemoPlayer {
	steamId: string;
	userId: number;
	name: string;
	score: number;
	team: DemoTeam;
	mvpCount: number;
	rankType: number;
	rank: number;
	oldRank: number;
	winCount: number;
	crosshairShareCode: string;
	color: number;
	inspectWeaponCount: number;
	killCount: number;
	deathCount: number;
	assistCount: number;
	killDeathRatio: number;
	kast: number;
	bombDefusedCount: number;
	bombPlantedCount: number;
	healthDamage: number;
	armorDamage: number;
	utilityDamage: number;
	headshotCount: number;
	headshotPercent: number;
	oneVsOneCount: number;
	oneVsOneWonCount: number;
	oneVsOneLostCount: number;
	oneVsTwoCount: number;
	oneVsTwoWonCount: number;
	oneVsTwoLostCount: number;
	oneVsThreeCount: number;
	oneVsThreeWonCount: number;
	oneVsThreeLostCount: number;
	oneVsFourCount: number;
	oneVsFourWonCount: number;
	oneVsFourLostCount: number;
	oneVsFiveCount: number;
	oneVsFiveWonCount: number;
	oneVsFiveLostCount: number;
	hostageRescuedCount: number;
	averageKillPerRound: number;
	averageDeathPerRound: number;
	averageDamagePerRound: number;
	utilityDamagePerRound: number;
	firstKillCount: number;
	firstDeathCount: number;
	firstTradeDeathCount: number;
	tradeDeathCount: number;
	tradeKillCount: number;
	firstTradeKillCount: number;
	oneKillCount: number;
	twoKillCount: number;
	threeKillCount: number;
	fourKillCount: number;
	fiveKillCount: number;
	hltvRating: number;
	hltvRating2: number;
}

export interface DemoFlash {
	frame: number;
	tick: number;
	roundNumber: number;
	duration: number;
	flashedSteamId: string;
	flashedName: string;
	flashedSide: number;
	isFlashedControllingBot: boolean;
	flasherSteamId: string;
	flasherName: string;
	flasherSide: number;
	isFlasherControllingBot: boolean;
}

export interface DemoShot {
	frame: number;
	tick: number;
	roundNumber: number;
	weaponName: WeaponName;
	weaponId: string;
	projectileId: number;
	x: number;
	y: number;
	z: number;
	playerName: string;
	playerSteamId: string;
	playerTeamName: string;
	playerSide: number;
	isPlayerControllingBot: boolean;
	playerVelocityX: number;
	playerVelocityY: number;
	playerVelocityZ: number;
	yaw: number;
	pitch: number;
	recoilIndex: number;
	aimPunchAngleX: number;
	aimPunchAngleY: number;
	viewPunchAngleX: number;
	viewPunchAngleY: number;
}

export interface DemoDamage {
	frame: number;
	tick: number;
	roundNumber: number;
	healthDamage: number;
	armorDamage: number;
	attackerSteamId: string;
	attackerSide: number;
	attackerTeamName: string;
	isAttackerControllingBot: boolean;
	victimSteamId: string;
	victimSide: number;
	victimTeamName: string;
	isVictimControllingBot: boolean;
	victimHealth: number;
	victimNewHealth: number;
	victimArmor: number;
	victimNewArmor: number;
	hitgroup: number;
	weaponName: WeaponName;
	weaponType: WeaponType;
	weaponUniqueId: string;
}
