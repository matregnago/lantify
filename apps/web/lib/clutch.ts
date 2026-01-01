import { ClutchDTO } from "@repo/contracts";

type PlayerClutches = {
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
};

export function mapPlayerClutches(clutches: ClutchDTO[]): PlayerClutches {
  const playerClutches: PlayerClutches = {
    oneVsOneCount: 0,
    oneVsOneWonCount: 0,
    oneVsOneLostCount: 0,

    oneVsTwoCount: 0,
    oneVsTwoWonCount: 0,
    oneVsTwoLostCount: 0,

    oneVsThreeCount: 0,
    oneVsThreeWonCount: 0,
    oneVsThreeLostCount: 0,

    oneVsFourCount: 0,
    oneVsFourWonCount: 0,
    oneVsFourLostCount: 0,

    oneVsFiveCount: 0,
    oneVsFiveWonCount: 0,
    oneVsFiveLostCount: 0,
  };

  for (const clutch of clutches) {
    switch (clutch.opponentCount) {
      case 1:
        playerClutches.oneVsOneCount++;
        if (clutch.hasWon) {
          playerClutches.oneVsOneWonCount++;
        } else {
          playerClutches.oneVsOneLostCount++;
        }
        break;

      case 2:
        playerClutches.oneVsTwoCount++;
        if (clutch.hasWon) {
          playerClutches.oneVsTwoWonCount++;
        } else {
          playerClutches.oneVsTwoLostCount++;
        }
        break;

      case 3:
        playerClutches.oneVsThreeCount++;
        if (clutch.hasWon) {
          playerClutches.oneVsThreeWonCount++;
        } else {
          playerClutches.oneVsThreeLostCount++;
        }
        break;

      case 4:
        playerClutches.oneVsFourCount++;
        if (clutch.hasWon) {
          playerClutches.oneVsFourWonCount++;
        } else {
          playerClutches.oneVsFourLostCount++;
        }
        break;

      case 5:
        playerClutches.oneVsFiveCount++;
        if (clutch.hasWon) {
          playerClutches.oneVsFiveWonCount++;
        } else {
          playerClutches.oneVsFiveLostCount++;
        }
        break;

      default:
        break;
    }
  }

  return playerClutches;
}
