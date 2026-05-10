import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Farm() {
  const [farms, setFarms] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFarms = async () => {
    try {
      const res = await API.get("/farms");
      setFarms(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFarms(); }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !size) return alert("Semua field wajib diisi!");
    try {
      setLoading(true);
      const payload = { name: name.trim(), location: location.trim(), size: parseFloat(size) };
      if (editingId) {
        await API.put(`/farms/${editingId}`, payload);
        setEditingId(null);
      } else {
        await API.post("/farms", payload);
      }
      setName(""); setLocation(""); setSize("");
      fetchFarms();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const deleteFarm = async (id) => {
    if (!window.confirm("Yakin ingin menghapus farm ini?")) return;
    try { await API.delete(`/farms/${id}`); fetchFarms(); }
    catch (err) { alert(err.response?.data?.message || "Gagal menghapus"); }
  };

  const editFarm = (farm) => {
    setName(farm.name || ""); setLocation(farm.location || ""); setSize(farm.size || "");
    setEditingId(farm._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingId(null); setName(""); setLocation(""); setSize(""); };

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>🏡 Farm Management</h2>
          <p>Kelola semua data farm Anda</p>
        </div>

        {/* FORM */}
        <div className="ag-form-card">
          <div className="ag-form-title">
            {editingId ? "✏️ Edit Farm" : "➕ Tambah Farm Baru"}
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="ag-label">Nama Farm</label>
              <input className="ag-input" placeholder="Contoh: Sawah Utama" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="ag-label">Lokasi</label>
              <input className="ag-input" placeholder="Contoh: Deli Serdang" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="ag-label">Ukuran (Hektar)</label>
              <input type="number" className="ag-input" placeholder="Contoh: 2.5" value={size} min="0" onChange={(e) => setSize(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="ag-btn ag-btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : editingId ? "Update Farm" : "➕ Tambah Farm"}
            </button>
            {editingId && <button className="ag-btn ag-btn-outline" onClick={cancelEdit}>Batal</button>}
          </div>
        </div>

        {/* TABLE */}
        <div className="ag-card">
          <div className="ag-card-header">
            <div className="ag-card-title"><span className="dot"></span>Daftar Farm ({farms.length})</div>
          </div>
          {farms.length === 0 ? (
            <div className="ag-empty"><div className="empty-icon">🏡</div><p>Belum ada farm. Tambahkan farm pertama Anda!</p></div>
          ) : (
            <table className="ag-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Farm</th>
                  <th>Lokasi</th>
                  <th>Ukuran</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm, i) => (
                  <tr key={farm._id}>
                    <td style={{ color: "#7a8a7b", fontWeight: 600 }}>{i + 1}</td>
                    <td><strong>{farm.name}</strong></td>
                    <td>📍 {farm.location}</td>
                    <td><span className="ag-badge ag-badge-green">{farm.size} Ha</span></td>
                    <td style={{ color: "#7a8a7b", fontSize: 13 }}>{farm.createdAt ? new Date(farm.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                    <td>
                      <button className="ag-btn ag-btn-outline ag-btn-sm me-2" onClick={() => editFarm(farm)}>✏️ Edit</button>
                      <button className="ag-btn ag-btn-danger ag-btn-sm" onClick={() => deleteFarm(farm._id)}>🗑️ Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
