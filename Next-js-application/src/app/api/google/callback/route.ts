import { withRateLimit } from "@/_lib/rateLimit";
import { createOAuthClient } from "@/_lib/google";
import { redis } from "@/_lib/redis";
import { encrypt, decrypt } from "@/_lib/crypto";

import { google } from "googleapis";
import prisma from "@/_lib/prisma";

const getResultUrl = (status: string) =>
  `${process.env.APP_URL}/oauth-result?status=${encodeURIComponent(status)}`;

async function getHandler(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // User cancelled Google OAuth
  if (error) {
    return Response.redirect(getResultUrl("oauth_cancelled"));
  }

  if (!code || !state) {
    return Response.redirect(getResultUrl("invalid_request"));
  }

  const key = `oauth:${state}`;

  const value = await redis.get(key);

  if (!value) {
    return Response.redirect(getResultUrl("invalid_invitation"));
  }

  let invitation: {
    inviterUserID: string;
    invitedEmail: string;
  };

  try {
    invitation = JSON.parse(value);
  } catch {
    return Response.redirect(getResultUrl("invalid_invitation"));
  }

  const { inviterUserID, invitedEmail: encryptedEmail } = invitation;

  if (!inviterUserID || !encryptedEmail) {
    return Response.redirect(getResultUrl("invalid_invitation"));
  }

  let invitedEmail: string;

  try {
    invitedEmail = decrypt(encryptedEmail);
  } catch {
    return Response.redirect(getResultUrl("invalid_invitation"));
  }

  try {
    const oauth2Client = createOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return Response.redirect(getResultUrl("oauth_error"));
    }

    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const profile = await gmail.users.getProfile({
      userId: "me",
    });

    const gmailAddress = profile.data.emailAddress;

    if (!gmailAddress) {
      return Response.redirect(getResultUrl("oauth_error"));
    }

    // Make sure the Google account matches the invitation
    if (gmailAddress.toLowerCase() !== invitedEmail.toLowerCase()) {
      return Response.redirect(getResultUrl("email_mismatch"));
    }

    const userId = parseInt(inviterUserID);

    if (Number.isNaN(userId)) {
      return Response.redirect(getResultUrl("invalid_invitation"));
    }

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

        refreshToken: encrypt(tokens.refresh_token),

        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,

        status: "ACTIVE",
      },

      create: {
        userId,
        email: gmailAddress,
        provider: "GMAIL",

        accessToken: tokens.access_token ? encrypt(tokens.access_token) : null,

        refreshToken: encrypt(tokens.refresh_token),

        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,

        status: "ACTIVE",
      },
    });

    // Consume invitation only after everything succeeded
    await redis.del(key);

    return Response.redirect(getResultUrl("connected"));
  } catch (error) {
    console.error("OAuth callback error:", error);

    return Response.redirect(getResultUrl("oauth_error"));
  }
}

export const GET = withRateLimit(getHandler);
