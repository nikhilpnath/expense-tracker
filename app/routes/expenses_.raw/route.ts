//without the _, it still comes under the layout of the expenses file
// with this the route is still expenses/raw but wont share the same layout as expenses does
// but instead it shares root's layout

import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "~/utils/auth.server";
import { getExpenses } from "~/utils/expenses.server";

// we dont want any elements here but we need raw data, 
// so we can use loader as a standalone to return the data

// dont export it as default
export async function loader({ request }: LoaderFunctionArgs) {

  const userId = await requireUserSession(request)

  const expenses = await getExpenses(userId)
  if (expenses.length === 0) {
    return { data: "No expenses found", status: 404 }
  }
  return expenses;
}


