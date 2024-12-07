import {
  Form,
  Link,
  NavLink,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import Logo from "../util/Logo";

function Header() {
  const userId = useLoaderData<string>();
  const matches = useMatches();

  const currentPath = matches[matches.length - 1]?.pathname;

  const expensesPath = currentPath.includes('/expenses/')  

  return (
    <header id="main-header">
      <Logo />
      <nav id="main-nav">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {userId && (
            <li>
              <NavLink to="/expenses" end>
                {expensesPath ? " Manage Expenses" : "Expenses"}
              </NavLink>
            </li>
          )}

          {expensesPath ? (
            <li>
              <NavLink to="/expenses/analysis">Analyze Expenses</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/pricing">Pricing</NavLink>
            </li>
          )}
        </ul>
      </nav>

      <nav id="cta-nav">
        <ul>
          <li>
            {userId ? (
              <Form method="post" action="/logout">
                <button className="cta">Logout</button>
              </Form>
            ) : (
              <Link to="/auth" className="cta">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
