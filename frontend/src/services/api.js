import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export async function parseResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/parse-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function matchResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const { data } = await apiClient.post("/match", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


