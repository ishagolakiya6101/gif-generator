import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/search">Search</Link>
          <Link to="/favorites">Favorites</Link>
        </>
      ) : (
        <>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
