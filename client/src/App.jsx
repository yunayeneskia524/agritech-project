import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Farm from "./pages/Farm";
import Crop from "./pages/Crop";
import Recommendations from "./pages/Recommendations";
import Admin from "./pages/Admin";
import Forum from "./pages/Forum";
import Market from "./pages/Market";
import ExpertAdvice from "./pages/ExpertAdvice";
import MarketPrice from "./pages/MarketPrice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/farms" element={<PrivateRoute><Farm /></PrivateRoute>} />
        <Route path="/crops" element={<PrivateRoute><Crop /></PrivateRoute>} />
        <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
        <Route path="/market-price" element={<PrivateRoute><MarketPrice /></PrivateRoute>} />
        <Route path="/market" element={<PrivateRoute><Market /></PrivateRoute>} />
        <Route path="/forum" element={<PrivateRoute><Forum /></PrivateRoute>} />
        <Route path="/expert" element={<PrivateRoute><ExpertAdvice /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
