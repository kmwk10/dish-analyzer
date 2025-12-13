import api from "./client";

export async function getUserInfo() {
  const response = await api.get("/user/me");
  return response.data;
}

export async function updateUserInfo(data) {
  const response = await api.put("/user/me", data);
  return response.data;
}

export async function updateUserPassword(data) {
  const response = await api.put("/user/me/password", data);
  return response.data;
}
