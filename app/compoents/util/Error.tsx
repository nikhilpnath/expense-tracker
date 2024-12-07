import { FaExclamationCircle } from "react-icons/fa";

interface PropTypes {
  title: string;
  children: React.ReactNode;
}

function Error({ title, children }: PropTypes) {
  return (
    <div className="error">
      <div className="icon">
        <FaExclamationCircle />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Error;
