// Small label that shows stock level. Low stock = fewer than 2 copies.
export default function StockBadge({ quantity }) {
  if (quantity === 0) return <span className="badge out">LOW STOCK · Out of stock</span>;
  if (quantity < 2) return <span className="badge low">LOW STOCK: {quantity}</span>;
  return <span className="badge ok">{quantity} in stock</span>;
}
