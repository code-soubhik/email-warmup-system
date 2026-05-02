// File: @/app/lib/definitions.ts

import { Extends } from "@/generated/prisma/internal/prismaNamespace";
import { JWTPayload } from "jose";

export interface Theme {
  theme: "dark" | "light";
}

export interface UserSessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

export interface UserThemePayload extends JWTPayload {
  theme: Theme["theme"];
}
