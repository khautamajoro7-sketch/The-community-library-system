import StockBadge from "./StockBadge.jsx";

export default function BookTable({ books, onEdit, onDelete }) {
  if (books.length === 0) return <p className="empty">No books yet. Add your first book above.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.isbn}</td>
              <td><StockBadge quantity={b.quantity} /></td>
              <td className="row-actions">
                <button onClick={() => onEdit(b)}>Update</button>
                <button className="danger" onClick={() => onDelete(b)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
