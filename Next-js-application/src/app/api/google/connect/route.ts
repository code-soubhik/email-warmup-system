import { withRateLimit } from "@/_lib/rateLimit";
import { createOAuthClient } from "@/_lib/google";
import { redis } from "@/_lib/redis";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
    const state =
        request.nextUrl.searchParams.get("state");

    if (!state) {
        return Response.json(
            { error: "Malformed URL" },
            { status: 400 }
        );
    }

    const invitation = await redis.get(
        `oauth:${state}`
    );

    if (!invitation) {
        return Response.json(
            { error: "Invalid or expired invitation" },
            { status: 400 }
        );
    }

    const oauth2Client = createOAuthClient();

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        state,
        scope: [
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.readonly",
        ],
    });

    return Response.redirect(url);
}

export const GET = withRateLimit(getHandler);