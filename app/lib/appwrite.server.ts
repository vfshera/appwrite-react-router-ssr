import { Account, Client } from "node-appwrite";
import { env } from "~/utils/env.server";
import { getSession } from "~/session.server";

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
  const session = await getSession(request.headers.get("Cookie"));

  const authSecret = session.get("auth");

  if (!authSecret) {
    throw new Error("Session not found!");
  }

  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setSession(authSecret);

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
  };
}
