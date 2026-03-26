import api from "./client";

export async function listDishes(offset = 0, limit = 20) {
  const response = await api.get("/dish/", { params: { offset, limit } });
  return response.data;
}


export async function searchDishes({
  query,
  min_calories,
  max_calories,
  desc = false,
  offset = 0,
  limit = 20
}) {
  const response = await api.get("/dish/search/", {
    params: { query, min_calories, max_calories, desc, offset, limit }
  });
  return response.data;
}

export async function getDish(id) {
  const response = await api.get(`/dish/${id}`);
  return response.data;
}

export async function createDish(data) {
  const response = await api.post("/dish/", data);
  return response.data;
}

export async function updateDish(id, data) {
  const response = await api.put(`/dish/${id}`, data);
  return response.data;
}

export async function deleteDish(id) {
  const response = await api.delete(`/dish/${id}`);
  return response.data;
}


export async function getDishProducts(dishId) {
  const response = await api.get(`/dish/${dishId}/products/`);
  return response.data;
}

export async function updateDishProducts(dishId, products) {
  const response = await api.put(`/dish/${dishId}/products/`, products);
  return response.data;
}


export async function getFavoriteDishes() {
  const response = await api.get("/user/me/favorites/dishes/");
  return response.data;
}

export async function addFavoriteDish(dishId) {
  const response = await api.post(`/user/me/favorites/dishes/${dishId}`);
  return response.data;
}

export async function removeFavoriteDish(dishId) {
  const response = await api.delete(`/user/me/favorites/dishes/${dishId}`);
  return response.data;
}


export async function copyDish(dish) {
  const { id, created_by, ...data } = dish;
  return await createDish(data);
}

export async function saveDish(dish, currentUserId) {
  if (!dish.id) {
    const newDish = await createDish(dish);
    await addFavoriteDish(newDish.id);
    return newDish;
  }

  if (dish.created_by !== currentUserId) {
    const copiedDish = await copyDish(dish);
    await addFavoriteDish(copiedDish.id);
    await removeFavoriteDish(dish.id);
    return copiedDish;
  }

  return await updateDish(dish.id, dish);
}
