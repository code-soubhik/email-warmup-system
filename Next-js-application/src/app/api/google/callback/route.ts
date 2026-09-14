import { withRateLimit } from "@/_lib/rateLimit";
import { createOAuthClient } from "@/_lib/google";
import { redis } from "@/_lib/redis";
import { encrypt, decrypt } from "@/_lib/crypto";

import { google } from "googleapis";
import prisma from "@/_lib/prisma";

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

    const key = `oauth:${state}`;

    const value = await redis.get(key);

    if (!value) {
        return Response.json(
            { error: "Invalid or expired invitation" },
            { status: 400 }
        );
    }

    let invitation: {
        inviterUserID: string;
        invitedEmail: string;
    };

    try {
        invitation = JSON.parse(value);
    } catch {
        return Response.json(
            { error: "Invalid invitation data" },
            { status: 400 }
        );
    }

    const {
        inviterUserID,
        invitedEmail: encryptedEmail,
    } = invitation;

    if (!inviterUserID || !encryptedEmail) {
        return Response.json(
            { error: "Invalid invitation data" },
            { status: 400 }
        );
    }

    const invitedEmail = decrypt(encryptedEmail);

    const oauth2Client = createOAuthClient();

    const { tokens } =
        await oauth2Client.getToken(code);

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

    const gmailAddress =
        profile.data.emailAddress;

    if (!gmailAddress) {
        return Response.json(
            { error: "Unable to fetch Gmail address" },
            { status: 400 }
        );
    }

    if (
        gmailAddress.toLowerCase() !==
        invitedEmail.toLowerCase()
    ) {
        return Response.json(
            {
                error:
                    "Google account does not match invited email",
            },
            { status: 403 }
        );
    }

    const userId = parseInt(inviterUserID);

    await prisma.emailConfig.upsert({
        where: {
            userId_email: {
                userId,
                email: gmailAddress,
            },
        },

        update: {
            accessToken: tokens.access_token
                ? encrypt(tokens.access_token)
                : undefined,

            refreshToken: encrypt(
                tokens.refresh_token
            ),

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

            refreshToken: encrypt(
                tokens.refresh_token
            ),

            expiryDate: tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : null,

            status: "ACTIVE",
        },
    });

    // Consume invitation after successful connection
    await redis.del(key);

    return Response.redirect(
        `${process.env.APP_URL}/emails?status=connected`
    );
}

export const GET = withRateLimit(getHandler);
