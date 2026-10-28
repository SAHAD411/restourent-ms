export type MenuItem = {
  itemId: string;
  itemName: string;
  stockQty: number | null;
  price: number;
  image: string | null;
  category?: string;
};

export type CartLine = { item: MenuItem; quantity: number };
export type ApiEnvelope<T> = { success: true; data: T } | { success: false; error: string };
