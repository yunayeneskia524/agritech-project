import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="ag-navbar">
      <Link to="/dashboard" className="brand">
        <div className="brand-icon">🌾</div>
        <span className="brand-name">AgriTech</span>
      </Link>

      <div className="nav-center">
        <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>📊 Dashboard</Link>
        <Link to="/farms" className={`nav-item ${isActive("/farms") ? "active" : ""}`}>🏡 Farms</Link>
        <Link to="/crops" className={`nav-item ${isActive("/crops") ? "active" : ""}`}>🌱 Crops</Link>
        <Link to="/recommendations" className={`nav-item ${isActive("/recommendations") ? "active" : ""}`}>💡 Rekomendasi</Link>
        <Link to="/market-price" className={`nav-item ${isActive("/market-price") ? "active" : ""}`}>📊 Harga Pasar</Link>
        <Link to="/market" className={`nav-item ${isActive("/market") ? "active" : ""}`}>🛒 Belanja</Link>
        <Link to="/forum" className={`nav-item ${isActive("/forum") ? "active" : ""}`}>💬 Forum</Link>
        <Link to="/expert" className={`nav-item ${isActive("/expert") ? "active" : ""}`}>🧑‍🌾 Ahli</Link>
        {user.role === "admin" && (
          <Link to="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>⚙️ Admin</Link>
        )}
      </div>

      <div className="nav-right">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{user.name || "Farmer"}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
