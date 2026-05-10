import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const CAT_LABELS = { tanaman: "🌱 Tanaman", tanah: "🪨 Tanah", hama: "🐛 Hama & Penyakit", cuaca: "🌦️ Cuaca", lainnya: "❓ Lainnya" };
const CAT_COLORS = { tanaman: "ag-badge-green", tanah: "ag-badge-yellow", hama: "ag-badge-red", cuaca: "ag-badge-blue", lainnya: "ag-badge-gray" };

export default function ExpertAdvice() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("tanaman");
  const [answerText, setAnswerText] = useState({});
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/expert");
      setQuestions(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAsk = async () => {
    if (!question.trim()) return alert("Pertanyaan tidak boleh kosong!");
    try {
      setLoading(true);
      await API.post("/expert", { question, category });
      setQuestion(""); setCategory("tanaman");
      fetchQuestions();
    } catch (e) { alert(e.response?.data?.message || "Gagal mengirim pertanyaan"); }
    finally { setLoading(false); }
  };

  const handleAnswer = async (id) => {
    const answer = answerText[id];
    if (!answer?.trim()) return alert("Jawaban tidak boleh kosong!");
    try {
      await API.put(`/expert/${id}/answer`, { answer });
      setAnswerText((prev) => ({ ...prev, [id]: "" }));
      fetchQuestions();
    } catch (e) { alert(e.response?.data?.message || "Gagal menjawab"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pertanyaan ini?")) return;
    try { await API.delete(`/expert/${id}`); fetchQuestions(); }
    catch (e) { alert("Gagal menghapus"); }
  };

  const filtered = filter === "semua" ? questions : questions.filter((q) => q.status === filter);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "baru saja";
    if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff/3600)} jam lalu`;
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>🧑‍🌾 Saran Ahli Pertanian</h2>
          <p>Tanyakan masalah pertanian Anda dan dapatkan jawaban dari ahli</p>
        </div>

        {/* ASK FORM */}
        {!isAdmin && (
          <div className="ag-form-card">
            <div className="ag-form-title">❓ Ajukan Pertanyaan</div>
            <div className="row g-3">
              <div className="col-md-9">
                <label className="ag-label">Pertanyaan Anda</label>
                <textarea className="ag-input" rows={3} placeholder="Contoh: Tanaman padi saya daunnya menguning, apa penyebabnya?" value={question} onChange={(e) => setQuestion(e.target.value)} style={{ resize: "vertical" }} />
              </div>
              <div className="col-md-3">
                <label className="ag-label">Kategori</label>
                <select className="ag-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="ag-btn ag-btn-primary" onClick={handleAsk} disabled={loading}>
                {loading ? "Mengirim..." : "📤 Kirim Pertanyaan"}
              </button>
            </div>
          </div>
        )}

        {/* ADMIN INFO */}
        {isAdmin && (
          <div className="ag-alert ag-alert-success">
            <span>⚙️</span>
            <div><strong>Mode Admin:</strong> Anda dapat menjawab pertanyaan dari petani di bawah ini.</div>
          </div>
        )}

        {/* FILTER */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["semua", "Semua"], ["pending", "⏳ Belum Dijawab"], ["answered", "✅ Sudah Dijawab"]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: filter === key ? "#1a7a2e" : "white", color: filter === key ? "white" : "#5a6a5b", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              {label} {key !== "semua" && `(${questions.filter((q) => q.status === key).length})`}
            </button>
          ))}
        </div>

        {/* QUESTIONS LIST */}
        {filtered.length === 0 ? (
          <div className="ag-card"><div className="ag-empty"><div className="empty-icon">🧑‍🌾</div><p>Belum ada pertanyaan</p></div></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((q) => (
              <div key={q._id} className="ag-card" style={{ borderLeft: `4px solid ${q.status === "answered" ? "#1a7a2e" : "#ffc107"}` }}>
                <div className="ag-card-body">
                  {/* HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, background: "#e8f5eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1a7a2e" }}>
                        {q.userId?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{q.userId?.name || "Petani"}</div>
                        <div style={{ fontSize: 12, color: "#7a8a7b" }}>{timeAgo(q.createdAt)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className={`ag-badge ${CAT_COLORS[q.category]}`}>{CAT_LABELS[q.category]}</span>
                      <span className={`ag-badge ${q.status === "answered" ? "ag-badge-green" : "ag-badge-yellow"}`}>
                        {q.status === "answered" ? "✅ Terjawab" : "⏳ Pending"}
                      </span>
                      {(q.userId?._id === user.id || isAdmin) && (
                        <button className="ag-btn ag-btn-danger ag-btn-sm" onClick={() => handleDelete(q._id)}>🗑️</button>
                      )}
                    </div>
                  </div>

                  {/* QUESTION */}
                  <p style={{ fontSize: 15, color: "#1a2e1c", fontWeight: 500, marginBottom: 12, lineHeight: 1.6 }}>{q.question}</p>

                  {/* ANSWER */}
                  {q.status === "answered" && (
                    <div style={{ background: "#e8f5eb", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a7a2e", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🧑‍🌾 Jawaban Ahli {q.answeredBy?.name ? `— ${q.answeredBy.name}` : ""}
                      </div>
                      <p style={{ fontSize: 14, color: "#1a3a1e", lineHeight: 1.7, margin: 0 }}>{q.answer}</p>
                    </div>
                  )}

                  {/* ADMIN ANSWER FORM */}
                  {isAdmin && q.status === "pending" && (
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <textarea className="ag-input" rows={2} placeholder="Tulis jawaban Anda sebagai ahli..." value={answerText[q._id] || ""} onChange={(e) => setAnswerText((prev) => ({ ...prev, [q._id]: e.target.value }))} style={{ flex: 1, resize: "none" }} />
                      <button className="ag-btn ag-btn-primary" onClick={() => handleAnswer(q._id)}>Jawab</button>
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
