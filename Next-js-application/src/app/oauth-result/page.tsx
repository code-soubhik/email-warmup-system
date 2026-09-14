"use client";

import { useSearchParams } from "next/navigation";

const RESULTS = {
    connected: {
        title: "You're all set!",
        description:
            "Your Gmail account has been successfully connected.",
    },

    oauth_cancelled: {
        title: "Connection cancelled",
        description:
            "You cancelled the Google account connection.",
    },

    email_mismatch: {
        title: "Email doesn't match",
        description:
            "The Google account you connected doesn't match the email address in the invitation.",
    },

    invalid_invitation: {
        title: "Invitation expired",
        description:
            "This invitation is invalid or has expired. Please ask the sender for a new invitation.",
    },

    invalid_request: {
        title: "Invalid request",
        description:
            "We couldn't process this request. Please try again.",
    },

    oauth_error: {
        title: "Something went wrong",
        description:
            "We couldn't connect your Gmail account. Please try again.",
    },
} as const;

type Status = keyof typeof RESULTS;

export default function OAuthResultPage() {
    const searchParams = useSearchParams();

    const status =
        searchParams.get("status") as Status;

    const result =
        RESULTS[status] ?? RESULTS.oauth_error;

    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="max-w-xl text-center">
                <h1 className="text-5xl font-semibold tracking-tight">
                    {result.title}
                </h1>

                <p className="mt-5 text-lg text-muted-foreground">
                    {result.description}
                </p>
            </div>
        </main>
    );
}