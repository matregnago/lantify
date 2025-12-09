"use server";

import { PlayerProfile } from "@/components/player-profile/PlayerProfile";
import { getPlayerProfileData } from "@/lib/api/player";
import { PlayerProfileDTO } from "@repo/contracts";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileData = await getPlayerProfileData(id);

  if(!profileData) {
    notFound();
  }

  return <PlayerProfile profile={profileData} />;
}
