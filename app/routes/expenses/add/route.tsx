import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useNavigate } from "@remix-run/react";
import ExpenseForm from "~/compoents/expenses/ExpenseForm";
import Modal from "~/compoents/util/Modal";
import { requireUserSession } from "~/utils/auth.server";
import { addExpense } from "~/utils/expenses.server";
import { validateExpenseInput } from "~/utils/validation.server";

export default function AddExpense() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(".."); // to /expenses
  };

  return (
    <Modal onClose={closeModal}>
      <ExpenseForm />
    </Modal>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserSession(request);

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

  await addExpense(expenseData, userId);
  return redirect("/expenses");
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Add Your Expense",
    },
    {
      name: "description",
      content: "Manage your expenses simply by adding them",
    },
  ];
};
