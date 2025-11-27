import type { CSSProperties } from "react";
import type { Route } from "./+types/signin";
import { data, Link, redirect, useFetcher } from "react-router";
import z from "zod";
import { createAdminClient } from "~/lib/appwrite.server";
import { commitSession, getSession } from "~/session.server";

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const values = signInSchema.safeParse(Object.fromEntries(formData));

  const newSession = await getSession();

  if (!values.success) {
    const { properties } = z.treeifyError(values.error);

    const errors = properties
      ? Object.entries(properties).reduce(
          (acc, [key, value]) => {
            acc[key] = value.errors;

            return acc;
          },
          {} as Record<string, string[]>,
        )
      : undefined;

    return data({ errors, message: "Invalid form data" }, { status: 422 });
  }

  const credentials = values.data;

  try {
    const { account } = createAdminClient();

    const session = await account.createEmailPasswordSession(credentials);

    newSession.set("auth", session.secret);

    return redirect("/admin/account", {
      headers: {
        "Set-Cookie": await commitSession(newSession, {
          expires: new Date(session.expire),
        }),
      },
    });
  } catch (err) {
    console.log({ err });
  }
}

export default function Signin() {
  const fetcher = useFetcher();

  const errors = fetcher.data?.errors as Record<string, string[]> | undefined;

  return (
    <div className="u-max-width-500 u-width-full-line">
      <h1 className="heading-level-2 u-margin-block-start-auto">
        Demo sign in
      </h1>
      <div className="u-margin-block-start-24">
        <fetcher.Form className="form common-section" method="POST">
          <ul
            className="form-list"
            style={{ "--form-list-gap": "1.5rem" } as CSSProperties}
          >
            <li className="form-item">
              <p>
                This is a demo project for{" "}
                <a href="https://appwrite.io">Appwrite</a> server side
                rendering. View the source code on the{" "}
                <a
                  className="link"
                  href="https://github.com/vfshera/appwrite-qwik-ssr"
                >
                  GitHub repository
                </a>
                .
              </p>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="email">
                Email
              </label>
              <div className="input-text-wrapper">
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="input-text"
                  defaultValue={String(fetcher.formData?.get("email") || "")}
                  required
                />
                {errors?.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.join(" ")}
                  </p>
                )}
              </div>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="password">
                Password
              </label>
              <div
                className="input-text-wrapper"
                style={{ "--amount-of-buttons": "1" } as CSSProperties}
              >
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  type="password"
                  className="input-text"
                  defaultValue={String(fetcher.formData?.get("password") || "")}
                  required
                />
                <button
                  type="button"
                  className="show-password-button"
                  aria-label="show password"
                >
                  <span aria-hidden="true" className="icon-eye" />
                </button>
              </div>
              {errors?.password && (
                <p className="text-sm text-red-600">
                  {errors.password.join(" ")}
                </p>
              )}
            </li>
            <li className="form-item">
              <button className="button is-full-width" type="submit">
                Sign in
              </button>
            </li>
            <span className="with-separators eyebrow-heading-3">or</span>
            <li className="form-item"></li>
          </ul>
        </fetcher.Form>
      </div>
      <ul className="inline-links is-center is-with-sep u-margin-block-start-32">
        <li className="inline-links-item">
          <span className="text">
            Don't have an account?{" "}
            <Link className="link" to="/signup">
              Sign up
            </Link>
          </span>
        </li>
      </ul>
    </div>
  );
}
