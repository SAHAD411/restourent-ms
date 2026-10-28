"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ChevronDown, CircleHelp, Clock3, Minus, Plus, RefreshCw, Search, ShoppingBag, Trash2, Utensils, X } from "lucide-react";
import type { CartLine, MenuItem } from "@/lib/types";
import { parseItem, unwrapRows } from "@/lib/validation";

type Notice = { type: "success" | "error" | "info"; text: string } | null;
type OrderRecord = Record<string, unknown>;
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

function ImageOrPlaceholder({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="food-placeholder" aria-label={`No image available for ${name}`}><Utensils size={30} strokeWidth={1.4}/></div>;
  return <Image className="food-image" src={src} alt={name} fill sizes="(max-width: 700px) 50vw, (max-width: 1250px) 35vw, 25vw" unoptimized onError={() => setFailed(true)} />;
}

function getOrdersRows(value: unknown): OrderRecord[] {
  const rows = unwrapRows(value);
  return rows?.filter((row): row is OrderRecord => typeof row === "object" && row !== null && !Array.isArray(row)) ?? [];
}

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [rawUnmapped, setRawUnmapped] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blockedRetry, setBlockedRetry] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const submitLock = useRef(false);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  const loadItems = useCallback(async () => {
    setMenuLoading(true); setMenuError("");
    try {
      const response = await fetch("/api/items", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Menu data could not be loaded.");
      const rows = unwrapRows(result.data);
      if (!rows) { setItems([]); setRawUnmapped(true); return; }
      const parsed = rows.map(parseItem);
      setItems(parsed.filter((item): item is MenuItem => item !== null));
      setRawUnmapped(parsed.length > 0 && parsed.every((item) => item === null));
    } catch (error) { setMenuError(error instanceof Error ? error.message : "Menu data could not be loaded."); }
    finally { setMenuLoading(false); }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true); setOrdersError("");
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Order history could not be loaded.");
      const rows = unwrapRows(result.data);
      if (!rows) throw new Error("The order response format is not recognized.");
      setOrders(getOrdersRows(rows));
    } catch (error) { setOrdersError(error instanceof Error ? error.message : "Order history could not be loaded."); }
    finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => { void loadItems(); void loadOrders(); }, [loadItems, loadOrders]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.category).filter((value): value is string => Boolean(value))))], [items]);
  const filtered = useMemo(() => items.filter((item) => (category === "All" || item.category === category) && `${item.itemName} ${item.itemId}`.toLowerCase().includes(query.toLowerCase())), [items, category, query]);

  function updateQuantity(item: MenuItem, delta: number) {
    setNotice(null);
    const existing = cart.find((line) => line.item.itemId === item.itemId);
    const next = (existing?.quantity ?? 0) + delta;
    if (delta > 0 && item.stockQty !== null && next > item.stockQty) {
      setNotice({ type: "info", text: item.stockQty === 0 ? `${item.itemName} is out of stock.` : `Only ${item.stockQty} ${item.itemName} available.` });
      return;
    }
    setCart((current) => {
      if (next <= 0) return current.filter((line) => line.item.itemId !== item.itemId);
      if (!existing) return [...current, { item, quantity: next }];
      return current.map((line) => line.item.itemId === item.itemId ? { ...line, item, quantity: next } : line);
    });
  }

  async function checkout() {
    if (submitLock.current || submitting || cart.length === 0) return;
    const lines = cart.filter((line) => !blockedRetry.includes(line.item.itemId));
    if (!lines.length) { setNotice({ type: "info", text: "An earlier submission needs your review before it can be retried." }); return; }
    for (const line of lines) {
      if (!Number.isSafeInteger(line.quantity) || line.quantity < 1 || !Number.isFinite(line.item.price) || line.item.price < 0 || (line.item.stockQty !== null && line.quantity > line.item.stockQty)) {
        setNotice({ type: "error", text: `${line.item.itemName} has an invalid quantity or is no longer available. Refresh the menu and review the cart.` }); return;
      }
    }
    submitLock.current = true; setSubmitting(true); setNotice({ type: "info", text: "Sending items to Google Sheets…" });
    const confirmed: string[] = [];
    let uncertain: string | null = null;
    let failure = "";
    for (const line of lines) {
      try {
        const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: { itemId: line.item.itemId, quantity: line.quantity } }) });
        const result = await response.json();
        if (!response.ok || result.success !== true) { failure = result.error || `Could not confirm ${line.item.itemName}.`; uncertain = line.item.itemId; break; }
        confirmed.push(line.item.itemId);
      } catch { failure = `Could not confirm whether ${line.item.itemName} was saved. It has not been retried.`; uncertain = line.item.itemId; break; }
    }
    if (confirmed.length) {
      setCart((current) => current.filter((line) => !confirmed.includes(line.item.itemId)));
      setBlockedRetry((current) => current.filter((id) => !confirmed.includes(id)));
      void loadOrders(); void loadItems();
    }
    if (uncertain) setBlockedRetry((current) => current.includes(uncertain!) ? current : [...current, uncertain!]);
    const remaining = lines.filter((line) => !confirmed.includes(line.item.itemId));
    setNotice(uncertain
      ? { type: "error", text: `${confirmed.length} line${confirmed.length === 1 ? "" : "s"} confirmed. ${failure} The remaining cart lines are kept; inspect Orders before manually retrying this line.` }
      : blockedRetry.length
        ? { type: "success", text: `${confirmed.length} order line${confirmed.length === 1 ? "" : "s"} confirmed. Lines with uncertain earlier submissions remain in the cart for your review.` }
        : { type: "success", text: `${confirmed.length} order line${confirmed.length === 1 ? "" : "s"} confirmed and saved. The cart is cleared.` });
    if (!uncertain && remaining.length === 0) setBlockedRetry([]);
    submitLock.current = false; setSubmitting(false);
  }

  return <>
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><Utensils size={23}/></div><div><strong>Savor Restaurant</strong><small>POS Terminal #03</small></div></div>
      <div className="table-pill"><span>♧</span><b>Table T-04</b><i/>Server Alex</div>
      <label className="top-search"><Search size={18}/><input aria-label="Search menu" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes, drinks..."/></label>
      <nav className="top-nav"><a className="nav-active" href="#menu">Menu Catalog</a><a href="#ticket">Active Cart &amp; Checkout</a></nav>
      <div className="profile"><span className="avatar">A</span><span><b>Alex M.</b><small>Floor Captain</small></span></div>
    </header>
    <aside className="sidebar"><div><div className="side-label">Point of Sale</div><a className="side-link selected" href="#menu"><Utensils size={19}/>Menu Catalog</a><a className="side-link" href="#ticket"><ShoppingBag size={19}/>Active Ticket</a><button className="side-link" onClick={() => { setOrdersOpen((value) => !value); void loadOrders(); }}><Clock3 size={19}/>Order History</button></div><div className="shift-box"><span>Menu items <b>{menuLoading ? "…" : items.length}</b></span><span>Order records <b>{ordersLoading ? "…" : orders.length}</b></span></div></aside>
    <main className="workspace" id="menu">
      <div className="service-strip"><div><b>Savor Restaurant</b><span>POS</span><small>Menu and order data via Google Sheets</small></div><div><b>Active Ticket</b><small>Order lines are submitted individually</small></div></div>
      <div className="main-grid">
        <section className="catalog">
          <div className="catalog-head"><div><h1>Floor Menu Catalog</h1><span className="count-chip">{items.length} items</span></div><button className="text-button" onClick={() => void loadItems()} aria-label="Refresh menu"><RefreshCw size={16}/>Refresh</button></div>
          {categories.length > 1 && <div className="categories" aria-label="Filter by category">{categories.map((value) => <button key={value} className={category === value ? "category active" : "category"} onClick={() => setCategory(value)}>{value === "All" ? "All Items" : value}</button>)}</div>}
          {notice && <div className={`notice ${notice.type}`} role="status"><span>{notice.type === "error" ? <AlertCircle size={17}/> : notice.type === "success" ? "✓" : <CircleHelp size={17}/>}</span><span>{notice.text}</span><button aria-label="Dismiss message" onClick={() => setNotice(null)}><X size={16}/></button></div>}
          {menuLoading ? <div className="item-grid">{Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div/><span/><span/></div>)}</div>
            : menuError ? <div className="state-card"><AlertCircle/><h2>Menu unavailable</h2><p>{menuError}</p><button className="primary-button" onClick={() => void loadItems()}><RefreshCw size={16}/>Try again</button></div>
            : rawUnmapped ? <div className="state-card"><CircleHelp/><h2>Menu data format not recognized</h2><p>The server returned menu data, but its item fields could not be mapped safely. Check the Apps Script response fields.</p><button className="secondary-button" onClick={() => void loadItems()}>Refresh menu</button></div>
            : !items.length ? <div className="state-card"><Utensils/><h2>{query ? "No matching dishes" : "No menu items yet"}</h2><p>{query ? "Try another search term." : "The connected spreadsheet did not return any menu items."}</p></div>
            : !filtered.length ? <div className="state-card"><Search/><h2>No matching dishes</h2><p>Try a different search or category.</p></div>
            : <div className="item-grid">{filtered.map((item) => {
              const qty = cart.find((line) => line.item.itemId === item.itemId)?.quantity ?? 0;
              const out = item.stockQty === 0;
              return <article className="menu-card" key={item.itemId}><div className="menu-photo"><ImageOrPlaceholder src={item.image} name={item.itemName}/><span className={out ? "stock-badge out" : "stock-badge"}>{item.stockQty === null ? "Stock n/a" : out ? "Out of stock" : `${item.stockQty} in stock`}</span></div><div className="menu-info"><div className="menu-title-row"><h2 title={item.itemName}>{item.itemName}</h2><small>ID {item.itemId}</small></div><p>{item.category ?? ""}</p><div className="menu-bottom"><strong>{money(item.price)}</strong>{qty ? <div className="stepper"><button aria-label={`Remove one ${item.itemName}`} onClick={() => updateQuantity(item, -1)}><Minus size={15}/></button><b>{qty}</b><button aria-label={`Add one ${item.itemName}`} disabled={out || (item.stockQty !== null && qty >= item.stockQty)} onClick={() => updateQuantity(item, 1)}><Plus size={15}/></button></div> : <button className="add-button" disabled={out} onClick={() => updateQuantity(item, 1)}><Plus size={16}/>{out ? "Unavailable" : "Add"}</button>}</div></div></article>;
            })}</div>}
        </section>
        <aside className="ticket" id="ticket"><div className="ticket-heading"><div><h2><ShoppingBag size={20}/>Active Ticket</h2><p>Current order · {cartCount} items</p></div><button className="icon-button" aria-label="Clear cart" disabled={!cart.length || submitting} onClick={() => { setCart([]); setBlockedRetry([]); setNotice(null); }}><Trash2 size={18}/></button></div>
          {cart.length ? <><div className="ticket-lines">{cart.map(({ item, quantity }) => <div className="ticket-line" key={item.itemId}><div className="mini-photo"><ImageOrPlaceholder src={item.image} name={item.itemName}/></div><div className="line-content"><div className="line-name"><b>{item.itemName}</b><button aria-label={`Remove ${item.itemName}`} disabled={submitting} onClick={() => { setCart((current) => current.filter((line) => line.item.itemId !== item.itemId)); setBlockedRetry((current) => current.filter((id) => id !== item.itemId)); }}><X size={16}/></button></div><small>{money(item.price)} each · {item.itemId}</small>{blockedRetry.includes(item.itemId) && <small className="retry-warning">Submission uncertain. <button onClick={() => setBlockedRetry((current) => current.filter((id) => id !== item.itemId))}>Allow manual retry</button></small>}<div className="line-controls"><div className="stepper compact"><button aria-label={`Decrease ${item.itemName}`} disabled={submitting} onClick={() => updateQuantity(item, -1)}><Minus size={14}/></button><b>{quantity}</b><button aria-label={`Increase ${item.itemName}`} disabled={submitting || (item.stockQty !== null && quantity >= item.stockQty)} onClick={() => updateQuantity(item, 1)}><Plus size={14}/></button></div><strong>{money(item.price * quantity)}</strong></div></div></div>)}</div><div className="totals"><div><span>Items Subtotal ({cartCount} items)</span><b>{money(subtotal)}</b></div><div className="pay-total"><span>Payable Total</span><b>{money(subtotal)}</b></div><small>Tax and fees are not included; the existing API does not accept them.</small></div><button className="checkout-button" disabled={!cart.length || submitting || cart.every((line) => blockedRetry.includes(line.item.itemId))} onClick={() => void checkout()}>{submitting ? <><RefreshCw size={18} className="spin"/>Submitting…</> : <>Confirm order lines · {money(subtotal)}</>}</button><p className="checkout-note">Each item is sent as a separate order line.</p></> : <div className="empty-cart"><ShoppingBag size={35}/><b>Your ticket is empty</b><span>Add a menu item to start this order.</span></div>}
          <section className="orders-section"><button className="orders-toggle" onClick={() => { setOrdersOpen((value) => !value); if (!ordersOpen) void loadOrders(); }}><span><Clock3 size={17}/>Recent Orders</span><ChevronDown size={17} className={ordersOpen ? "rotate" : ""}/></button>{ordersOpen && <div className="orders-content">{ordersLoading ? <p>Loading orders…</p> : ordersError ? <div><p>{ordersError}</p><button className="text-button" onClick={() => void loadOrders()}>Retry</button></div> : !orders.length ? <p>No order records returned.</p> : orders.slice(-5).reverse().map((order, index) => <div className="order-record" key={index}>{Object.entries(order).slice(0, 5).map(([key, value]) => <span key={key}><b>{key}:</b> {formatValue(value)}</span>)}</div>)}</div>}</section>
        </aside>
      </div>
    </main>
    <nav className="mobile-nav"><a href="#menu"><Utensils size={21}/>Menu</a><a href="#ticket"><ShoppingBag size={21}/><span>Cart {cartCount > 0 && <i>{cartCount}</i>}</span></a><button onClick={() => { setOrdersOpen((value) => !value); void loadOrders(); }}><Clock3 size={21}/>Orders</button></nav>
  </>;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || typeof value === "object") return typeof value === "object" && value !== null ? JSON.stringify(value) : "—";
  if (typeof value === "string" && /^\d{4}-\d\d-\d\d/.test(value)) { const date = new Date(value); if (!Number.isNaN(date.getTime())) return date.toLocaleString(); }
  return String(value);
}
