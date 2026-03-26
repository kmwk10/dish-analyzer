import { Card, Box, Input, Button, useOutsideClick, Flex } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect, useContext  } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toNumber } from "../../utils/number";
import {
  listProducts,
  searchProducts,
  deleteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";
import {
  getDish,
  deleteDish,
  getDishProducts,
  saveDish,
  updateDishProducts,
  removeFavoriteDish
} from "../../api/dishes";
import { AuthContext } from "../../context/AuthContext";

import EditorDishCard from "./EditorDishCard";
import EditorProductsList from "./EditorProductsList";
import ProductEditor from "../Products/ProductEditor";
import ToggleCards from "../../components/ToggleCards";
import Pagination from "../../components/Pagination";

export default function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUserId } = useContext(AuthContext);

  const isNew = id === "new";
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dish, setDish] = useState({});
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [editingProduct, setEditingProduct] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);
  const [productWeights, setProductWeights] = useState({});
  const [page, setPage] = useState(1);
  const limit = 8;

  const editRef = useRef();

  useEffect(() => {
    async function fetchFavorites() {
      const favProducts = await getFavoriteProducts();
      setFavoriteProducts(favProducts);
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const offset = (page - 1) * limit;

      if (selectedSection === "Мои продукты") {
        setProducts(favoriteProducts.slice(offset, offset + limit));
      } else {
        const queryTrimmed = searchQuery.trim() || undefined;
        const data = await searchProducts({ query: queryTrimmed, offset, limit });
        setProducts(data);
      }
    }
    fetchProducts();
  }, [selectedSection, searchQuery, favoriteProducts, page]);

  useOutsideClick({
    ref: editRef,
    handler: () => setEditingProduct(null),
  });

  async function handleSaveProduct(product) {
    if (!product) return setEditingProduct(null);

    try {
      const payload = {
        ...product,
        calories: toNumber(product.calories),
        protein: toNumber(product.protein),
        fat: toNumber(product.fat),
        carbs: toNumber(product.carbs),
      };

      const savedProduct = await saveProduct(payload, currentUserId);

      setFavoriteProducts(prev => [savedProduct, ...prev.filter(p => p.id !== savedProduct.id)]);
      setProducts(prev => [savedProduct, ...prev.filter(p => p.id !== savedProduct.id)]);

      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveFavProduct(productId) {
    try {
      await removeFavoriteProduct(productId);
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      if (editingProduct?.id === productId) setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteDish(dishId) {
    try {
      await deleteDish(dishId);
      navigate("/dishes");
    } catch (err) {
      console.error("Не удалось удалить блюдо:", err);
    }
  }

  async function handleDeleteProduct(productId) {
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      if (editingProduct?.id === productId) setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!isNew) {
      async function fetchDish() {
        try {
          const data = await getDish(id);
          const dishProducts = await getDishProducts(id);
          const allProducts = await listProducts();

          const localProds = dishProducts.map(p => {
            const productInfo = allProducts.find(prod => prod.id === p.product_id);
            return { id: p.product_id, name: productInfo?.name, weight: p.weight };
          });

          const weights = {};
          localProds.forEach(p => { weights[p.id] = p.weight; });

          setDish({ ...data, products: localProds });
          setLocalProducts(localProds);
          setProductWeights(weights);
        } catch (err) {
          console.error("Не удалось загрузить блюдо", err);
        }
      }
      fetchDish();
    }
  }, [id, isNew]);

  const handleWeightChange = (id, value) => {
    setProductWeights(prev => ({ ...prev, [id]: value }));
  };

  const handleRemoveProduct = (id) => {
    setLocalProducts(prev => prev.filter(p => p.id !== id));
    setProductWeights(prev => { const newWeights = { ...prev }; delete newWeights[id]; return newWeights; });
  };

  const handleAddProduct = (product) => {
    setLocalProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [{ id: product.id, name: product.name, weight: "" }, ...prev];
    });
    setProductWeights(prev => ({ ...prev, [product.id]: "" }));
  };

  const handleSaveDish = async (formData) => {
    try {
      const dishPayload = {
        id: dish?.id,
        created_by: dish?.created_by,
        name: formData.name,
        recipe: formData.recipe || null,
        weight: toNumber(formData.weight),
        servings: formData.servings ? toNumber(formData.servings) : null,
        calories: toNumber(formData.calories),
        protein: toNumber(formData.protein),
        fat: toNumber(formData.fat),
        carbs: toNumber(formData.carbs),
      };

      const savedDish = await saveDish(dishPayload, currentUserId);

      const productsPayload = localProducts.map(p => ({
        product_id: p.id,
        weight: toNumber(productWeights[p.id]),
      }));

      await updateDishProducts(savedDish.id, productsPayload);

      setDish({ ...savedDish, products: localProducts.map(p => ({ id: p.id, weight: productWeights[p.id], name: p.name })) });
      navigate("/dishes");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavDish = async (dishId) => {
    try {
      await removeFavoriteDish(dishId);
      navigate("/dishes");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
    if (value.trim() && selectedSection === "Мои продукты") {setSelectedSection("Все продукты")};
  };

  return (
    <Flex height="92vh" p="0 3vw">
      <Box flex="1" mr="1.5vw" m="3vh">
        <EditorDishCard
          dish={dish}
          localProducts={localProducts}
          productWeights={productWeights}
          handleWeightChange={handleWeightChange}
          handleRemoveProduct={handleRemoveProduct}
          onSave={handleSaveDish}
          onRemoveFavDish={handleRemoveFavDish}
          onDelete={handleDeleteDish}
          currentUserId={currentUserId}
        />
      </Box>

      <Box flex="2" ml="1.5vw">
        <ToggleCards
          size="sm"
          option1="Мои продукты"
          option2="Все продукты"
          value={selectedSection}
            onChange={option => {
              setSelectedSection(option);
              setPage(1);
              if (option === "Мои продукты") {
                setSearchQuery("");
              }
            }}
        />
        <Input
          size="lg"
          placeholder="Введите название продукта"
          background="white"
          marginBottom="1.5vh"
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
        />
        <Button size="sm"
          leftIcon={<SmallAddIcon/>}
          height="2.5rem"
          colorScheme="purple"
          marginBottom="3vh"
          onClick={() => setEditingProduct({ name: "", calories: "", protein: "", fat: "", carbs: "" })}
        >
          Добавить продукт
        </Button>

        {products.length > 0 ? (
          <>
            <EditorProductsList
              products={products}
              setEditingProduct={setEditingProduct}
              onAddProduct={handleAddProduct}
              favoriteProducts={favoriteProducts}
              setFavoriteProducts={setFavoriteProducts}
            />
            <Pagination page={page} setPage={setPage} itemsLength={products.length} limit={limit} />
          </>
        ) : (
          <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
            Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
          </Card>
        )}

        {editingProduct && (
          <ProductEditor
            ref={editRef}
            product={editingProduct}
            onSave={handleSaveProduct}
            onRemoveFavorite={handleRemoveFavProduct}
            onDelete={handleDeleteProduct}
            currentUserId={currentUserId}
          />
        )}
      </Box>
    </Flex>
  );
}
