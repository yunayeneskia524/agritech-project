import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const STAGE_BADGE = { seedling: "ag-badge-yellow", growing: "ag-badge-blue", harvest: "ag-badge-green" };
const STAGE_LABEL = { seedling: "🌱 Seedling", growing: "🌿 Growing", harvest: "🌾 Harvest" };

export default function Crop() {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [name, setName] = useState("");
  const [farmId, setFarmId] = useState("");
  const [stage, setStage] = useState("seedling");
  const [healthStatus, setHealthStatus] = useState("healthy");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/farms").then((res) => setFarms(res.data.data || [])).catch(console.error);
  }, []);

  const fetchCrops = async (fid) => {
    const id = fid || farmId;
    if (!id) return;
    try {
      const res = await API.get(`/crops/${id}`);
      setCrops(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (farmId) fetchCrops(farmId); else setCrops([]); }, [farmId]);

  const handleSubmit = async () => {
    if (!name || !farmId) return alert("Nama crop dan farm wajib dipilih!");
    try {
      setLoading(true);
      if (editingId) {
        await API.put(`/crops/${editingId}`, { name, stage, healthStatus });
        setEditingId(null);
      } else {
        await API.post("/crops", { name, farmId, stage, healthStatus });
      }
      setName(""); setStage("seedling"); setHealthStatus("healthy");
      fetchCrops();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const deleteCrop = async (id) => {
    if (!window.confirm("Yakin hapus crop ini?")) return;
    try { await API.delete(`/crops/${id}`); fetchCrops(); }
    catch (err) { alert(err.response?.data?.message || "Gagal menghapus"); }
  };

  const editCrop = (crop) => {
    setName(crop.name); setStage(crop.stage); setHealthStatus(crop.healthStatus);
    setEditingId(crop._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sickCrops = crops.filter((c) => c.healthStatus === "sick");
  const selectedFarm = farms.find((f) => f._id === farmId);

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>🌱 Crop Management</h2>
          <p>Monitor dan kelola tanaman di farm Anda</p>
        </div>

        {/* SICK ALERT */}
        {sickCrops.length > 0 && (
          <div className="ag-alert ag-alert-danger">
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <strong>{sickCrops.length} tanaman sakit</strong> di farm ini:{" "}
              {sickCrops.map((c) => <strong key={c._id} style={{ marginRight: 6 }}>{c.name}</strong>)}
              <br /><span style={{ fontSize: 13 }}>Segera lakukan penanganan atau cek rekomendasi.</span>
            </div>
          </div>
        )}

        {/* FORM */}
        <div className="ag-form-card">
          <div className="ag-form-title">{editingId ? "✏️ Edit Crop" : "➕ Tambah Crop Baru"}</div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="ag-label">Nama Tanaman</label>
              <input className="ag-input" placeholder="Contoh: Padi, Jagung" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="ag-label">Pilih Farm</label>
              <select className="ag-input" value={farmId} onChange={(e) => setFarmId(e.target.value)} disabled={!!editingId}>
                <option value="">-- Pilih Farm --</option>
                {farms.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="ag-label">Stage</label>
              <select className="ag-input" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="seedling">🌱 Seedling</option>
                <option value="growing">🌿 Growing</option>
                <option value="harvest">🌾 Harvest</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="ag-label">Status Kesehatan</label>
              <select className="ag-input" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
                <option value="healthy">✅ Healthy</option>
                <option value="sick">🚨 Sick</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="ag-btn ag-btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : editingId ? "Update Crop" : "➕ Tambah Crop"}
            </button>
            {editingId && (
              <button className="ag-btn ag-btn-outline" onClick={() => { setEditingId(null); setName(""); setStage("seedling"); setHealthStatus("healthy"); }}>
                Batal
              </button>
            )}
          </div>
        </div>

        {/* INFO HINT */}
        {!farmId && (
          <div className="ag-alert ag-alert-success">
            <span>ℹ️</span>
            <span>Pilih farm di form atas untuk melihat daftar crop.</span>
          </div>
        )}

        {/* TABLE */}
        {farmId && (
          <div className="ag-card">
            <div className="ag-card-header">
              <div className="ag-card-title">
                <span className="dot"></span>
                Daftar Crop — <span style={{ color: "#1a7a2e" }}>{selectedFarm?.name || ""}</span>
                <span style={{ marginLeft: 8, fontSize: 13, color: "#6c7a6d", fontWeight: 400 }}>({crops.length} tanaman)</span>
              </div>
            </div>

            {crops.length === 0 ? (
              <div className="ag-empty"><div className="empty-icon">🌱</div><p>Belum ada crop di farm ini.</p></div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama Tanaman</th>
                    <th>Stage</th>
                    <th>Status Kesehatan</th>
                    <th>Ditanam</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop, i) => (
                    <tr key={crop._id}>
                      <td style={{ color: "#7a8a7b", fontWeight: 600 }}>{i + 1}</td>
                      <td><strong>{crop.name}</strong></td>
                      <td><span className={`ag-badge ${STAGE_BADGE[crop.stage]}`}>{STAGE_LABEL[crop.stage]}</span></td>
                      <td>
                        <span className={`ag-badge ${crop.healthStatus === "healthy" ? "ag-badge-green" : "ag-badge-red"}`}>
                          {crop.healthStatus === "healthy" ? "✅ Healthy" : "🚨 Sick"}
                        </span>
                      </td>
                      <td style={{ color: "#7a8a7b", fontSize: 13 }}>
                        {crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td>
                        <button className="ag-btn ag-btn-outline ag-btn-sm me-2" onClick={() => editCrop(crop)}>✏️ Edit</button>
                        <button className="ag-btn ag-btn-danger ag-btn-sm" onClick={() => deleteCrop(crop._id)}>🗑️ Hapus</button>
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
