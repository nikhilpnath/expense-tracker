import { Link } from "@remix-run/react";
import { FaDownload, FaPlus } from "react-icons/fa";

export default function Index() {
  return (
    <main>
      <section id="expenses-actions">
        <Link to="add">
          <FaPlus />
          <span> Add Expenses</span>
        </Link>
        <a href="/expenses/raw">
          <FaDownload />
          <span> Load Row Data</span>
        </a>
      </section>
    </main>
  );
}
