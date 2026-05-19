import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const RECS = {
  seedling: {
    fertilizer: {
      title: "💊 Pupuk untuk Fase Seedling",
      items: [
        { name: "Pupuk NPK Starter (16-16-16)", dose: "50 kg/ha", interval: "Saat tanam", note: "Untuk pertumbuhan akar awal" },
        { name: "Pupuk Urea", dose: "25 kg/ha", interval: "7 hari setelah tanam", note: "Stimulus pertumbuhan daun" },
        { name: "Pupuk Organik/Kompos", dose: "2 ton/ha", interval: "Sebelum tanam", note: "Perbaikan struktur tanah" },
      ],
    },
    irrigation: {
      title: "💧 Irigasi untuk Fase Seedling",
      items: [
        { name: "Frekuensi Penyiraman", value: "2x sehari (pagi & sore)" },
        { name: "Volume Air", value: "3–5 liter/m²/hari" },
        { name: "Metode", value: "Siram merata, hindari genangan" },
        { name: "Kelembaban Tanah", value: "Jaga 60–70% kapasitas lapang" },
      ],
    },
  },
  growing: {
    fertilizer: {
      title: "💊 Pupuk untuk Fase Growing",
      items: [
        { name: "Pupuk NPK Susulan (15-9-20)", dose: "100 kg/ha", interval: "30 HST", note: "Untuk pertumbuhan vegetatif" },
        { name: "Pupuk KCl", dose: "50 kg/ha", interval: "45 HST", note: "Memperkuat batang" },
        { name: "Pupuk Daun (Gandasil D)", dose: "2 g/liter", interval: "Setiap 2 minggu", note: "Nutrisi daun optimal" },
      ],
    },
    irrigation: {
      title: "💧 Irigasi untuk Fase Growing",
      items: [
        { name: "Frekuensi Penyiraman", value: "1x sehari atau sesuai kondisi" },
        { name: "Volume Air", value: "5–8 liter/m²/hari" },
        { name: "Metode", value: "Irigasi tetes atau alur" },
        { name: "Kelembaban Tanah", value: "Jaga 70–80% kapasitas lapang" },
      ],
    },
  },
  harvest: {
    fertilizer: {
      title: "💊 Pupuk untuk Fase Harvest",
      items: [
        { name: "Pupuk Kalium (K2SO4)", dose: "75 kg/ha", interval: "2 minggu sebelum panen", note: "Meningkatkan kualitas hasil" },
        { name: "Pupuk Boron", dose: "1 kg/ha", interval: "10 hari sebelum panen", note: "Pematangan sempurna" },
        { name: "Hindari Nitrogen berlebih", dose: "-", interval: "-", note: "Dapat menurunkan kualitas panen" },
      ],
    },
    irrigation: {
      title: "💧 Irigasi untuk Fase Harvest",
      items: [
        { name: "Frekuensi Penyiraman", value: "Kurangi 1–2 minggu sebelum panen" },
        { name: "Volume Air", value: "2–3 liter/m²/hari" },
        { name: "Metode", value: "Irigasi minimal, biarkan tanah agak kering" },
        { name: "Kelembaban Tanah", value: "Turunkan ke 40–50%" },
      ],
    },
  },
};

const SICK_RECS = [
  { icon: "🔬", title: "Identifikasi Penyakit", desc: "Periksa gejala: bercak daun, layu, perubahan warna. Konsultasikan dengan penyuluh pertanian." },
  { icon: "🧪", title: "Fungisida / Pestisida", desc: "Gunakan fungisida berbahan aktif Mankozeb atau Klorotalonil untuk penyakit jamur. Ikuti dosis anjuran." },
  { icon: "🌿", title: "Karantina Tanaman Sakit", desc: "Pisahkan tanaman sakit dari yang sehat untuk mencegah penyebaran penyakit." },
  { icon: "💧", title: "Atur Kelembaban", desc: "Pastikan drainase baik. Kelembaban berlebih mempercepat penyebaran jamur dan bakteri." },
  { icon: "🧹", title: "Sanitasi Lahan", desc: "Buang bagian tanaman sakit dan bakar. Bersihkan alat pertanian setelah dipakai." },
];

