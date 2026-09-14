"use server";

import crypto from "crypto";
import { redis } from "@/_lib/redis";
import { sendEmail } from "@/_lib/sendEMail";
import { verifySession } from "@/_lib/authSession";
import { encrypt } from "@/_lib/crypto";
import prisma from "@/_lib/prisma";

interface InviteEmailResponse {
  message: string;
}

interface InviteEmailSuccess extends InviteEmailResponse {
  success: true;
}

interface InviteEmailFailure extends InviteEmailResponse {
  success: false;
  error: string;
}

type InviteEmailType = InviteEmailSuccess | InviteEmailFailure;

export async function inviteEmail(email: string): Promise<InviteEmailType> {
  if (!email?.trim()) {
    return {
      success: false,
      error: "Email is required",
      message: "Please provide an email address.",
    };
  }

  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return {
      success: false,
      error: "USER_NOT_AUTHENTICATED",
      message: "User is not authenticated.",
    };
  }

  const emailExists = await prisma.emailConfig.findFirst({
    where: {
      userId: parseInt(userId),
      email,
    },
  });

  if (emailExists) {
    return {
      success: false,
      error: "EMAIL_ALREADY_CONNECTED",
      message: "This email is already connected.",
    };
  }

  const state = crypto.randomBytes(32).toString("hex");

  const key = `oauth:${state}`;

  const value = JSON.stringify({
    inviterUserID: userId,
    invitedEmail: encrypt(email.trim()),
  });

  await redis.set(key, value, {
    expiration: {
      type: "EX",
      value: 10 * 60,
    },
  });

  const url = new URL(`/api/google/connect?state=${state}`, process.env.APP_URL)
    .href;

  const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 8px; text-align: center;">
                <h2 style="margin-bottom: 16px;">
                    Email Invitation
                </h2>

                <p style="color: #555; line-height: 1.6;">
                    Your email has been invited.
                </p>

                <p style="color: #555; line-height: 1.6;">
                    Click the button below to continue.
                </p>

                <a
                    href="${url.toString()}"
                    style="
                        display: inline-block;
                        margin-top: 16px;
                        padding: 12px 24px;
                        background-color: #fbbf24;
                        color: #080a0f;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 600;
                    "
                >
                    Accept Invitation
                </a>

                <p style="margin-top: 24px; font-size: 12px; color: #999;">
                    If you did not expect this invitation, you can safely ignore this email.
                </p>
            </div>
        </div>
    `;

  try {
    await sendEmail({
      to: email.trim(),
      subject: "EMAIL WARMUP | Invitation",
      html,
    });

    return {
      success: true,
      message: "Invitation sent successfully.",
    };
  } catch (error) {
    await redis.del(key);

    console.error("Failed to send invitation:", error);

    return {
      success: false,
      error: "Failed to send invitation",
      message: "Unable to send the invitation. Please try again.",
    };
  }
}
