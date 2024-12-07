import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";

// import "./tailwind.css";
import SharedStyles from "~/styles/shared.css?url";
import ErrorCmp from "./compoents/util/Error";
import { getUserFromSession } from "./utils/auth.server";
import Header from "./compoents/navigation/Header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: SharedStyles,
  },
];

interface Match {
  handle?: {
    disableJS: boolean;
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches() as Match[];
  //here we get the route handle value and dynamically loads script tags
  //  our index and pricing routes are static and they dont require script files
  // by doing this way we ensure we only loads scripts where disableJS is not specified
  const disableJS = matches.some((match) => match.handle?.disableJS);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await getUserFromSession(request);
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <ErrorCmp title={error.statusText}>
          <p>{error.data ?? "Something went wrong. Please try again later"}</p>
          <p>
            Back to <Link to="/">Home</Link>
          </p>
        </ErrorCmp>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main>
        <ErrorCmp title="An Error Occured ">
          <p>
            {error.message || "Something went wrong. Please try again later"}
          </p>
          <p>
            Back to <Link to="/">Home</Link>
          </p>
        </ErrorCmp>
      </main>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
//note - isRouteErrorResponse wont catch erros if its thrown from the components(thorw json or new response)
// meanwhile they all comes under our Error Instance

type CustomError = {
  statusText?: string;
  data?: string;
  message?: string;
};

//meta - error and normal
export const meta: MetaFunction= ({ error: customError }) => {
  const error = customError as CustomError; // for ts warning
  if (error) {
    if (error.data) {
      return [
        { title: error.statusText || "Error Occurred" },
        {
          name: "description",
          content: error.data || "Unexpected Error Occurred",
        },
      ];
    } else if (error.message) {
      return [
        { title: "An Error Occurred" },
        {
          name: "description",
          content: "Unexpected Error Occurred",
        },
      ];
    }
  }

  return [
    { title: "Expenses Tracker : Track your all expenses in one place" },
    {
      name: "description",
      content: "Keep Track of your expenses with ease ",
    },
  ];
};

export default function App() {
  return <Outlet />;
  // Since the layout, remix wraps everything inside the layout
}
