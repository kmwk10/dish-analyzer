import api from "./client";


export async function listProducts(skip = 0, limit = 100) {
  const response = await api.get("/product/", { params: { skip, limit } });
  return response.data;
}

export async function searchProducts(query) {
  const response = await api.get("/product/search/", { params: { query } });
  return response.data;
}

export async function createProduct(data) {
  const response = await api.post("/product/", data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await api.put(`/product/${id}`, data);
  return response.data;
}


export async function getFavoriteProducts() {
  const response = await api.get("/user/me/favorites/products/");
  return response.data;
}

export async function addFavoriteProduct(productId) {
  const response = await api.post(`/user/me/favorites/products/${productId}`);
  return response.data;
}

export async function removeFavoriteProduct(productId) {
  const response = await api.delete(`/user/me/favorites/products/${productId}`);
  return response.data;
}


export async function copyProduct(product) {
  const { id, created_by, ...data } = product;
  return await createProduct(data);
}

export async function saveProduct(product, currentUserId) {
  if (!product.id) {
    const newProduct = await createProduct(product); 
    await addFavoriteProduct(newProduct.id);
    return newProduct;
  }

  if (product.created_by !== currentUserId) {
    const copiedProduct = await copyProduct(product);
    await addFavoriteProduct(copiedProduct.id);
    await removeFavoriteProduct(product.id);
    return copiedProduct;
  } else {
    return await updateProduct(product.id, product);
  }
}
