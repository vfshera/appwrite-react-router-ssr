import { createSessionClient } from "~/lib/appwrite.server";
import type { Route } from "./+types/admin.signout";
import { redirect } from "react-router";
import { destroySession, getSession } from "~/session.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const { account } = await createSessionClient(request);

  await account.deleteSession({ sessionId: "current" });

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