export default function Recommendations() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    API.get("/farms").then((res) => setFarms(res.data.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedFarm) { setCrops([]); setSelectedCrop(null); return; }
    API.get(`/crops/${selectedFarm}`).then((res) => {
      setCrops(res.data.data || []);
      setSelectedCrop(null);
    }).catch(console.error);
  }, [selectedFarm]);

  const rec = selectedCrop ? RECS[selectedCrop.stage] : null;
  const isSick = selectedCrop?.healthStatus === "sick";

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>💡 Rekomendasi Pertanian</h2>
          <p>Panduan pemupukan dan irigasi berdasarkan kondisi tanaman</p>
        </div>

        {/* SELECTOR */}
        <div className="ag-form-card">
          <div className="ag-form-title">🔍 Pilih Tanaman untuk Rekomendasi</div>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="ag-label">Pilih Farm</label>
              <select className="ag-input" value={selectedFarm} onChange={(e) => setSelectedFarm(e.target.value)}>
                <option value="">-- Pilih Farm --</option>
                {farms.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="ag-label">Pilih Tanaman</label>
              <select className="ag-input" value={selectedCrop?._id || ""} onChange={(e) => setSelectedCrop(crops.find((c) => c._id === e.target.value) || null)} disabled={!selectedFarm}>
                <option value="">-- Pilih Tanaman --</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.stage}) {c.healthStatus === "sick" ? "🚨" : "✅"}</option>
                ))}
              </select>
            </div>
            {selectedCrop && (
              <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ background: "#f4f6f4", borderRadius: 10, padding: "10px 16px", fontSize: 13, width: "100%" }}>
                  <div style={{ fontWeight: 600, color: "#1a2e1c", marginBottom: 4 }}>{selectedCrop.name}</div>
                  <div style={{ color: "#6c7a6d" }}>Stage: <strong style={{ color: "#0d6efd" }}>{selectedCrop.stage}</strong></div>
                  <div style={{ color: "#6c7a6d" }}>Status: <strong style={{ color: isSick ? "#dc3545" : "#1a7a2e" }}>{isSick ? "🚨 Sakit" : "✅ Sehat"}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DEFAULT STATE */}
        {!selectedCrop && (
          <div className="ag-card">
            <div className="ag-card-body">
              <div className="ag-empty">
                <div className="empty-icon">💡</div>
                <p>Pilih farm dan tanaman untuk melihat rekomendasi pemupukan dan irigasi</p>
              </div>
            </div>
          </div>
        )}

        {/* SICK RECOMMENDATIONS */}
        {selectedCrop && isSick && (
          <div style={{ marginBottom: 20 }}>
            <div className="ag-alert ag-alert-danger">
              <span style={{ fontSize: 20 }}>🚨</span>
              <strong>Tanaman ini dalam kondisi sakit! Segera lakukan penanganan berikut:</strong>
            </div>
            <div className="row g-3">
              {SICK_RECS.map((r) => (
                <div className="col-md-6" key={r.title}>
                  <div className="rec-card">
                    <h6>{r.icon} {r.title}</h6>
                    <p>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FERTILIZER & IRRIGATION */}
        {rec && (
          <div className="row g-3">
            {/* FERTILIZER */}
            <div className="col-lg-6">
              <div className="ag-card">
                <div className="ag-card-header">
                  <div className="ag-card-title"><span className="dot" style={{ background: "#c9a84c" }}></span>{rec.fertilizer.title}</div>
                </div>
                <div className="ag-card-body" style={{ padding: 0 }}>
                  <table className="ag-table">
                    <thead>
                      <tr>
                        <th>Jenis Pupuk</th>
                        <th>Dosis</th>
                        <th>Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rec.fertilizer.items.map((item) => (
                        <tr key={item.name}>
                          <td>
                            <div style={{ fontWeight: 600, color: "#1a2e1c" }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: "#7a8a7b" }}>{item.note}</div>
                          </td>
                          <td><span className="ag-badge ag-badge-yellow">{item.dose}</span></td>
                          <td style={{ fontSize: 13, color: "#5a6a5b" }}>{item.interval}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* IRRIGATION */}
            <div className="col-lg-6">
              <div className="ag-card">
                <div className="ag-card-header">
                  <div className="ag-card-title"><span className="dot" style={{ background: "#0dcaf0" }}></span>{rec.irrigation.title}</div>
                </div>
                <div className="ag-card-body">
                  {rec.irrigation.items.map((item) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #f0f4f0" }}>
                      <span style={{ color: "#6c7a6d", fontSize: 14 }}>{item.name}</span>
                      <span style={{ fontWeight: 600, color: "#1a2e1c", fontSize: 14, textAlign: "right", maxWidth: "55%" }}>{item.value}</span>
                    </div>
                  ))}

                  {/* Irrigation tip */}
                  <div style={{ marginTop: 16, background: "#e8f5eb", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1a4a20" }}>
                    💡 <strong>Tips:</strong> Lakukan penyiraman di pagi hari sebelum pukul 09.00 atau sore setelah pukul 16.00 untuk efisiensi terbaik.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
