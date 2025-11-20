import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";

import { createSessionClient } from "./lib/appwrite.server";
import type { Models } from "node-appwrite";
import { userContext } from "./context";
import bgImage from "~/assets/images/login-dark-mode.png";
import logo from "~/assets/images/appwrite-logo-dark.svg";

const authMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  try {
    const { account } = await createSessionClient(request);

    const user = (await account.get()) as Models.User | null;

    context.set(userContext, user || null);
  } catch {
    context.set(userContext, null);
  }
};

const requireAuth: Route.MiddlewareFunction = async ({ request, context }) => {
  const url = new URL(request.url);

  const user = context.get(userContext);

  if (url.pathname.startsWith("/admin") && !user) {
    const to = new URL("/signin", url);

    throw redirect(to.toString());
  }

  if (user && ["/signin", "/signup"].includes(url.pathname)) {
    throw redirect(new URL("/account", url).toString());
  }
};

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  requireAuth,
];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  return { user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body className="theme-dark">
        <main className="grid-1-1 is-full-page" id="main">
          <section
            className="u-flex u-flex-vertical"
            style={{ background: `url(${bgImage}) no-repeat` }}
          >
            <div className="tag-line is-not-mobile">
              <p>
                Server side rendering<span className="underscore">_</span>
              </p>
            </div>
            <div className="u-flex u-stretch" />
            <div className="logo u-flex u-gap-16">
              <a href="/">
                <img
                  src={logo}
                  width="160"
                  className="u-block"
                  alt="Appwrite Logo"
                />
              </a>
            </div>
          </section>
          <section className="grid-1-1-col-2 u-flex u-main-center u-cross-center _u-padding-16-mobile">
            <div className="container u-flex u-flex-vertical u-cross-center u-main-center">
              {children}
            </div>
          </section>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";

  let details = "An unexpected error occurred.";

  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
