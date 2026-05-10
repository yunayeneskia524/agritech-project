import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1"
});

// REQUEST INTERCEPTOR (kirim token)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (handle error global)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      // Token expired / unauthorized
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting...");

        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;