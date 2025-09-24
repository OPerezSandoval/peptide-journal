import axios from "axios";

// Use Vite dev proxy in dev; fall back to env for prod/build.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

