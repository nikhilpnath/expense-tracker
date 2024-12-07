import {
  Form,
  Link,
  useSearchParams,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import { FaLock } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

function AuthForm() {
  const [searchParam] = useSearchParams(); // query string

  const authMode = searchParam.get("mode") || "login";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const link = authMode === "login" ? "?mode=signup" : "?mode=login";

  const submitBtnCapt = isSubmitting
    ? authMode === "login"
      ? "Logging In..."
      : "Creating User..."
    : authMode === "login"
    ? "Login"
    : "Create User";
  const linkCapt =
    authMode === "login" ? "Create a new User" : "Log in with existing user";

  const validationError = useActionData();

  return (
    <Form method="post" className="form" id="auth-form">
      <div className="icon-img">
        {authMode === "signup" ? <FaUserPlus /> : <FaLock />}
      </div>
      <p>
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required />
        {validationError?.email ? (
          <span className="error-text">{validationError.email}</span>
        ) : null}
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" minLength={7} />
        {validationError?.password ? (
          <span className="error-text">{validationError.password}</span>
        ) : null}
      </p>

      {validationError?.error && <p style={{marginTop:"20px"}}>{validationError.error}</p>}

      <div className="form-actions">
        <button disabled={isSubmitting}>{submitBtnCapt}</button>
        <Link to={link}>{linkCapt}</Link>
      </div>
    </Form>
  );
}

export default AuthForm;
