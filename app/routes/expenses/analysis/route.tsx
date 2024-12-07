import ExpenseStatistics from "~/compoents/expenses/ExpenseStatistics";
import Chart from "~/compoents/expenses/Chart";
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import ErrorCmp from "~/compoents/util/Error";
import { getExpenses } from "~/utils/expenses.server";
import { requireUserSession } from "~/utils/auth.server";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export default function ExpenseAnalysis() {
  const expensesData = useLoaderData<typeof loader>();

  return (
    <main>
      <Chart expenses={expensesData} />
      <ExpenseStatistics expenses={expensesData} />
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId =await requireUserSession(request);

  const expenses = await getExpenses(userId);

  if (expenses?.length === 0) {
    throw json("Could not load expenses for the requested analysis", {
      status: 404,
      statusText: "Analysis - Expenses Not Found",
    });
  }

  const ExpensesObj = expenses?.map((expense) => {
    const { createdAt, updatedAt, ...remainingObj } = expense;
    return remainingObj;
  });

  return ExpensesObj;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <ErrorCmp title={error.statusText}>
          <p>{error.data ?? "Something went wrong - couldn't load expenses"}</p>
        </ErrorCmp>
      </main>
    );
  }
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Expenses Analysis",
    },
    {
      name: "description",
      content: "Get a brief info of your expenses",
    },
  ];
};

