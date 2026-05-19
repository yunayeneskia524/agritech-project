import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Email dan password wajib diisi!");
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return alert("Semua field wajib diisi!");
    try {
      setLoading(true);
      await API.post("/auth/register", { name, email, password });
      alert("Registrasi berhasil! Silakan login.");
      setTab("login");
      setName("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d3b15 0%, #1a7a2e 50%, #2ecc71 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 16px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px", border: "1px solid rgba(255,255,255,0.2)" }}>🌾</div>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 700, margin: 0 }}>AgriTech</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: "4px 0 0" }}>Platform Smart Farming</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 20, padding: "32px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#f4f6f4", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: tab === t ? "#1a7a2e" : "transparent", color: tab === t ? "white" : "#6c7a6d" }}>
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5a6a5b", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Email</label>
                <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde4dd", borderRadius: 8, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", color: "#1a2e1c" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5a6a5b", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde4dd", borderRadius: 8, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", color: "#1a2e1c" }} />
              </div>
              <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "12px", background: "#1a7a2e", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer" }}>
                {loading ? "Loading..." : "Masuk"}
              </button>
            </div>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <div>
              {[["Nama Lengkap", "text", "Nama kamu", name, setName], ["Email", "email", "email@example.com", email, setEmail], ["Password", "password", "Min. 6 karakter", password, setPassword]].map(([label, type, ph, val, setter]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5a6a5b", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>{label}</label>
                  <input type={type} placeholder={ph} value={val} onChange={(e) => setter(e.target.value)} style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde4dd", borderRadius: 8, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", color: "#1a2e1c" }} />
                </div>
              ))}
              <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "12px", background: "#1a7a2e", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer", marginTop: 8 }}>
                {loading ? "Loading..." : "Daftar Sekarang"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
