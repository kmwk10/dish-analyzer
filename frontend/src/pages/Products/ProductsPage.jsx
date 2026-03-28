import { Card, Box, Input, Button, Select, useOutsideClick, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect, useContext, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heading } from "@chakra-ui/react";

import { toNumber } from "../../utils/number";
import {
  searchProducts,
  deleteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";
import { AuthContext } from "../../context/AuthContext";

import ToggleCards from "../../components/ToggleCards";
const ProductsList = lazy(() => import("./ProductsList"));
const ProductCard = lazy(() => import("./ProductCard"));
const ProductEditor = lazy(() => import("./ProductEditor"));
const Pagination = lazy(() => import("../../components/Pagination"));

export default function ProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUserId, userRole } = useContext(AuthContext);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [desc, setDesc] = useState(true);

  const [selectedSection, setSelectedSection] = useState(
    isAuthenticated ? "Мои продукты" : "Все продукты"
  );

  const [page, setPage] = useState(1);
  const limit = 10;

  const cardRef = useRef();
  const editRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchFavorites() {
      try {
        const favProducts = await getFavoriteProducts();
        setFavoriteProducts(favProducts);
      } catch {
        navigate("/auth");
      }
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchData() {
      const offset = (page - 1) * limit;

      if (selectedSection === "Мои продукты") {
        setProducts(favoriteProducts.slice(offset, offset + limit));
      } else {
        const queryTrimmed = debouncedQuery.trim();
        const min = minCalories ? Number(minCalories) : undefined;
        const max = maxCalories ? Number(maxCalories) : undefined;

        const data = await searchProducts({
          query: queryTrimmed || undefined,
          min_calories: min,
          max_calories: max,
          offset,
          limit,
          desc
        });

        setProducts(data);
      }
    }

    fetchData();
  }, [selectedSection, favoriteProducts, debouncedQuery, minCalories, maxCalories, page, desc]);

  useOutsideClick({ ref: cardRef, handler: () => setSelectedProduct(null) });
  useOutsideClick({ ref: editRef, handler: () => setEditingProduct(null) });

  async function handleSaveProduct(product) {
    if (!product) return setEditingProduct(null);

    try {
      const payload = {
        ...product,
        calories: toNumber(product.calories),
        protein: toNumber(product.protein),
        fat: toNumber(product.fat),
        carbs: toNumber(product.carbs)
      };
      const savedProduct = await saveProduct(payload, currentUserId);

      setFavoriteProducts(prev => [savedProduct, ...prev.filter(p => p.id !== product.id && p.id !== savedProduct.id)]);
      setProducts(prev => [...prev.filter(p => p.id !== product.id), savedProduct]);

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

  function handleSearchChange(value) {
    setSearchQuery(value);
    setPage(1);
    if (value.trim() && selectedSection === "Мои продукты") {
      setSelectedSection("Все продукты");
    }
  }

  function handleMinCaloriesChange(value) {
    setMinCalories(value);
    setPage(1);
    if (value && selectedSection === "Мои продукты") {
      setSelectedSection("Все продукты");
    }
  }

  function handleMaxCaloriesChange(value) {
    setMaxCalories(value);
    setPage(1);
    if (value && selectedSection === "Мои продукты") {
      setSelectedSection("Все продукты");
    }
  }

  function handleSortChange(value) {
    setDesc(value === "desc");
    setPage(1);
  }

  function handleSectionChange(option) {
    if (option === "Мои продукты" && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (option === "Мои продукты") {
      setSearchQuery("");
      setMinCalories("");
      setMaxCalories("");
    }
    setSelectedSection(option);
    setPage(1);
  }

  return (
    <Box margin="2vh 10vw">
      <Helmet>
        <title>КБЖУ продуктов</title>
        <meta name="description" content="Список продуктов с калорийностью и пищевой ценностью (БЖУ)" />
        <link rel="canonical" href={`${window.location.origin}/products`} />

        <meta property="og:title" content="КБЖУ продуктов" />
        <meta property="og:description" content="Список продуктов с КБЖУ" />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": products.map(product => ({
              "@type": "Product",
              "name": product.name,
              "nutrition": {
                "@type": "NutritionInformation",
                "calories": `${product.calories} kcal`,
                "proteinContent": `${product.protein} g`,
                "fatContent": `${product.fat} g`,
                "carbohydrateContent": `${product.carbs} g`
              }
            }))
          })}
        </script>
      </Helmet>

      <Heading as="h1" position="absolute" left="-9999px">
        Список продуктов с КБЖУ
      </Heading>

      <ToggleCards
        option1="Мои продукты"
        option2="Все продукты"
        value={selectedSection}
        onChange={handleSectionChange}
      />

      <Input
        size="lg"
        placeholder="Введите название продукта"
        background="white"
        marginBottom="1.5vh"
        value={searchQuery}
        onChange={e => handleSearchChange(e.target.value)}
      />

    <Box display="flex" gap="1rem" marginBottom="3vh">
      {selectedSection === "Все продукты" && (
        <>
          <InputGroup width="7rem">
            <Input
              type="number"
              placeholder="Мин."
              value={minCalories}
              onChange={e => handleMinCaloriesChange(e.target.value)}
              pr="3rem"
              background="white"
            />
            <InputRightElement children="ккал" mr="0.5rem"/>
          </InputGroup>
          <InputGroup width="7rem">
            <Input
              type="number"
              placeholder="Макс."
              value={maxCalories}
              onChange={e => handleMaxCaloriesChange(e.target.value)}
              pr="3rem"
              background="white"
            />
            <InputRightElement children="ккал" mr="0.5rem"/>
          </InputGroup>

          <Select
            w="11rem"
            background="white"
            value={desc ? "desc" : "asc"}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </Select>
        </>
      )}
    </Box>

      <Button
        size="md"
        leftIcon={<SmallAddIcon />}
        height="3rem"
        colorScheme="purple"
        marginBottom="3vh"
        onClick={() => {
          if (!isAuthenticated) return navigate("/auth");
          setEditingProduct({ name: "", calories: "", protein: "", fat: "", carbs: "" });
        }}
      >
        Добавить продукт
      </Button>

      <Suspense fallback={<Card padding="3vh" backgroundColor="#ECECEC">Загрузка...</Card>}>
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
      </Suspense>

      <Suspense fallback={null}>
        <Pagination page={page} setPage={setPage} itemsLength={products.length} limit={limit} />
      </Suspense>

      <Suspense fallback={null}>
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
      </Suspense>

      <Suspense fallback={null}>
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
      </Suspense>
    </Box>
  );
}
