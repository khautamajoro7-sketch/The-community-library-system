import { Routes, Route, Navigate } from "react-router-dom";
import { useLibrary } from "./context/LibraryContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Transactions from "./pages/Transactions.jsx";
import Users from "./pages/Users.jsx";

// Wrapper that blocks a page unless the user is logged in (and an admin, if required)
function Protected({ adminOnly, children }) {
  const { currentUser } = useLibrary();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/books" element={<Protected><Books /></Protected>} />
          <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
          <Route path="/users" element={<Protected adminOnly><Users /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
