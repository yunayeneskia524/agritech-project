const axios = require("axios");

exports.getWeather = async (req, res) => {
  try {
    const city = req.query.city || "Medan";
    const lat = req.query.lat;
    const lon = req.query.lon;
    const apiKey = process.env.WEATHER_API_KEY;

    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    }

    const response = await axios.get(url);

    const data = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };

    res.json({ success: true, data });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ success: false, message: "Kota tidak ditemukan" });
    }
    res.status(500).json({ success: false, message: "Gagal mengambil data cuaca" });
  }
};
