import crypto from "crypto";
import { withRateLimit } from "@/_lib/rateLimit";
import { createOAuthClient } from "@/_lib/google";
import { redis } from "@/_lib/redis";
import { verifySession } from "@/_lib/authSession";

async function getHandler() {
    console.log("CAlled Callbakc")

    const { userId, isAuth } = await verifySession();

    if (!isAuth || !userId) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const state = crypto.randomBytes(32).toString("hex");

    const key = `oauth:${state}`;
    const value = userId;

    await redis.set(key, value, {
      expiration: { type: 'EX', value: 10 * 60 } // seconds
    });

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
    
    console.log("CALLBACK: ",url)

    return Response.redirect(url);
}

export const GET = withRateLimit(getHandler);