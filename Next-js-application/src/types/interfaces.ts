import { JWTPayload } from "jose";

export interface UserSessionInterface {
  userId: string | null;
  isAuth: boolean;
  subscription: "free" | "pro" | "premium";
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
