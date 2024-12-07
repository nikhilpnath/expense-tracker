import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useNavigate } from "@remix-run/react";
import ExpenseForm from "~/compoents/expenses/ExpenseForm";
import Modal from "~/compoents/util/Modal";
import { deleteExpense, updateExpense } from "~/utils/expenses.server";
import { validateExpenseInput } from "~/utils/validation.server";

//for meta
import type { loader as expenseDetailsLoader } from "~/routes/expenses/_layout";
import { Expense } from "~/types/expenses";

export default function UpdateExpenseDetails() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(".."); // to /expenses
  };
  return (
    <Modal onClose={closeModal}>
      <ExpenseForm edit />
    </Modal>
  );
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { id } = params;
  if (request.method === "PATCH") {
    const formData = await request.formData();

    const expenseData = {
      title: formData.get("title") as string,
      amount: formData.get("amount") as string,
      date: formData.get("date") as string,
    };

    try {
      validateExpenseInput(expenseData);
    } catch (err) {
      return err;
    }

    await updateExpense(id as string, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    await deleteExpense(id as string);

    //instead of redirect,imagine we want to return the id or the data
    // return redirect("/expenses");
    return { deletedId: id };

    // now it causes error, and it opens the modal(id) page cause
    // when we return the data here remix sends a new get request to the same url we used to delete it which is "/expenses/id"

    // here comes "useFetcher" which dont redirect in such scenarios
  }
}

interface MetaType {
  params: { id: string };
  "/expenses": typeof expenseDetailsLoader;
}

export const meta: MetaFunction<MetaType> = ({ params, matches }) => {
  const expensesData = matches.find((match) => match.pathname === "/expenses")
    ?.data as Expense[];

  const expense = expensesData?.find((expense) => expense.id === params.id);

  return [
    {
      title: expense ? `Update ${expense.title}` : "Update Expense",
    },
    {
      name: "description",
      content: expense
        ? `Edit the expense "${expense.title}" that costs ${expense.amount}`
        : "Manage your expenses efficiently by editing them as needed.",
    },
  ];
};
