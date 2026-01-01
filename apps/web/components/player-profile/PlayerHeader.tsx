import Image from "next/image";
import { RankingPosition } from "../ranking/RankingPosition";
import { getRankingPosByStat } from "@/lib/ranking";
import { PlayerRankingDTO, PlayerProfileDTO } from "@repo/contracts";
import { PlayerTag, getPlayerTags } from "../ranking/PlayerTag";

interface PlayerHeaderProps {
  profile: PlayerProfileDTO;
  playersRanking: PlayerRankingDTO[];
}

export const PlayerHeader = ({
  profile,
  playersRanking,
}: PlayerHeaderProps) => {
  const ratingRankPosition = getRankingPosByStat(
    profile.steamId,
    playersRanking,
    "rating2",
  );
  const tags = getPlayerTags(profile.stats, playersRanking, 3);

  return (
    <div
      className="border-b shadow-lg rounded-lg mb-8 py-8 px-8 flex flex-row items-center md:justify-start justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 28%, rgba(0, 0, 0, 0.7) 100%), url(/profile-header-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-3 border w-52 min-h-72 py-4 justify-center rounded-xl bg-card relative z-3">
        <Image
          className="rounded-full border-2 border-accent"
          src={profile.avatarUrl || "/default-avatar.png"}
          width={140}
          height={140}
          alt={`${profile.nickName} avatar pfp`}
        />
        <p className="text-base font-semibold">{profile.nickName}</p>
        <RankingPosition position={ratingRankPosition} />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center px-2 mt-1">
            {tags.map((tag) => (
              <PlayerTag key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
