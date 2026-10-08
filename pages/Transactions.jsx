import { useState } from "react";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Transactions() {
  const { books, transactions, recordTransaction } = useLibrary();
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("borrow");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!bookId) return setMessage({ text: "Choose a book.", isError: true });
    if (!Number.isInteger(qty) || qty < 1)
      return setMessage({ text: "Quantity must be a whole number of 1 or more.", isError: true });

    const result = recordTransaction(bookId, type, qty);
    if (result.error) return setMessage({ text: result.error, isError: true });
    setMessage({ text: type === "add" ? "Stock added." : "Book borrowed. Stock deducted.", isError: false });
    setQuantity(1);
  };

  return (
    <>
      <h1>Stock transactions</h1>
      <form className="card form-grid" onSubmit={handleSubmit} noValidate>
        <label>Book
          <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
            <option value="">Select a book</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>
            ))}
          </select>
        </label>
        <label>Transaction
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="borrow">Borrow (deduct stock)</option>
            <option value="add">New arrival (add stock)</option>
          </select>
        </label>
        <label>Quantity
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        {message.text && <p className={`banner ${message.isError ? "error" : "success"}`}>{message.text}</p>}
        <div className="actions"><button type="submit">Record transaction</button></div>
      </form>

      <h2>History</h2>
      {transactions.length === 0 ? (
        <p className="empty">No transactions recorded yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>Recorded by</th></tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleString()}</td>
                  <td>{t.title}</td>
                  <td>{t.type === "add" ? "Stock added" : "Borrowed"}</td>
                  <td>{t.type === "add" ? "+" : "-"}{t.quantity}</td>
                  <td>{t.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
