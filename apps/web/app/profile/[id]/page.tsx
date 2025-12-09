"use server";

import { PlayerProfile } from "@/components/player-profile/PlayerProfile";
import { PlayerProfileDTO } from "@repo/contracts";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileReq = await fetch(`http://localhost:3333/profile/${id}`, {
    cache: "force-cache",
  });
  const profileData: PlayerProfileDTO = await profileReq.json();

  return <PlayerProfile profile={profileData} />;
}
