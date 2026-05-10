import { useState } from "react";
import Navbar from "../components/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Static market price data (in real app, integrate with market API)
const COMMODITIES = [
  { name: "Padi (GKP)", unit: "kg", price: 5800, change: +120, trend: "up", region: "Sumatera Utara" },
  { name: "Jagung", unit: "kg", price: 4200, change: -80, trend: "down", region: "Sumatera Utara" },
  { name: "Kedelai", unit: "kg", price: 9500, change: +200, trend: "up", region: "Sumatera Utara" },
  { name: "Cabai Merah", unit: "kg", price: 42000, change: +5000, trend: "up", region: "Sumatera Utara" },
  { name: "Bawang Merah", unit: "kg", price: 35000, change: -2000, trend: "down", region: "Sumatera Utara" },
  { name: "Kentang", unit: "kg", price: 12000, change: +500, trend: "up", region: "Sumatera Utara" },
  { name: "Tomat", unit: "kg", price: 8000, change: -1000, trend: "down", region: "Sumatera Utara" },
  { name: "Singkong", unit: "kg", price: 2500, change: 0, trend: "stable", region: "Sumatera Utara" },
];

const CHART_DATA = {
  "Padi (GKP)": [
    { week: "Mg 1", harga: 5500 }, { week: "Mg 2", harga: 5600 }, { week: "Mg 3", harga: 5680 },
    { week: "Mg 4", harga: 5800 }, { week: "Mg 5", harga: 5750 }, { week: "Mg 6", harga: 5800 },
  ],
  "Jagung": [
    { week: "Mg 1", harga: 4500 }, { week: "Mg 2", harga: 4400 }, { week: "Mg 3", harga: 4350 },
    { week: "Mg 4", harga: 4280 }, { week: "Mg 5", harga: 4200 }, { week: "Mg 6", harga: 4200 },
  ],
  "Cabai Merah": [
    { week: "Mg 1", harga: 35000 }, { week: "Mg 2", harga: 37000 }, { week: "Mg 3", harga: 39000 },
    { week: "Mg 4", harga: 40000 }, { week: "Mg 5", harga: 41000 }, { week: "Mg 6", harga: 42000 },
  ],
};

export default function MarketPrice() {
  const [selected, setSelected] = useState("Padi (GKP)");
  const [search, setSearch] = useState("");

  const filtered = COMMODITIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const chartData = CHART_DATA[selected] || CHART_DATA["Padi (GKP)"];

  const trendIcon = (t) => t === "up" ? "📈" : t === "down" ? "📉" : "➡️";
  const trendColor = (t) => t === "up" ? "#1a7a2e" : t === "down" ? "#dc3545" : "#7a8a7b";

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>📊 Harga Pasar Komoditas</h2>
          <p>Pantau harga pasar terkini untuk komoditas pertanian di Sumatera Utara</p>
        </div>

        {/* INFO ALERT */}
        <div className="ag-alert ag-alert-success">
          <span>ℹ️</span>
          <div>Data harga diperbarui setiap hari. Klik nama komoditas untuk melihat grafik tren harga 6 minggu terakhir.</div>
        </div>

        <div className="row g-3">
          {/* PRICE TABLE */}
          <div className="col-lg-7">
            <div className="ag-card">
              <div className="ag-card-header">
                <div className="ag-card-title"><span className="dot"></span>Daftar Harga Komoditas</div>
                <input className="ag-input" placeholder="Cari komoditas..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 200, padding: "6px 12px", fontSize: 13 }} />
              </div>
              <table className="ag-table">
                <thead>
                  <tr><th>Komoditas</th><th>Harga / Kg</th><th>Perubahan</th><th>Trend</th></tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.name} onClick={() => setSelected(c.name)} style={{ cursor: "pointer", background: selected === c.name ? "#f0faf2" : "" }}>
                      <td>
                        <div style={{ fontWeight: 600, color: selected === c.name ? "#1a7a2e" : "#1a2e1c" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "#7a8a7b" }}>/{c.unit}</div>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 15, color: "#1a2e1c" }}>
                        Rp {c.price.toLocaleString("id-ID")}
                      </td>
                      <td style={{ fontWeight: 600, color: trendColor(c.trend) }}>
                        {c.change > 0 ? "+" : ""}{c.change !== 0 ? `Rp ${Math.abs(c.change).toLocaleString("id-ID")}` : "Stabil"}
                      </td>
                      <td style={{ fontSize: 18 }}>{trendIcon(c.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHART */}
          <div className="col-lg-5">
            <div className="ag-card" style={{ height: "100%" }}>
              <div className="ag-card-header">
                <div className="ag-card-title"><span className="dot"></span>Tren Harga — {selected}</div>
              </div>
              <div className="ag-card-body">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`Rp ${v.toLocaleString("id-ID")}`, "Harga"]} />
                    <Legend />
                    <Line type="monotone" dataKey="harga" stroke="#1a7a2e" strokeWidth={2.5} dot={{ fill: "#1a7a2e", r: 4 }} name="Harga (Rp)" />
                  </LineChart>
                </ResponsiveContainer>

                {/* INSIGHT */}
                <div style={{ marginTop: 16, background: "#f8faf8", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c", marginBottom: 8 }}>💡 Analisis Harga</div>
                  {(() => {
                    const data = chartData;
                    const first = data[0]?.harga;
                    const last = data[data.length-1]?.harga;
                    const diff = last - first;
                    const pct = ((diff / first) * 100).toFixed(1);
                    return (
                      <p style={{ fontSize: 13, color: "#5a6a5b", margin: 0 }}>
                        Harga <strong>{selected}</strong> dalam 6 minggu terakhir{" "}
                        {diff > 0 ? <span style={{ color: "#1a7a2e" }}>naik sebesar {pct}%</span> : diff < 0 ? <span style={{ color: "#dc3545" }}>turun sebesar {Math.abs(pct)}%</span> : <span>stabil</span>}.{" "}
                        Harga saat ini <strong>Rp {last?.toLocaleString("id-ID")}/kg</strong>.
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MARKET TIPS */}
        <div className="row g-3 mt-2">
          {[
            { icon: "📅", title: "Waktu Terbaik Jual", desc: "Padi: panen bulan Maret dan September biasanya harga lebih tinggi karena permintaan meningkat." },
            { icon: "🏪", title: "Pilih Pembeli Tepat", desc: "Bandingkan harga antara pengepul, Bulog, dan pasar tradisional sebelum menjual hasil panen." },
            { icon: "📦", title: "Simpan Saat Harga Rendah", desc: "Jika harga sedang turun, pertimbangkan menyimpan hasil panen untuk dijual saat harga pulih." },
          ].map((tip) => (
            <div className="col-md-4" key={tip.title}>
              <div className="rec-card">
                <h6>{tip.icon} {tip.title}</h6>
                <p>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
