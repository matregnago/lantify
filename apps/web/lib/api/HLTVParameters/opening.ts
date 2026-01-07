"use server";
import { and, db, eq, gte, lte, ne, sql } from "@repo/database";

export const getOpeningValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const openingParameters = getOpeningParameters(steamId, date);
};

const getOpeningParameters = async (
	steamId?: string,
	date: string = "all",
) => {};
