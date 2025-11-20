import type { CSSProperties } from "react";
import type { Route } from "./+types/signin";
import { Form, Link, redirect } from "react-router";
import z from "zod";
import { createAdminClient, sessionCookie } from "~/lib/appwrite.server";

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
  redirectTo: z.string().optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const values = signInSchema.safeParse(Object.fromEntries(formData));

  if (!values.success) {
    return values.error;
  }

  const { redirectTo = "/admin/account", ...credentials } = values.data;

  try {
    const { account } = createAdminClient();

    const session = await account.createEmailPasswordSession(credentials);

    if (!session) {
      return { message: "Failed to sign in" };
    }

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionCookie.serialize(session.secret, {
          expires: new Date(session.expire),
        }),
      },
    });
  } catch (err) {
    console.log({ err });
  }
}

export default function Signin() {
  return (
    <div className="u-max-width-500 u-width-full-line">
      <h1 className="heading-level-2 u-margin-block-start-auto">
        Demo sign in
      </h1>
      <div className="u-margin-block-start-24">
        <Form className="form common-section" method="post">
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
                  autoComplete="off"
                  //   value={action.formData?.get("email")}
                  required
                />
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
                  autoComplete="off"
                  //   value={action.formData?.get("password")}
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
            </li>
            <li className="form-item">
              <button className="button is-full-width" type="submit">
                Sign in
              </button>
            </li>
            <span className="with-separators eyebrow-heading-3">or</span>
            <li className="form-item"></li>
          </ul>
        </Form>

        {/* <button className="button is-github is-full-width" type="button">
            <span className="icon-github" aria-hidden="true" />
            <span className="text">Sign up with GitHub</span>
          </button> */}
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
