import { useState } from "react";
import { useLibrary } from "../context/LibraryContext.jsx";
import UserForm from "../components/UserForm.jsx";

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const [editing, setEditing] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const handleSubmit = (data) => {
    if (!editing) return addUser(data);
    const result = updateUser(editing.id, data);
    if (result.ok) setEditing(null);
    return result;
  };

  const handleDelete = (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    const result = deleteUser(user.id);
    setDeleteError(result.error || "");
  };

  return (
    <>
      <h1>Manage users</h1>
      <UserForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      {deleteError && <p className="error banner">{deleteError}</p>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.membershipId}</td><td>{u.role}</td>
                <td className="row-actions">
                  <button onClick={() => setEditing(u)}>Update</button>
                  <button className="danger" onClick={() => handleDelete(u)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
