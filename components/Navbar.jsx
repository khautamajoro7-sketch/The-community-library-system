import { NavLink, useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <span className="brand">Community Library</span>
      {currentUser && (
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          {currentUser.role === "admin" && <NavLink to="/users">Users</NavLink>}
          <button className="link-btn" onClick={handleLogout}>
            Log out ({currentUser.name})
          </button>
        </nav>
      )}
    </header>
  );
}
