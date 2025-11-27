import { Link } from "react-router";
import type { Route } from "./+types/_index";

export default function Index({ matches }: Route.ComponentProps) {
  const { user } = matches[0].loaderData;

  return (
    <div className="flex! min-w-[300px]! flex-col! gap-6!">
      {user ? (
        <>
          <p style={{ fontSize: "1.25rem" }}>Hello {user.name || user.email}</p>
          <Link
            to="/admin/account"
            className="button is-secondary is-full-width"
          >
            Go to Account
          </Link>
        </>
      ) : (
        <>
          <Link to="/signin" className="button is-secondary is-full-width">
            Sign in
          </Link>
          <Link to="/signup" className="button is-secondary is-full-width">
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}
