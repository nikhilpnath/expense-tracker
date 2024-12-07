import { Link, useFetcher } from "@remix-run/react";

interface PropType {
  id: string;
  title: string;
  amount: number;
  date: string;
}

function ExpenseListItem({ id, title, amount, date }: PropType) {
  
  const fetcher = useFetcher();

  function handleExpenseDelete() {
    const response = confirm("Are You sure? ");
    if (!response) {
      return;
    }
    fetcher.submit(null, { method: "delete", action: `/expenses/${id}` });
  }

  if (fetcher.state !== "idle") {
    return (
      <article className="expense-item locked">
        <p>Deleting...</p>
      </article>
    );
  }

  return (
    <article className="expense-item">
      <div>
        <h2 className="expense-title">{title}</h2>
        <p className="expense-amount">${amount.toFixed(2)}</p>
      </div>
      <menu className="expense-actions">
        <div>
          <p>
            <Link to={id}>Edit</Link>
            {/* id is a relative path */}
            {/* Here id appended to the currenlty active path */}

            <button onClick={handleExpenseDelete}>Delete</button>
          </p>
          <p className="expense-date">{date.slice(0,10)}</p>
        </div>
      </menu>
    </article>
  );
}

export default ExpenseListItem;
