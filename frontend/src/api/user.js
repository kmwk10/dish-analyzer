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

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/user/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function getAvatar() {
  const { data } = await api.get("/user/me/avatar");
  return data.avatar_url;
}

export async function deleteAvatar() {
  const { data } = await api.delete("/user/me/avatar");
  return data;
}
