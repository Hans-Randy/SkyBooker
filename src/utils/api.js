import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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
  const response = await api.get("/airports");
  return response.data;
};

export const searchFlights = async (params = {}) => {
  const response = await api.get("/search-flights", { params });
  return response.data;
};

export const getAvailableSeats = async (flightId) => {
  const response = await api.get(`/flights/${flightId}/available-seats`);
  return response.data;
};

export const fetchPassengers = async () => {
  const response = await api.get("/passengers");
  return response.data;
};

export const createPassenger = async (passengerData) => {
  const response = await api.post("/passengers", passengerData);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const fetchBookedFlights = async (passengerId) => {
  const response = await api.get("/booked-flights", {
    params: { passengerId },
  });
  return response.data;
};
