import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-32">
      <h1 className="text-6xl font-extrabold text-orange">404</h1>
      <p className="text-navy dark:text-cream mt-4">Page not found</p>
      <Link to="/" className="text-orange font-medium mt-6 inline-block">
        Go back home
      </Link>
    </div>
  );
}

