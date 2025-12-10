import { PlayerProfileDTO } from "@repo/contracts";
import { Field } from "./Field";
import { MatchHistoryTable } from "./MatchHistoryTable";

export const MatchHistoryStats = ({
  profile,
}: {
  profile: PlayerProfileDTO;
}) => {
  return (
    <Field title="Histórico de Partidas">
      <MatchHistoryTable playerMatchHistory={profile.matchHistory || []} />
    </Field>
  );
};
