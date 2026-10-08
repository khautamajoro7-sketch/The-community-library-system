import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const LibraryContext = createContext(null);
export const useLibrary = () => useContext(LibraryContext);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const seedAdmin = { id: "u1", name: "Admin", membershipId: "ADMIN01", role: "admin" };

// Every action returns { ok: true } or { error: "message" } so forms can show the problem.
export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage("lib_books", []);
  const [users, setUsers] = useLocalStorage("lib_users", [seedAdmin]);
  const [transactions, setTransactions] = useLocalStorage("lib_transactions", []);
  const [currentUser, setCurrentUser] = useLocalStorage("lib_current_user", null);

  /* ---------- Auth ---------- */
  const login = (name, membershipId) => {
    const match = users.find(
      (u) => u.membershipId.toLowerCase() === membershipId.trim().toLowerCase() &&
             u.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (!match) return { error: "Name and membership ID do not match any user." };
    setCurrentUser(match);
    return { ok: true };
  };
  const logout = () => setCurrentUser(null);

  /* ---------- Books ---------- */
  const isbnTaken = (isbn, ignoreId) =>
    books.some((b) => b.isbn === isbn && b.id !== ignoreId);

  const addBook = (data) => {
    if (isbnTaken(data.isbn)) return { error: "A book with this ISBN already exists." };
    setBooks([...books, { ...data, id: uid() }]);
    return { ok: true };
  };
  const updateBook = (id, data) => {
    if (isbnTaken(data.isbn, id)) return { error: "Another book already uses this ISBN." };
    setBooks(books.map((b) => (b.id === id ? { ...b, ...data } : b)));
    return { ok: true };
  };
  const deleteBook = (id) => setBooks(books.filter((b) => b.id !== id));

  /* ---------- Transactions (change stock + write to the log) ---------- */
  const recordTransaction = (bookId, type, quantity) => {
    if (type !== "borrow" && type !== "add")
      return { error: "Choose a valid transaction type." };
    if (!Number.isInteger(quantity) || quantity < 1)
      return { error: "Quantity must be a whole number of 1 or more." };

    const book = books.find((b) => b.id === bookId);
    if (!book) return { error: "Choose a book first." };
    if (type === "borrow" && quantity > book.quantity)
      return { error: `Only ${book.quantity} cop${book.quantity === 1 ? "y" : "ies"} in stock.` };

    const newQty = type === "add" ? book.quantity + quantity : book.quantity - quantity;
    setBooks(books.map((b) => (b.id === bookId ? { ...b, quantity: newQty } : b)));
    setTransactions([
      { id: uid(), bookId, title: book.title, type, quantity,
        by: currentUser?.name ?? "Unknown", date: new Date().toISOString() },
      ...transactions,
    ]);
    return { ok: true };
  };

  /* ---------- Users ---------- */
  const idTaken = (membershipId, ignoreId) =>
    users.some((u) => u.membershipId.toLowerCase() === membershipId.toLowerCase() && u.id !== ignoreId);

  const addUser = (data) => {
    if (idTaken(data.membershipId)) return { error: "That membership ID is already in use." };
    setUsers([...users, { ...data, id: uid() }]);
    return { ok: true };
  };
  const updateUser = (id, data) => {
    if (idTaken(data.membershipId, id)) return { error: "That membership ID is already in use." };
    setUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
    if (currentUser?.id === id) setCurrentUser({ ...currentUser, ...data });
    return { ok: true };
  };
  const deleteUser = (id) => {
    if (id === currentUser?.id) return { error: "You cannot delete the account you are logged in with." };
    setUsers(users.filter((u) => u.id !== id));
    return { ok: true };
  };

  const value = {
    books, users, transactions, currentUser,
    login, logout, addBook, updateBook, deleteBook,
    recordTransaction, addUser, updateUser, deleteUser,
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
