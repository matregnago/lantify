"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Select, SelectTrigger, SelectValue } from "../ui/select";

export const LoadingTable = () => {
  return (
    <Table className="bg-card border">
      <TableHeader>
        <TableRow className="hover:bg-card">
          <TableHead className="w-64 border-r p-0 align-middle">
            <Select disabled>
              <SelectTrigger className="w-full h-full min-h-full border-0 rounded-none px-3 flex items-center">
                <SelectValue placeholder="-" />
              </SelectTrigger>
            </Select>
          </TableHead>

          <TableHead
            className={`text-center w-48 bg-muted/60 transition border-r`}
          >
            -
          </TableHead>

          <TableHead className="text-center w-48 bg-muted/60 transition border-r">
            -
          </TableHead>

          <TableHead className="text-center w-52 bg-muted/60 transition">
            -
          </TableHead>
          <TableHead className="text-center w-52 bg-muted/60 transition ">
            -
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card hover:bg-card font-medium">
          <TableCell className="border-r text-center">VS Opponents</TableCell>
          <TableCell className="text-center border-r">Diff</TableCell>
          <TableCell className="text-center border-r">KD</TableCell>
          <TableCell className="text-center">Kills</TableCell>
          <TableCell className="text-center border-r">Mortes</TableCell>
        </TableRow>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index} className="hover:bg-card">
            <TableCell className="border-r hover:bg-muted/50">
              <div className="flex flex-row gap-3 items-center cursor-pointer w-fit">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={"/default-avatar.png"}
                    width={32}
                    height={32}
                    alt={`default avatar`}
                    className="rounded-full border border-gray-800 shrink-0"
                  />
                  <p>Carregando...</p>
                </div>
              </div>
            </TableCell>
            <TableCell className={`text-center bg-background border-r`}>
              -
            </TableCell>
            <TableCell className="text-center bg-background border-r">
              -
            </TableCell>
            <TableCell className="text-center bg-background">-</TableCell>
            <TableCell className="text-center bg-background">-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
