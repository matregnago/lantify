import { WeaponName } from "@akiver/cs-demo-analyzer";
import type { DemoFile, DemoPlayer, NewPlayer } from "./types.js";

type PlayerStats = {
	totalFlashes: number;
	totalSmokes: number;
	totalMolotovs: number;
	totalHes: number;
	flashAssists: number;
	enemiesFlashed: number;
	friendsFlashed: number;
	selfFlashed: number;
	enemiesBlindTime: number;
	friendsBlindTime: number;
	selfBlindTime: number;
	heDamage: number;
	heTeamDamage: number;
};

const getOrCreatePlayerStats = (
	steamId: string,
	playerStatsMap: Map<string, PlayerStats>,
): PlayerStats => {
	let stats = playerStatsMap.get(steamId);
	if (!stats) {
		stats = {
			totalFlashes: 0,
			totalHes: 0,
			totalMolotovs: 0,
			totalSmokes: 0,
			enemiesBlindTime: 0,
			friendsBlindTime: 0,
			enemiesFlashed: 0,
			flashAssists: 0,
			friendsFlashed: 0,
			selfBlindTime: 0,
			selfFlashed: 0,
			heDamage: 0,
			heTeamDamage: 0,
		};
		playerStatsMap.set(steamId, stats);
	}
	return stats;
};

export const calculateAggregatedStats = (data: DemoFile) => {
	const playerStatsMap = new Map<string, PlayerStats>();

	for (const shot of data.shots) {
		const playerStats = getOrCreatePlayerStats(
			shot.playerSteamId,
			playerStatsMap,
		);
		switch (shot.weaponName) {
			case WeaponName.Smoke:
				playerStats.totalSmokes += 1;
				break;
			case WeaponName.Flashbang:
				playerStats.totalFlashes += 1;
				break;
			case WeaponName.Molotov:
				playerStats.totalMolotovs += 1;
				break;
			case WeaponName.Incendiary:
				playerStats.totalMolotovs += 1;
				break;
			case WeaponName.HEGrenade:
				playerStats.totalHes += 1;
				break;
		}
	}

	for (const flash of data.playersFlashed) {
		const playerStats = getOrCreatePlayerStats(
			flash.flasherSteamId,
			playerStatsMap,
		);

		if (flash.flasherSide === flash.flashedSide) {
			// Se bangou
			if (flash.flashedSteamId === flash.flasherSteamId) {
				playerStats.selfFlashed++;
				playerStats.selfBlindTime += flash.duration;
			}
			// Bangou amigo
			else {
				playerStats.friendsFlashed++;
				playerStats.friendsBlindTime += flash.duration;
			}
			// Bangou o inimigo
		} else {
			playerStats.enemiesFlashed++;
			playerStats.enemiesBlindTime += flash.duration;
		}
	}

	for (const damage of data.damages) {
		const playerStats = getOrCreatePlayerStats(
			damage.attackerSteamId,
			playerStatsMap,
		);
		if (damage.weaponName === WeaponName.HEGrenade) {
			if (damage.attackerSide !== damage.victimSide) {
				playerStats.heDamage += damage.healthDamage;
			}
			// HE no amigo
			else if (damage.attackerSteamId !== damage.victimSteamId) {
				playerStats.heTeamDamage += damage.healthDamage;
			}
		}
	}

	for (const kill of data.kills) {
		if (kill.assisterSteamId) {
			const playerStats = getOrCreatePlayerStats(
				kill.assisterSteamId,
				playerStatsMap,
			);
			if (kill.isAssistedFlash) {
				playerStats.flashAssists++;
			}
		}
	}

	const newPlayerMap = new Map<string, NewPlayer>();
	Object.entries(data.players).forEach(
		([steamId, player]: [string, DemoPlayer]) => {
			const playerStats = getOrCreatePlayerStats(steamId, playerStatsMap);
			const newPlayerData = {
				steamId,
				name: player.name,
				score: player.score,
				mvpCount: player.mvpCount,
				winCount: player.winCount,
				crosshairShareCode: player.crosshairShareCode,
				color: player.color,
				killCount: player.killCount,
				deathCount: player.deathCount,
				assistCount: player.assistCount,
				killDeathRatio: player.killDeathRatio,
				kast: player.kast,
				bombDefusedCount: player.bombDefusedCount,
				bombPlantedCount: player.bombPlantedCount,
				healthDamage: player.healthDamage,
				armorDamage: player.armorDamage,
				utilityDamage: player.utilityDamage,
				headshotCount: player.headshotCount,
				headshotPercent: player.headshotPercent,
				hostageRescuedCount: player.hostageRescuedCount,
				averageKillPerRound: player.averageKillPerRound,
				averageDeathPerRound: player.averageDeathPerRound,
				averageDamagePerRound: player.averageDamagePerRound,
				utilityDamagePerRound: player.utilityDamagePerRound,
				firstKillCount: player.firstKillCount,
				firstDeathCount: player.firstDeathCount,
				firstTradeDeathCount: player.firstTradeDeathCount,
				tradeDeathCount: player.tradeDeathCount,
				tradeKillCount: player.tradeKillCount,
				firstTradeKillCount: player.firstTradeKillCount,
				oneKillCount: player.oneKillCount,
				twoKillCount: player.twoKillCount,
				threeKillCount: player.threeKillCount,
				fourKillCount: player.fourKillCount,
				fiveKillCount: player.fiveKillCount,
				hltvRating: player.hltvRating,
				hltvRating2: player.hltvRating2,
				enemiesBlindTime: playerStats.enemiesBlindTime,
				enemiesFlashed: playerStats.enemiesFlashed,
				selfFlashed: playerStats.selfFlashed,
				selfBlindTime: playerStats.selfBlindTime,
				friendsFlashed: playerStats.friendsFlashed,
				friendsBlindTime: playerStats.friendsBlindTime,
				flashAssists: playerStats.flashAssists,
				heDamage: playerStats.heDamage,
				heTeamDamage: playerStats.heTeamDamage,
				totalFlashes: playerStats.totalFlashes,
				totalHes: playerStats.totalHes,
				totalMolotovs: playerStats.totalMolotovs,
				totalSmokes: playerStats.totalSmokes,
			};
			newPlayerMap.set(steamId, newPlayerData);
		},
	);
	return newPlayerMap;
};
