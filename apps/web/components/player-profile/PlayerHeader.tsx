import Image from "next/image";

interface PlayerHeaderProps {
  avatarUrl: string;
  nickName: string;
}

export const PlayerHeader = ({ avatarUrl, nickName }: PlayerHeaderProps) => {
  return (
    <div
      className="border-b shadow-lg rounded-lg my-8 py-8 px-8 flex flex-row items-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 28%, rgba(0, 0, 0, 0.7) 100%), url(/profile-header-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-4 border w-52 h-72 justify-center rounded-xl bg-card relative z-20">
        <Image
          className="rounded-full border-2 border-accent"
          src={avatarUrl}
          width={140}
          height={140}
          alt={`${nickName} avatar pfp`}
        />
        <p className="text-base font-semibold">{nickName}</p>
      </div>
    </div>
  );
};
