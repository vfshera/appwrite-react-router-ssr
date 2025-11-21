import { createCookieSessionStorage } from "react-router";
import { env } from "./env.server";

export const SESSION_COOKIE_NAME = "appwrite-react-router-session";

type SessionData = {
  auth?: string;
};

type FlashData = object;

export const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, FlashData>({
    cookie: {
      name: SESSION_COOKIE_NAME,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: [env.APP_SECRET || "s3cret1"],
      secure: env.PROD,
    },
  });
