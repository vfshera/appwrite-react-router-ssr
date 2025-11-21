import { useFetcher } from "react-router";
import type { Route } from "./+types/admin.account";
import type { CSSProperties } from "react";

function getInitials(name: string) {
  const [first, last] = name.split(" ");
  if (last) return `${first[0]}${last[0]}`;

  return `${first[0]}`;
}

export default function Account({ matches }: Route.ComponentProps) {
  const user = matches[0].loaderData.user!;

  const fetcher = useFetcher();

  return (
    <div className="u-max-width-500 u-width-full-line">
      <h1 className="heading-level-2 u-margin-block-start-auto">
        Your account
      </h1>
      <div className="u-margin-block-start-24">
        <section className="card">
          <div className="user-profile">
            <span className="avatar">
              {getInitials(user.name || user.email || "")}
            </span>
            <span className="user-profile-info">
              <span className="name">{user.name}</span>
              <div className="interactive-text-output u-padding-inline-0">
                <span className="text">{user.$id}</span>
                <div className="u-flex u-cross-child-start u-gap-8">
                  <button
                    className="interactive-text-output-button"
                    aria-label="copy text"
                  >
                    <span className="icon-duplicate" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </span>
            <span className="user-profile-sep" />
            <span className="user-profile-empty-column" />
            <span className="user-profile-info">
              <span className="text">
                Welcome back, {user.name || user.email}!
              </span>
            </span>
          </div>
        </section>
        <fetcher.Form
          className="form common-section"
          method="post"
          action="/admin/signout"
        >
          <ul
            className="form-list"
            style={{ "--form-list-gap": "1.5rem" } as CSSProperties}
          >
            <li className="form-item">
              <button
                className="button is-secondary is-full-width"
                type="submit"
              >
                Sign out
              </button>
            </li>
          </ul>
        </fetcher.Form>
      </div>
    </div>
  );
}
