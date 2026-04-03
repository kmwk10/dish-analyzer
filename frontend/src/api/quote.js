import api from "./client";

export async function getQuote() {
  try {
    const response = await api.get("/external/quote");
    return response.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}
