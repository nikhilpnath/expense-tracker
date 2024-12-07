// we gave foldername as _auth cause we dont want our link as localhost/auth/auth or like localhost/auth/login  or anything
//this auth is not need, thats why we have it as _auth

//with +, it will be treated as localhost/auth or localhost/login
// without it(+) it wont work cause our filename is _auth

import {
  ActionFunctionArgs,
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import AuthForm from "~/compoents/auth/AuthForm";
import AuthStyle from "~/styles/auth.css?url";
import { getUserFromSession, login, signup } from "~/utils/auth.server";
import { validateCredentials } from "~/utils/validation.server";

export default function Authentication() {
  return <AuthForm />;
}

type FromData = {
  email: string;
  password: string;
};

//if user authenticated (logined or signed in) he shoudn't be able access the auth page
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserFromSession(request);

  if (userId) {
    throw redirect("/");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  //query string
  const { searchParams } = new URL(request.url);

  const authMode = searchParams.get("mode");
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData) as FromData;

  try {
    validateCredentials(credentials);
  } catch (err) {
    return err;
  }

  try {
    if (authMode === "signup") {
      return await signup(credentials);
    } else {
      return await login(credentials);
    }
  } catch (error) {
    const typedError = error as Error & { status: number };

    if (typedError.status === 422) {
      return { email: typedError.message };
    } else if (typedError.status === 401) {
      return { error: typedError.message };
    }
  }

  return null;
}

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: AuthStyle,
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "Expenses Tracking - Authentication",
    },
    {
      name: "description",
      content: "Securely login or signup to use our services",
    },
  ];
};

export const headers: HeadersFunction = ({ parentHeaders }) => ({
  "Cache-Control": parentHeaders.get("Cache-Control") as string,
});
