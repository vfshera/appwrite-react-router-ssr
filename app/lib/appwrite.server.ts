import { Account, Client } from "node-appwrite";
import { createCookie } from "react-router";
import { env } from "~/utils/env.server";

export const SESSION_COOKIE_NAME = "appwrite-qwik-ssr-session";

export const sessionCookie = createCookie(SESSION_COOKIE_NAME, {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  secure: true,
});

/**
 * Admin client, used to create new accounts
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Session client, used to make requests on behalf of the logged in user
 */
export async function createSessionClient(request: Request) {
  const session = (await sessionCookie.parse(request.headers.get("Cookie"))) as
    | string
    | null;

  if (!session) {
    throw new Error("Session not found!");
  }

  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setSession(session);

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
  };
}
