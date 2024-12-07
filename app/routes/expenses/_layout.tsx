// this is our layout file which wraps all of our expenses files.
// also this _layout act as our index file

import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { HeadersFunction, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import expensesStyles from "~/styles/expenses.css?url";
import ExpensesList from "~/compoents/expenses/ExpensesList";
import { getExpenses } from "~/utils/expenses.server";
import { requireUserSession } from "~/utils/auth.server";

export default function ExpenseLayout() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname; // getting current routh path

  const Expenses = useLoaderData<typeof loader>();
  const hasExpense = Expenses && Expenses.length > 0;

  return (
    <>
      <Outlet />
      {!(
        currentPath === "/expenses/analysis" || currentPath === "/expenses/raw"
      ) &&
        (hasExpense ? (
          <ExpensesList expenses={Expenses} />
        ) : (
          <section id="no-expenses">
            <h1>No Notes Found</h1>
            <p>
              Start <Link to="add">manage</Link> your expenses today..
            </p>
          </section>
        ))}
    </>
  );
}

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: expensesStyles,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  //protected routes - cant access without login

  //there is a catch is that, eventhough we restrict the user from accessing the routes,
  // but the routes loaders run in parallely
  // so even after layout fails there are chances that loaders might return data(sesitive)
  // so its required to add protection to every loaders route we wanna protect (if we have any)
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);
  const ExpensesObj = expenses.map((expense) => {
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...remainingObj } = expense;
    return remainingObj;
  });

  return json(ExpensesObj, {
    headers: {
      "Cache-Control": "max-age=3", // 3 seconds
    },
  });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") as string,
});


