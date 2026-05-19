import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const CAT_ICONS = { pupuk: "🌿", pestisida: "🧪", benih: "🌱", alat: "🔧" };
const CAT_LABELS = { pupuk: "Pupuk", pestisida: "Pestisida", benih: "Benih", alat: "Alat Tani" };

export default function Market() {
  const [products, setProducts] = useState([]);
  const [filterCat, setFilterCat] = useState("semua");
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState("shop");
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (cat) => {
    try {
      const q = cat && cat !== "semua" ? `?category=${cat}` : "";
      const res = await API.get(`/products${q}`);
      setProducts(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/products/my-orders");
      setOrders(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProducts(filterCat); }, [filterCat]);
  useEffect(() => { if (tab === "orders") fetchOrders(); }, [tab]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product._id);
      if (existing) return prev.map((c) => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { productId: product._id, name: product.name, price: product.price, unit: product.unit, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.productId !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((c) => c.productId === id ? { ...c, quantity: qty } : c));
  };

  const totalCart = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!address.trim()) return alert("Alamat pengiriman wajib diisi!");
    try {
      setLoading(true);
      await API.post("/products/order", {
        items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        address,
      });
      alert("✅ Pesanan berhasil dibuat!");
      setCart([]);
      setAddress("");
      setShowCart(false);
      setTab("orders");
    } catch (e) { alert(e.response?.data?.message || "Gagal memesan"); }
    finally { setLoading(false); }
  };

  const statusBadge = { pending: "ag-badge-yellow", confirmed: "ag-badge-blue", delivered: "ag-badge-green" };
  const statusLabel = { pending: "⏳ Pending", confirmed: "✅ Confirmed", delivered: "📦 Delivered" };

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>🛒 Pembelian Sumber Daya</h2>
          <p>Beli pupuk, pestisida, benih, dan alat tani langsung dari aplikasi</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["shop", "🛒 Belanja"], ["orders", "📦 Pesanan Saya"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", background: tab === key ? "#1a7a2e" : "white", color: tab === key ? "white" : "#5a6a5b", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {label}
            </button>
          ))}
          {cart.length > 0 && (
            <button onClick={() => setShowCart(!showCart)} style={{ padding: "8px 20px", borderRadius: 8, border: "2px solid #1a7a2e", fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "white", color: "#1a7a2e", marginLeft: "auto" }}>
              🛒 Keranjang ({cart.length}) — Rp {totalCart.toLocaleString("id-ID")}
            </button>
          )}
        </div>

        {/* CART PANEL */}
        {showCart && (
          <div className="ag-form-card" style={{ borderLeft: "4px solid #1a7a2e" }}>
            <div className="ag-form-title">🛒 Keranjang Belanja</div>
            {cart.map((item) => (
              <div key={item.productId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f4f0" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "#6c7a6d" }}>Rp {item.price.toLocaleString("id-ID")} / {item.unit}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQty(item.productId, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #dde4dd", background: "white", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
                  <span style={{ fontWeight: 600, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #dde4dd", background: "white", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
                  <button onClick={() => removeFromCart(item.productId)} className="ag-btn ag-btn-danger ag-btn-sm">🗑️</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
                <span>Total:</span>
                <span style={{ color: "#1a7a2e" }}>Rp {totalCart.toLocaleString("id-ID")}</span>
              </div>
              <label className="ag-label">Alamat Pengiriman</label>
              <textarea className="ag-input" rows={2} placeholder="Tulis alamat lengkap..." value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginBottom: 12, resize: "none" }} />
              <button className="ag-btn ag-btn-primary" onClick={handleCheckout} disabled={loading} style={{ width: "100%" }}>
                {loading ? "Memproses..." : "✅ Konfirmasi Pesanan"}
              </button>
            </div>
          </div>
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <>
            {/* CATEGORY FILTER */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {["semua", "pupuk", "pestisida", "benih", "alat"].map((c) => (
                <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: filterCat === c ? "#1a7a2e" : "white", color: filterCat === c ? "white" : "#5a6a5b", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                  {c === "semua" ? "Semua" : `${CAT_ICONS[c]} ${CAT_LABELS[c]}`}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID */}
            <div className="row g-3">
              {products.map((product) => (
                <div className="col-md-4 col-lg-3" key={product._id}>
                  <div className="ag-card" style={{ height: "100%" }}>
                    <div style={{ background: "#f8faf8", padding: "24px", textAlign: "center", fontSize: 40 }}>
                      {CAT_ICONS[product.category]}
                    </div>
                    <div className="ag-card-body">
                      <div style={{ fontSize: 12, marginBottom: 6 }}>
                        <span className="ag-badge ag-badge-green">{CAT_LABELS[product.category]}</span>
                      </div>
                      <h6 style={{ fontWeight: 700, fontSize: 14, color: "#1a2e1c", marginBottom: 4 }}>{product.name}</h6>
                      <p style={{ fontSize: 12, color: "#7a8a7b", marginBottom: 10, minHeight: 32 }}>{product.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a7a2e" }}>Rp {product.price.toLocaleString("id-ID")}</div>
                          <div style={{ fontSize: 11, color: "#7a8a7b" }}>per {product.unit} · Stok: {product.stock}</div>
                        </div>
                      </div>
                      <button className="ag-btn ag-btn-primary" style={{ width: "100%" }} onClick={() => { addToCart(product); setShowCart(true); }} disabled={product.stock === 0}>
                        {product.stock === 0 ? "Stok Habis" : "🛒 Tambah"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="ag-card">
            <div className="ag-card-header">
              <div className="ag-card-title"><span className="dot"></span>Riwayat Pesanan ({orders.length})</div>
            </div>
            {orders.length === 0 ? (
              <div className="ag-empty"><div className="empty-icon">📦</div><p>Belum ada pesanan</p></div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr><th>Tanggal</th><th>Produk</th><th>Total</th><th>Alamat</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontSize: 13, color: "#7a8a7b" }}>{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                      <td style={{ fontSize: 13 }}>{order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}</td>
                      <td><span style={{ fontWeight: 700, color: "#1a7a2e" }}>Rp {order.totalPrice?.toLocaleString("id-ID")}</span></td>
                      <td style={{ fontSize: 12, color: "#6c7a6d", maxWidth: 150 }}>{order.address || "-"}</td>
                      <td><span className={`ag-badge ${statusBadge[order.status]}`}>{statusLabel[order.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
