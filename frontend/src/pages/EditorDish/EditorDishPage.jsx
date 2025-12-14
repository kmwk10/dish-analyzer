import { Card, Box, Input, Button, useOutsideClick, Flex } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect  } from "react";
import { useParams } from "react-router-dom";

import { getUserInfo } from "../../api/user";
import { toNumber } from "../../utils/number";
import {
  listProducts,
  searchProducts,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";

import EditorDishCard from "./EditorDishCard";
import EditorProductsList from "./EditorProductsList";
import ProductEditor from "../Products/ProductEditor";
import ToggleCards from "../../components/ToggleCards";


export default function EditorPage() {
  const { id } = useParams();
  
  const isNew = id === "new";
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dish, setDish] = useState({});
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [editingProduct, setEditingProduct] = useState(null);

  const editRef = useRef();

  useEffect(() => {
    async function fetchFavorites() {
      const favs = await getFavoriteProducts();
      setFavoriteProducts(favs);
    }
    fetchFavorites();
  }, []);

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

    } catch (err) {
      console.error(err);
    }
  }

  const productInDish1 = {
    "id": 1,
    "weight": 300
  }

  const productInDish2 = {
    "id": 2,
    "weight": 100
  }

  useEffect(() => {
    if (!isNew) {
      // имитация загрузки существующего блюда
      const fakeDish = {
        "name": "Творожная запеканка",
        "weight": 480,
        "calories": 117,
        "protein": 15,
        "fat": 2.5,
        "carbs": 10,
        "servings": 2,
        "products": [productInDish1, productInDish2],
        "recipe": "Смешайте 2 яйца, творог и муку.\nПерелейте получившееся тесто в форму.\nПоставьте запекаться в духовку при 180 градусах на 45 минут."
      };
      setDish(fakeDish);
    }
  }, [id]);

  const [localProducts, setLocalProducts] = useState([]);
  const [productWeights, setProductWeights] = useState({});

  useEffect(() => {
    if (!dish?.products) return;
    setLocalProducts(dish.products);

    const weights = {};
    dish.products.forEach(p => {
      weights[p.id] = p.weight;
    });
    setProductWeights(weights);
  }, [dish]);

  const handleWeightChange = (id, value) => {
    setProductWeights(prev => ({ ...prev, [id]: value }));
  };

  const handleRemoveProduct = (id) => {
    setLocalProducts(prev => prev.filter(p => p.id !== id));
    setProductWeights(prev => {
      const newWeights = { ...prev };
      delete newWeights[id];
      return newWeights;
    });
  };

  function handleAddProduct(product) {
    setLocalProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          weight: "",
        },
      ];
    });

    setProductWeights(prev => ({
      ...prev,
      [product.id]: "",
    }));
  }

  return (
    <Flex height="92vh" p="0 3vw">
      <Box flex="1" mr="1.5vw" m="3vh">
        <EditorDishCard
          dish={dish}
          localProducts={localProducts}
          productWeights={productWeights}
          handleWeightChange={handleWeightChange}
          handleRemoveProduct={handleRemoveProduct}
        />
      </Box>

      <Box flex="2" ml="1.5vw">
        <ToggleCards size="sm" option1={"Мои продукты"} option2={"Все продукты"} onChange={setSelectedSection} />
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
        <Button size="sm" leftIcon={<SmallAddIcon/>} height="2.5rem" colorScheme="purple" marginBottom="3vh" onClick={() => setEditingProduct({})}>
          Добавить продукт
        </Button>
        {products.length > 0 ? (
          <EditorProductsList
            products={products} 
            setEditingProduct={setEditingProduct}
            onAddProduct={handleAddProduct}
            favoriteProducts={favoriteProducts}
            setFavoriteProducts={setFavoriteProducts}
          />
        ) : (
          <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
            Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
          </Card>
        )}
        {editingProduct && (
          <ProductEditor ref={editRef} product={editingProduct} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />
        )}
      </Box>
    </Flex>
  );
}
