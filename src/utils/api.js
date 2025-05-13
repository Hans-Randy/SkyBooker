import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Changed to false since we don't need credentials
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchAirports = async () => {
  const response = await api.get("/api/airports");
  return response.data;
};

export const searchFlights = async (params = {}) => {
  const response = await api.get("/api/search-flights", { params });
  return response.data;
};

export const getAvailableSeats = async (flightId) => {
  const response = await api.get(`/api/flights/${flightId}/available-seats`);
  return response.data;
};

export const fetchPassengers = async () => {
  const response = await api.get("/api/passengers");
  return response.data;
};

export const createPassenger = async (passengerData) => {
  const response = await api.post("/api/passengers", passengerData);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/api/bookings", bookingData);
  return response.data;
};

export const fetchBookedFlights = async (passengerId) => {
  const response = await api.get("/api/booked-flights", {
    params: { passengerId },
  });
  return response.data;
};
