import { Card, Box, Input, Button, useOutsideClick, Flex } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserInfo } from "../../api/user";
import { toNumber } from "../../utils/number";
import {
  listProducts,
  searchProducts,
  getFavoriteProducts,
  removeFavoriteProduct,
  saveProduct
} from "../../api/products";
import {
  getDish,
  getDishProducts,
  saveDish,
  updateDishProducts,
  removeFavoriteDish
} from "../../api/dishes";

import EditorDishCard from "./EditorDishCard";
import EditorProductsList from "./EditorProductsList";
import ProductEditor from "../Products/ProductEditor";
import ToggleCards from "../../components/ToggleCards";


export default function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isNew = id === "new";
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dish, setDish] = useState({});
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [editingProduct, setEditingProduct] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);
  const [productWeights, setProductWeights] = useState({});

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

  useEffect(() => {
    if (!isNew) {
      async function fetchDish() {
        try {
          const data = await getDish(id);
          const dishProducts = await getDishProducts(id);
          const allProducts = await listProducts();

          const localProds = dishProducts.map(p => {
            const productInfo = allProducts.find(prod => prod.id === p.product_id);
            return {
              id: p.product_id,
              name: productInfo?.name,
              weight: p.weight,
            };
          });

          const weights = {};
          localProds.forEach(p => {
            weights[p.id] = p.weight;
          });

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

  async function handleSave(formData) {
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

      setDish({
        ...savedDish,
        products: localProducts.map(p => ({
          id: p.id,
          weight: productWeights[p.id],
          name: p.name,
        })),
      });
      navigate("/dishes");

    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async (dishId) => {
    try {
      await removeFavoriteDish(dishId);
      setDish(null);
      navigate("/dishes");
    } catch (err) {
      console.error(err);
    }
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
          onSave={handleSave}
          onDelete={handleDelete}
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
        <Button size="sm"
          leftIcon={<SmallAddIcon/>}
          height="2.5rem"
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
