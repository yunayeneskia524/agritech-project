import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const CAT_COLORS = { umum: "ag-badge-gray", tanaman: "ag-badge-green", cuaca: "ag-badge-blue", harga: "ag-badge-yellow", lainnya: "ag-badge-gray" };
const CAT_LABELS = { umum: "Umum", tanaman: "Tanaman", cuaca: "Cuaca", harga: "Harga Pasar", lainnya: "Lainnya" };

export default function Forum() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("umum");
  const [replyText, setReplyText] = useState({});
  const [expanded, setExpanded] = useState({});
  const [filterCat, setFilterCat] = useState("semua");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/forum");
      setPosts(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return alert("Title dan isi wajib diisi!");
    try {
      setLoading(true);
      await API.post("/forum", { title, content, category });
      setTitle(""); setContent(""); setCategory("umum");
      fetchPosts();
    } catch (e) { alert(e.response?.data?.message || "Gagal posting"); }
    finally { setLoading(false); }
  };

  const handleReply = async (postId) => {
    const text = replyText[postId];
    if (!text?.trim()) return alert("Reply tidak boleh kosong!");
    try {
      await API.post(`/forum/${postId}/reply`, { content: text });
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (e) { alert(e.response?.data?.message || "Gagal reply"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus post ini?")) return;
    try { await API.delete(`/forum/${id}`); fetchPosts(); }
    catch (e) { alert("Gagal menghapus"); }
  };

  const filtered = filterCat === "semua" ? posts : posts.filter((p) => p.category === filterCat);
  const timeAgo = (date) => {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60) return "baru saja";
    if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff/3600)} jam lalu`;
    return d.toLocaleDateString("id-ID");
  };

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>💬 Forum Komunitas</h2>
          <p>Diskusi dan berbagi pengalaman dengan sesama petani</p>
        </div>

        {/* NEW POST FORM */}
        <div className="ag-form-card">
          <div className="ag-form-title">✍️ Buat Postingan Baru</div>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="ag-label">Judul</label>
              <input className="ag-input" placeholder="Judul diskusi..." value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="ag-label">Kategori</label>
              <select className="ag-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="ag-label">Isi Diskusi</label>
              <textarea className="ag-input" rows={3} placeholder="Tulis pertanyaan atau pengalaman Anda..." value={content} onChange={(e) => setContent(e.target.value)} style={{ resize: "vertical" }} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="ag-btn ag-btn-primary" onClick={handlePost} disabled={loading}>
              {loading ? "Memposting..." : "📤 Posting"}
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["semua", ...Object.keys(CAT_LABELS)].map((c) => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: filterCat === c ? "#1a7a2e" : "white", color: filterCat === c ? "white" : "#5a6a5b", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              {c === "semua" ? "Semua" : CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {filtered.length === 0 ? (
          <div className="ag-card"><div className="ag-empty"><div className="empty-icon">💬</div><p>Belum ada diskusi. Jadilah yang pertama!</p></div></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((post) => (
              <div key={post._id} className="ag-card">
                <div className="ag-card-body">
                  {/* POST HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: "#e8f5eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a7a2e" }}>
                        {post.userId?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#1a2e1c" }}>{post.userId?.name || "Unknown"}</div>
                        <div style={{ fontSize: 12, color: "#7a8a7b" }}>{timeAgo(post.createdAt)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={`ag-badge ${CAT_COLORS[post.category]}`}>{CAT_LABELS[post.category]}</span>
                      {(post.userId?._id === user.id || user.role === "admin") && (
                        <button className="ag-btn ag-btn-danger ag-btn-sm" onClick={() => handleDelete(post._id)}>🗑️</button>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <h6 style={{ fontWeight: 700, fontSize: 15, color: "#1a2e1c", marginBottom: 6 }}>{post.title}</h6>
                  <p style={{ fontSize: 14, color: "#4a5a4b", marginBottom: 12, lineHeight: 1.6 }}>{post.content}</p>

                  {/* REPLIES TOGGLE */}
                  <button onClick={() => setExpanded((prev) => ({ ...prev, [post._id]: !prev[post._id] }))} style={{ background: "none", border: "none", color: "#1a7a2e", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                    💬 {post.replies?.length || 0} Balasan {expanded[post._id] ? "▲" : "▼"}
                  </button>

                  {expanded[post._id] && (
                    <div style={{ marginTop: 12 }}>
                      {/* REPLIES */}
                      {post.replies?.length > 0 && (
                        <div style={{ borderLeft: "3px solid #e8f5eb", paddingLeft: 14, marginBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                          {post.replies.map((reply, i) => (
                            <div key={i}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                <div style={{ width: 26, height: 26, background: "#e8f5eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1a7a2e" }}>
                                  {reply.userId?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>{reply.userId?.name || "Unknown"}</span>
                                {reply.userId?.role === "admin" && <span className="ag-badge ag-badge-blue" style={{ fontSize: 10, padding: "1px 6px" }}>Admin</span>}
                                <span style={{ fontSize: 11, color: "#7a8a7b" }}>{timeAgo(reply.createdAt)}</span>
                              </div>
                              <p style={{ fontSize: 13, color: "#4a5a4b", margin: 0, paddingLeft: 34 }}>{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* REPLY INPUT */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="ag-input" placeholder="Tulis balasan..." value={replyText[post._id] || ""} onChange={(e) => setReplyText((prev) => ({ ...prev, [post._id]: e.target.value }))} style={{ flex: 1 }} />
                        <button className="ag-btn ag-btn-primary" onClick={() => handleReply(post._id)}>Kirim</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
