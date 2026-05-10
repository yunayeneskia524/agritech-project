import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState({ totalFarms: 0, totalCrops: 0, healthyCrops: 0, sickCrops: 0 });
  const [weather, setWeather] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [loading, setLoading] = useState(true);

  const COLORS = ["#1a7a2e", "#dc3545"];
  const healthyRate = data.totalCrops ? Math.round((data.healthyCrops / data.totalCrops) * 100) : 0;
  const chartData = [
    { name: "Healthy", value: data.healthyCrops || 0 },
    { name: "Sick", value: data.sickCrops || 0 },
  ];

  const fetchWeather = async (city) => {
    try {
      setWeatherLoading(true);
      setWeatherError("");
      const res = await API.get(`/weather?city=${encodeURIComponent(city)}`);
      setWeather(res.data.data);
    } catch (err) {
      setWeatherError(err.response?.data?.message || "Kota tidak ditemukan");
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const dashRes = await API.get("/dashboard");
        setData(dashRes.data.data || {});
        await fetchWeather("Medan");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}>
      <div className="spinner-border text-success" />
      <p style={{ color: "#6c7a6d", fontSize: 14 }}>Memuat dashboard...</p>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="ag-page">
        <div className="ag-page-header">
          <h2>📊 Farm Dashboard</h2>
          <p>Selamat datang, <strong>{user.name || "Farmer"}</strong> 👨‍🌾</p>
        </div>

        {/* ALERTS */}
        {data.sickCrops > 0 && (
          <div className="ag-alert ag-alert-danger">
            <span style={{ fontSize: 20 }}>🚨</span>
            <div><strong>{data.sickCrops} tanaman sakit</strong> terdeteksi!{" "}<Link to="/crops" style={{ color: "#c0392b", fontWeight: 600 }}>Tangani sekarang →</Link></div>
          </div>
        )}
        {healthyRate < 70 && data.totalCrops > 0 && (
          <div className="ag-alert ag-alert-warning">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div><strong>Tingkat kesehatan rendah ({healthyRate}%)</strong>.{" "}<Link to="/recommendations" style={{ color: "#7a5c00", fontWeight: 600 }}>Lihat rekomendasi →</Link></div>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="row g-3 mb-4">
          {[
            { color: "green", icon: "🏡", label: "Total Farms", value: data.totalFarms || 0 },
            { color: "blue", icon: "🌱", label: "Total Crops", value: data.totalCrops || 0 },
            { color: "teal", icon: "✅", label: "Tanaman Sehat", value: data.healthyCrops || 0 },
            { color: "red", icon: "🚨", label: "Tanaman Sakit", value: data.sickCrops || 0 },
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

        <div className="row g-3 mb-4">
          {/* WEATHER */}
          <div className="col-lg-5">
            <div className="weather-widget" style={{ height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>🌦️ Cuaca Saat Ini</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{weather?.city || "Medan"}{weather?.country ? `, ${weather.country}` : ""}</div>
                </div>
                {weather?.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" width={52} />}
              </div>

              {weatherLoading ? <p style={{ opacity: 0.8 }}>Memuat...</p> : weather ? (
                <>
                  <div className="weather-temp">{weather.temperature}°C</div>
                  <div className="weather-desc">{weather.description}</div>
                  <div className="weather-meta">
                    <div className="weather-meta-item">💧 {weather.humidity}%</div>
                    <div className="weather-meta-item">💨 {weather.wind} m/s</div>
                    <div className="weather-meta-item">🌡️ Terasa {weather.feelsLike}°C</div>
                  </div>
                </>
              ) : <p style={{ opacity: 0.8 }}>{weatherError || "Data tidak tersedia"}</p>}

              <form onSubmit={(e) => { e.preventDefault(); if (cityInput.trim()) fetchWeather(cityInput.trim()); }} style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <input value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="Cari kota lain..." style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                <button type="submit" style={{ padding: "8px 14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cari</button>
              </form>
              {weatherError && <p style={{ color: "#ffe0e0", fontSize: 12, marginTop: 6 }}>{weatherError}</p>}
            </div>
          </div>

          {/* INSIGHT */}
          <div className="col-lg-4">
            <div className="ag-card" style={{ height: "100%" }}>
              <div className="ag-card-header"><div className="ag-card-title"><span className="dot"></span>Farm Insight</div></div>
              <div className="ag-card-body">
                {[["Total Farms", data.totalFarms||0], ["Total Crops", data.totalCrops||0], ["Sehat", data.healthyCrops||0], ["Sakit", data.sickCrops||0]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f4f0", fontSize: 14 }}>
                    <span style={{ color: "#6c7a6d" }}>{k}</span>
                    <span style={{ fontWeight: 700, color: "#1a2e1c" }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "#6c7a6d" }}>Tingkat Kesehatan</span>
                    <span style={{ fontWeight: 700, color: healthyRate >= 70 ? "#1a7a2e" : "#dc3545" }}>{healthyRate}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f0f4f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${healthyRate}%`, background: healthyRate >= 70 ? "#1a7a2e" : "#dc3545", borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="col-lg-3">
            <div className="ag-card" style={{ height: "100%" }}>
              <div className="ag-card-header"><div className="ag-card-title"><span className="dot"></span>Health Chart</div></div>
              <div className="ag-card-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {data.totalCrops === 0 ? (
                  <div className="ag-empty"><div className="empty-icon">🌱</div><p>Belum ada data</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={65} label>
                        {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="row g-3">
          {[
            { to: "/farms", icon: "🏡", title: "Manage Farms", desc: "Tambah, edit, dan hapus farm", color: "#1a7a2e" },
            { to: "/crops", icon: "🌱", title: "Manage Crops", desc: "Monitor dan kelola tanaman", color: "#0d6efd" },
            { to: "/recommendations", icon: "💡", title: "Rekomendasi", desc: "Pupuk & irigasi berdasarkan kondisi", color: "#c9a84c" },
          ].map((q) => (
            <div className="col-md-4" key={q.to}>
              <div className="ag-card" style={{ cursor: "pointer" }} onClick={() => navigate(q.to)}>
                <div className="ag-card-body" style={{ textAlign: "center", padding: "24px" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{q.icon}</div>
                  <h6 style={{ fontSize: 15, fontWeight: 700, color: "#1a2e1c", marginBottom: 6 }}>{q.title}</h6>
                  <p style={{ fontSize: 13, color: "#6c7a6d", marginBottom: 16 }}>{q.desc}</p>
                  <span style={{ display: "inline-block", padding: "7px 20px", background: q.color, color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Buka →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
