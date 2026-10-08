import { useState } from "react";
import { useLibrary } from "../context/LibraryContext.jsx";
import BookForm from "../components/BookForm.jsx";
import BookTable from "../components/BookTable.jsx";

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editing, setEditing] = useState(null); // the book being edited, or null

  const handleSubmit = (data) => {
    if (!editing) return addBook(data);
    const result = updateBook(editing.id, data);
    if (result.ok) setEditing(null);
    return result;
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"? This cannot be undone.`)) {
      deleteBook(book.id);
      if (editing?.id === book.id) setEditing(null);
    }
  };

  return (
    <>
      <h1>Manage books</h1>
      <BookForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      <BookTable books={books} onEdit={setEditing} onDelete={handleDelete} />
    </>
  );
}
