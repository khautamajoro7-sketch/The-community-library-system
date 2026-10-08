import { useState, useEffect } from "react";

// Works like useState, but the value is loaded from and saved to localStorage.
export default function useLocalStorage(key, initialValue) {
  // Lazy initial state: runs once, reads any saved value
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Runs every time `value` changes, so the saved copy stays in sync
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
