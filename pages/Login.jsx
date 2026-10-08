import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Login() {
  const { login, currentUser } = useLibrary();
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (currentUser) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !membershipId.trim()) return setError("Enter both your name and membership ID.");
    const result = login(name, membershipId);
    if (result.error) return setError(result.error);
    navigate("/");
  };

  return (
    <form className="card form-grid login" onSubmit={handleSubmit} noValidate>
      <h1>Log in</h1>
      <label>Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>Membership ID
        <input value={membershipId} onChange={(e) => setMembershipId(e.target.value)} />
      </label>
      {error && <p className="error banner">{error}</p>}
      <button type="submit">Log in</button>
      <p className="hint">First time? Use name <b>Admin</b> and ID <b>ADMIN01</b>.</p>
    </form>
  );
}
