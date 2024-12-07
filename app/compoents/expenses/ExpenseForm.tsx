import {
  Form,
  Link,
  useActionData,
  useMatches,
  useNavigation,
  useParams,
} from "@remix-run/react";

type Data = {
  id?: string;
  title?: string;
  amount?: string;
  date?: string;
};

function ExpenseForm({ edit = false }: { edit?: boolean }) {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10

  const validationError = useActionData<Data>();

  //getting single expense data from layout file via usematches
  const matches = useMatches();
  const expensesData = matches.find((match) => match.pathname === "/expenses")
    ?.data as Data[];

  const params = useParams();
  const navigation = useNavigation();

  const expense = expensesData.find((expense) => expense.id === params.id);

  //invalid expense id
  if (params.id && !expense) {
    return (
      <p style={{ textAlign: "center" }}>Invalid expense ID : {params.id}</p>
    );
  }

  const defaultValue = expense
    ? {
        title: expense.title,
        amount: expense.amount,
        date: expense.date && expense.date?.slice(0, 10),
      }
    : {
        title: "",
        amount: "",
        date: "",
      };

  const isSubmitting = navigation.state === "submitting";

  return (
    <Form
      method={expense ? "patch" : "post"}
      className="form"
      id="expense-form"
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValue.title}
        />
        {validationError?.title ? (
          <span className="error-text">{validationError.title}</span>
        ) : null}
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValue.amount}
          />
          {validationError?.amount ? (
            <span className="error-text">{validationError.amount}</span>
          ) : null}
        </p>

        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={defaultValue.date}
          />
          {validationError?.date ? (
            <span className="error-text">{validationError.date}</span>
          ) : null}
        </p>
      </div>
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting
            ? edit
              ? "updating..."
              : "Saving..."
            : edit
            ? "Update Expense"
            : "Add Expense"}
        </button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;
