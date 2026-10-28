export type ItemInput = { timestamp: string; itemId: string; itemName: string; stockQty: number; price: number; image: string };
export type OrderInput = { itemId: string; quantity: number };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

export function validateItem(value: unknown): ItemInput | null {
  if (!isRecord(value)) return null;
  const { itemId, itemName, stockQty, price, image } = value;
  if (typeof itemId !== "string" || !itemId.trim() || itemId.length > 100) return null;
  if (typeof itemName !== "string" || !itemName.trim() || itemName.length > 200) return null;
  if (typeof stockQty !== "number" || !Number.isFinite(stockQty) || stockQty < 0) return null;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) return null;
  if (image !== undefined && typeof image !== "string") return null;
  return { timestamp: new Date().toISOString(), itemId: itemId.trim(), itemName: itemName.trim(), stockQty, price, image: typeof image === "string" ? image.trim() : "" };
}

export function validateOrder(value: unknown): OrderInput | null {
  if (!isRecord(value)) return null;
  if (typeof value.itemId !== "string" || !value.itemId.trim() || value.itemId.length > 100) return null;
  if (typeof value.quantity !== "number" || !Number.isSafeInteger(value.quantity) || value.quantity < 1) return null;
  return { itemId: value.itemId.trim(), quantity: value.quantity };
}

export function parseItem(value: unknown): import("./types").MenuItem | null {
  if (!isRecord(value)) return null;
  const pick = (...keys: string[]) => keys.map((key) => value[key]).find((entry) => entry !== undefined && entry !== null && entry !== "");
  const id = pick("itemId", "itemID", "id", "ID", "Item ID");
  const name = pick("itemName", "name", "Name", "Item Name");
  const rawPrice = pick("price", "Price");
  const price = typeof rawPrice === "number" ? rawPrice : typeof rawPrice === "string" && rawPrice.trim() ? Number(rawPrice) : NaN;
  const rawStock = pick("stockQty", "stockQuantity", "stock", "quantity", "Stock Qty");
  const stock = typeof rawStock === "number" ? rawStock : typeof rawStock === "string" && rawStock.trim() ? Number(rawStock) : NaN;
  if ((typeof id !== "string" && typeof id !== "number") || typeof name !== "string" || !name.trim() || !Number.isFinite(price) || price < 0) return null;
  const image = pick("image", "imageUrl", "img", "Image");
  const category = pick("category", "Category");
  return { itemId: String(id), itemName: name.trim(), price, stockQty: Number.isFinite(stock) && stock >= 0 ? stock : null, image: typeof image === "string" && image.trim() ? image.trim() : null, ...(typeof category === "string" && category.trim() ? { category: category.trim() } : {}) };
}

export function unwrapRows(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    for (const key of ["data", "items", "orders", "records", "result"]) {
      if (Array.isArray(payload[key])) return payload[key] as unknown[];
    }
  }
  return null;
}
