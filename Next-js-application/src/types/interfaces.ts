import { JWTPayload } from "jose";

export interface UserSessionInterface {
    userId: string | null;
}

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
