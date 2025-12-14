import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-[760px]">
      <Image
        width={40}
        height={40}
        src={"/loading.gif"}
        alt="Loading"
        unoptimized
        className=""
      />
    </div>
  );
}
