import { useState, useEffect } from "react";

const empty = { title: "", author: "", genre: "", isbn: "", quantity: "" };

// Used for both adding and editing. `initial` is filled in when editing.
export default function BookForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // When the book being edited changes, load it into the form
  useEffect(() => {
    setForm(initial ? { ...initial } : empty);
    setErrors({});
    setServerError("");
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Enter a title.";
    if (!form.author.trim()) e.author = "Enter an author.";
    if (!form.genre.trim()) e.genre = "Enter a genre.";
    const isbnDigits = String(form.isbn).trim().replace(/-/g, "");
    if (!/^\d{10}(\d{3})?$/.test(isbnDigits)) e.isbn = "ISBN must contain 10 or 13 digits (hyphens allowed).";
    const q = Number(form.quantity);
    if (form.quantity === "" || !Number.isInteger(q) || q < 0) e.quantity = "Quantity must be a whole number, 0 or more.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const result = onSubmit({
      title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim(),
      isbn: String(form.isbn).trim(), quantity: Number(form.quantity),
    });
    if (result?.error) return setServerError(result.error);
    setServerError("");
    if (!initial) setForm(empty); // clear after adding
  };

  const field = (name, label, type = "text") => (
    <label>
      {label}
      <input name={name} type={type} min={type === "number" ? 0 : undefined}
             value={form[name]} onChange={handleChange} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </label>
  );

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h2>{initial ? "Update book" : "Add a new book"}</h2>
      {field("title", "Title")}
      {field("author", "Author")}
      {field("genre", "Genre")}
      {field("isbn", "ISBN")}
      {field("quantity", initial ? "Quantity" : "Initial Quantity", "number")}
      {serverError && <p className="error banner">{serverError}</p>}
      <div className="actions">
        <button type="submit">{initial ? "Save changes" : "Add book"}</button>
        {initial && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
