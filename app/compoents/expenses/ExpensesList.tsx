import ExpenseListItem from "./ExpenseListItem";

interface PropType {
  expenses: {
    id: string;
    title: string;
    amount: number;
    date: string;
  }[];
}

function ExpensesList({ expenses }: PropType) {
  return (
    <ol id="expenses-list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={expense.amount}
            date={expense.date}
          />
        </li>
      ))}
    </ol>
  );
}

export default ExpensesList;
