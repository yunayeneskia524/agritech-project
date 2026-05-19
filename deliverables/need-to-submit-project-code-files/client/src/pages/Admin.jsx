import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({ totalUsers: 0, totalFarms: 0, totalCrops: 0, sickCrops: 0, recentUsers: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (user.role !== "admin") { navigate("/dashboard"); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
      ]);
      setStats(statsRes.data.data || {});
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role: newRole });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah role");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}>
      <div className="spinner-border text-success" />
      <p style={{ color: "#6c7a6d", fontSize: 14 }}>Memuat admin panel...</p>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>⚙️ Admin Panel</h2>
          <p>Kelola sistem dan pengguna AgriTech</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[["overview", "📊 Overview"], ["users", "👥 Manage Users"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", background: tab === key ? "#1a7a2e" : "white", color: tab === key ? "white" : "#5a6a5b", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="row g-3 mb-4">
              {[
                { color: "gold", icon: "👥", label: "Total Farmers", value: stats.totalUsers || 0 },
                { color: "green", icon: "🏡", label: "Total Farms", value: stats.totalFarms || 0 },
                { color: "blue", icon: "🌱", label: "Total Crops", value: stats.totalCrops || 0 },
                { color: "red", icon: "🚨", label: "Crops Sakit", value: stats.sickCrops || 0 },
              ].map((s) => (
                <div className="col-md-3 col-6" key={s.label}>
                  <div className={`ag-stat ${s.color}`}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* RECENT USERS */}
            <div className="ag-card">
              <div className="ag-card-header">
                <div className="ag-card-title"><span className="dot"></span>Pengguna Terbaru</div>
              </div>
              {(stats.recentUsers || []).length === 0 ? (
                <div className="ag-empty"><div className="empty-icon">👥</div><p>Belum ada pengguna</p></div>
              ) : (
                <table className="ag-table">
                  <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Bergabung</th></tr></thead>
                  <tbody>
                    {stats.recentUsers.map((u) => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ color: "#6c7a6d" }}>{u.email}</td>
                        <td><span className={`ag-badge ${u.role === "admin" ? "ag-badge-blue" : "ag-badge-green"}`}>{u.role}</span></td>
                        <td style={{ color: "#7a8a7b", fontSize: 13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* MANAGE USERS */}
        {tab === "users" && (
          <div className="ag-card">
            <div className="ag-card-header">
              <div className="ag-card-title"><span className="dot"></span>Semua Pengguna ({users.length})</div>
            </div>
            {users.length === 0 ? (
              <div className="ag-empty"><div className="empty-icon">👥</div><p>Belum ada pengguna</p></div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr><th>#</th><th>Nama</th><th>Email</th><th>Role</th><th>Bergabung</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td style={{ color: "#7a8a7b", fontWeight: 600 }}>{i + 1}</td>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ color: "#6c7a6d" }}>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user.id}
                          style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid #dde4dd", fontSize: 12, fontFamily: "inherit", background: "white", cursor: u._id === user.id ? "not-allowed" : "pointer" }}
                        >
                          <option value="farmer">farmer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td style={{ color: "#7a8a7b", fontSize: 13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                      <td>
                        {u._id !== user.id ? (
                          <button className="ag-btn ag-btn-danger ag-btn-sm" onClick={() => handleDelete(u._id)}>🗑️ Hapus</button>
                        ) : (
                          <span style={{ fontSize: 12, color: "#7a8a7b" }}>— Anda —</span>
                        )}
                      </td>
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
