import "server-only";

import { NextRequest } from "next/server";
import { headers } from 'next/headers';

export const getClientIp = async (req?: NextRequest) => {
    let headerList = req?.headers || await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    return ip;
}
