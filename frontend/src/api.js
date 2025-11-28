import axios from "axios";

export function api() {
  return axios.create({
    baseURL: "http://localhost:5000/api", // ✅ Correct base for ALL requests
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
}
