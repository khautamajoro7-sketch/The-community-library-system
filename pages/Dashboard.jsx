import { useLibrary } from "../context/LibraryContext.jsx";
import StockBadge from "../components/StockBadge.jsx";

export default function Dashboard() {
  const { books, users, transactions } = useLibrary();
  const lowCount = books.filter((b) => b.quantity < 2).length;
  const availableCopies = books.reduce((total, book) => total + book.quantity, 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <>
      <h1>Book availability</h1>
      <p className="summary">
        {books.length} title{books.length !== 1 && "s"} · {availableCopies} available cop{availableCopies === 1 ? "y" : "ies"} · {users.length} user{users.length !== 1 && "s"}
        {lowCount > 0 && <> · <b className="low-text">{lowCount} need restocking</b></>}
      </p>
      <div className="card-grid">
        <article className="card book-card">
          <p className="meta">Total books</p>
          <h3>{books.length}</h3>
        </article>
        <article className="card book-card">
          <p className="meta">Available copies</p>
          <h3>{availableCopies}</h3>
        </article>
        <article className="card book-card">
          <p className="meta">Users</p>
          <h3>{users.length}</h3>
        </article>
      </div>
      {books.length === 0 ? (
        <p className="empty">The shelves are empty. Add books on the Books page.</p>
      ) : (
        <div className="card-grid">
          {books.map((b) => (
            <article key={b.id} className={`card book-card ${b.quantity < 2 ? "is-low" : ""}`}>
              <h3>{b.title}</h3>
              <p>{b.author}</p>
              <p className="meta">{b.genre} · ISBN {b.isbn}</p>
              <StockBadge quantity={b.quantity} />
            </article>
          ))}
        </div>
      )}

      <h2>Recent transactions</h2>
      {recentTransactions.length === 0 ? (
        <p className="empty">No transactions recorded yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Type</th><th>Quantity</th><th>Recorded by</th></tr></thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.type === "add" ? "Stock added" : "Borrowed"}</td>
                  <td>{transaction.type === "add" ? "+" : "-"}{transaction.quantity}</td>
                  <td>{transaction.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
