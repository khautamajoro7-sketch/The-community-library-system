import { useState, useEffect } from "react";

const empty = { name: "", membershipId: "", role: "member" };

export default function UserForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setForm(initial ? { ...initial } : empty);
    setErrors({});
    setServerError("");
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = "Enter a name.";
    if (!/^[A-Za-z0-9-]{3,}$/.test(form.membershipId.trim()))
      found.membershipId = "Membership ID needs 3+ letters, numbers or hyphens.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const result = onSubmit({ name: form.name.trim(), membershipId: form.membershipId.trim(), role: form.role });
    if (result?.error) return setServerError(result.error);
    setServerError("");
    if (!initial) setForm(empty);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h2>{initial ? "Update user" : "Add a new user"}</h2>
      <label>Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>
      <label>Membership ID
        <input name="membershipId" value={form.membershipId} onChange={handleChange} />
        {errors.membershipId && <span className="error">{errors.membershipId}</span>}
      </label>
      <label>Role
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      {serverError && <p className="error banner">{serverError}</p>}
      <div className="actions">
        <button type="submit">{initial ? "Save changes" : "Add user"}</button>
        {initial && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
