import type { DemoFile, NewDamage } from "./types.js";

export const createDamages = (data: DemoFile, matchId: string) => {
	const damages: NewDamage[] = [];

	for (const damage of data.damages) {
		damages.push({
			matchId,

			tick: damage.tick,
			roundNumber: damage.roundNumber,

			healthDamage: damage.healthDamage,
			armorDamage: damage.armorDamage,

			attackerSteamId: damage.attackerSteamId,
			attackerSide: damage.attackerSide,
			attackerTeamName: damage.attackerTeamName,
			isAttackerControllingBot: damage.isAttackerControllingBot,

			victimSteamId: damage.victimSteamId,
			victimSide: damage.victimSide,
			victimTeamName: damage.victimTeamName,
			isVictimControllingBot: damage.isVictimControllingBot,

			victimHealth: damage.victimHealth,
			victimNewHealth: damage.victimNewHealth,
			victimArmor: damage.victimArmor,
			victimNewArmor: damage.victimNewArmor,

			hitgroup: damage.hitgroup,

			weaponName: damage.weaponName,
			weaponType: damage.weaponType,
			weaponUniqueId: damage.weaponUniqueId,
		});
	}

	return damages;
};
