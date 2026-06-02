import { withRateLimit } from "@/lib/rateLimit";
import { createOAuthClient } from "@/lib/google";
import { redis } from "@/lib/redis";

import { google } from "googleapis";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

async function getHandler(req: Request) {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
        return Response.redirect(
            `${process.env.APP_URL}/emails?status=oauth_cancelled`
        );
    }

    if (!code || !state) {
        return Response.json(
            { error: "Missing code or state" },
            { status: 400 }
        );
    }

    const key = await redis.get(`oauth:${state}`);
    const userId = parseInt(key as string);

    if (!userId) {
        return Response.json(
            { error: "Invalid state" },
            { status: 400 }
        );
    }

    await redis.del(`oauth:${state}`);

    const oauth2Client = createOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
        return Response.json(
            { error: "No refresh token received from Google" },
            { status: 400 }
        );
    }

    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client,
    });

    const profile =
        await gmail.users.getProfile({
            userId: "me",
        });

    const gmailAddress = profile.data.emailAddress;

    if (!gmailAddress) {
        throw new Error(
            "Unable to fetch Gmail address"
        );
    }
    // Add to DB

    await prisma.emailConfig.upsert({
        where: {
            userId_email: {
                userId: userId,
                email: gmailAddress,
            },
        },

        update: {
            accessToken: tokens.access_token
                ? encrypt(tokens.access_token)
                : undefined,

            refreshToken: encrypt(tokens.refresh_token),

            expiryDate: tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : null,

            status: "ACTIVE",
        },

        create: {
            userId,
            email: gmailAddress,

            provider: "GMAIL",

            accessToken: tokens.access_token
                ? encrypt(tokens.access_token)
                : null,

            refreshToken: encrypt(tokens.refresh_token),

            expiryDate: tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : null,

            status: "ACTIVE",
        },
    });



    return Response.redirect(`${process.env.APP_URL}/emails?status=connected`);
}

export const GET = withRateLimit(getHandler);