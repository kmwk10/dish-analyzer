import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect  } from "react";

import { getUserInfo } from "../../api/user";
import { toNumber } from "../../utils/number";
import {
  listProducts,
  searchProducts,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";

import ToggleCards from "../../components/ToggleCards";
import ProductsList from "./ProductsList";
import ProductCard from "./ProductCard";
import ProductEditor from "./ProductEditor";

export default function ProductsPage() {
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const cardRef = useRef()
  const editRef = useRef();

  useEffect(() => {
    async function fetchUserAndFavorites() {
      const user = await getUserInfo();
      setCurrentUserId(user.id);

      const favProducts = await getFavoriteProducts();
      setFavoriteProducts(favProducts);
    }
    fetchUserAndFavorites();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (selectedSection === "Мои продукты") {
        setProducts(favoriteProducts);
      } else {
        const all = await listProducts();
        setProducts(all);
      }
    }
    fetchProducts();
  }, [selectedSection, favoriteProducts]);

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedProduct(null),
  });

  useOutsideClick({
    ref: editRef,
    handler: () => setEditingProduct(null),
  });

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

  async function handleDeleteProduct(productId) {
    try {
      await removeFavoriteProduct(productId);
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));

      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }

      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои продукты"} option2={"Все продукты"} onChange={setSelectedSection}/>
      <Input
        size="lg"
        placeholder="Введите название продукта"
        background="white"
        marginBottom="3vh"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const query = searchQuery.trim();

            if (selectedSection === "Мои продукты") {
              if (!query) {
                setProducts(favoriteProducts);
              } else {
                const filtered = favoriteProducts.filter(p =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                );
                setProducts(filtered);
              }
            } else {
              if (!query) {
                listProducts().then(setProducts);
              } else {
                searchProducts(query).then(setProducts);
              }
            }
          }
        }}
      />
      <Button
        size="md"
        leftIcon={<SmallAddIcon/>}
        height="3rem"
        colorScheme="purple"
        marginBottom="3vh"
        onClick={() =>
          setEditingProduct({
            name: "",
            calories: "",
            protein: "",
            fat: "",
            carbs: "",
          })
        }
      >
        Добавить продукт
      </Button>
      {products.length > 0 ? (
        <ProductsList
          products={products}
          setSelectedProduct={setSelectedProduct}
          setEditingProduct={setEditingProduct}
          favoriteProducts={favoriteProducts}
          setFavoriteProducts={setFavoriteProducts}
          currentUserId={currentUserId}
        />
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
        </Card>
      )}
      {selectedProduct && (
        <ProductCard
          ref={cardRef}
          product={selectedProduct}
          onEdit={() => {
            setEditingProduct(selectedProduct);
            setSelectedProduct(null);
          }}
        />
      )}
      {editingProduct && (
        <ProductEditor ref={editRef} product={editingProduct} onSave={handleSaveProduct} onDelete={handleDeleteProduct}/>
      )}
    </Box>
  );
}
