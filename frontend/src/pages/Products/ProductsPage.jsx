import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { toNumber } from "../../utils/number";
import {
  listProducts,
  searchProducts,
  deleteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";
import { AuthContext } from "../../context/AuthContext";

import ToggleCards from "../../components/ToggleCards";
import ProductsList from "./ProductsList";
import ProductCard from "./ProductCard";
import ProductEditor from "./ProductEditor";
import Pagination from "../../components/Pagination";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUserId, userRole } = useContext(AuthContext);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(isAuthenticated ? "Мои продукты" : "Все продукты");
  const [page, setPage] = useState(1);
  const limit = 10;

  const cardRef = useRef();
  const editRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchFavorites() {
      try {
        const favProducts = await getFavoriteProducts();
        setFavoriteProducts(favProducts);
      } catch (err) {
        console.error(err);
        navigate("/auth");
      }
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (selectedSection === "Мои продукты") {
          const start = (page - 1) * limit;
          setProducts(favoriteProducts.slice(start, start + limit));
        } else {
          const offset = (page - 1) * limit;
          let data;
          if (!searchQuery.trim()) {
            data = await listProducts({ offset, limit });
          } else {
            data = await searchProducts({ query: searchQuery.trim(), offset, limit });
          }
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, [selectedSection, favoriteProducts, page, searchQuery]);

  useOutsideClick({ ref: cardRef, handler: () => setSelectedProduct(null) });
  useOutsideClick({ ref: editRef, handler: () => setEditingProduct(null) });

  async function handleSaveProduct(product) {
    if (!product) {
      setEditingProduct(null);
      return;
    }
    try {
      const payload = {
        ...product,
        calories: toNumber(product.calories),
        protein: toNumber(product.protein),
        fat: toNumber(product.fat),
        carbs: toNumber(product.carbs),
      };
      const savedProduct = await saveProduct(payload, currentUserId);

      setFavoriteProducts(prev => {
        const filtered = prev.filter(p => p.id !== savedProduct.id && p.id !== product.id);
        return [...filtered, savedProduct];
      });

      setProducts(prev => {
        const filtered = prev.filter(p => p.id !== product.id);
        return [...filtered, savedProduct];
      });

      setSelectedProduct(savedProduct);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveFavorite(productId) {
    try {
      await removeFavoriteProduct(productId);
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      if (editingProduct?.id === productId) setEditingProduct(null);
      if (selectedProduct?.id === productId) setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteProduct(productId) {
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      if (selectedProduct?.id === productId) setSelectedProduct(null);
      if (editingProduct?.id === productId) setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  const itemsLength = selectedSection === "Мои продукты" ? favoriteProducts.length : 10000; // для всех продуктов API подгружает по limit

  return (
    <Box margin="2vh 10vw">
      <ToggleCards
        option1="Мои продукты"
        option2="Все продукты"
        value={selectedSection}
        onChange={(option) => {
          if (option === "Мои продукты" && !isAuthenticated) {
            navigate("/auth");
            return;
          }
          setSelectedSection(option);
          setPage(1);
        }}
      />

      <Input
        size="lg"
        placeholder="Введите название продукта"
        background="white"
        marginBottom="3vh"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") setPage(1); }}
      />

      <Button
        size="md"
        leftIcon={<SmallAddIcon />}
        height="3rem"
        colorScheme="purple"
        marginBottom="3vh"
        onClick={() => {
          if (!isAuthenticated) {
            navigate("/auth");
            return;
          }
          setEditingProduct({ name: "", calories: "", protein: "", fat: "", carbs: "" });
        }}
      >
        Добавить продукт
      </Button>

      {products.length > 0 ? (
        <>
          <ProductsList
            products={products}
            setSelectedProduct={setSelectedProduct}
            setEditingProduct={setEditingProduct}
            favoriteProducts={favoriteProducts}
            setFavoriteProducts={setFavoriteProducts}
            currentUserId={currentUserId}
          />
          <Pagination
            page={page}
            setPage={setPage}
            itemsLength={products.length}
            limit={limit}
          />
        </>
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
        </Card>
      )}

      {selectedProduct && (
        <ProductCard
          ref={cardRef}
          product={selectedProduct}
          onEdit={() => { setEditingProduct(selectedProduct); setSelectedProduct(null); }}
          onRemoveFavorite={handleRemoveFavorite}
          onDelete={handleDeleteProduct}
          currentUserId={currentUserId}
          isAdmin={userRole === "admin"}
          isFavorite={favoriteProducts.some(fav => fav.id === selectedProduct.id)}
        />
      )}

      {editingProduct && (
        <ProductEditor
          ref={editRef}
          product={editingProduct}
          onSave={handleSaveProduct}
          onRemoveFavorite={handleRemoveFavorite}
          onDelete={handleDeleteProduct}
          currentUserId={currentUserId}
          isAdmin={userRole === "admin"}
        />
      )}
    </Box>
  );
}
