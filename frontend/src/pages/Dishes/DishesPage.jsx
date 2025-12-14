import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ToggleCards from "../../components/ToggleCards";
import DishesList from "./DishesList";
import DishCard from "./DishCard";

import { listDishes, searchDishes, getFavoriteDishes, removeFavoriteDish, getDishProducts } from "../../api/dishes";
import { listProducts } from "../../api/products";

export default function DishesPage() {
  const navigate = useNavigate();
  const cardRef = useRef();

  const [selectedSection, setSelectedSection] = useState("Мои блюда");
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedDish(null),
  });

  useEffect(() => {
    async function fetchDishes() {
      const favs = await getFavoriteDishes();
      setFavoriteDishes(favs);

      if (selectedSection === "Мои блюда") {
        setDishes(favs);
      } else {
        const all = await listDishes();
        setDishes(all);
      }
    }
    fetchDishes();
  }, [selectedSection]);

  useEffect(() => {
    if (!selectedDish?.id) return;

    async function fetchDishProducts() {
      try {
        const dishProducts = await getDishProducts(selectedDish.id);
        const allProducts = await listProducts();

        const localProds = dishProducts.map(p => {
          const productInfo = allProducts.find(prod => prod.id === p.product_id);
          return {
            id: p.product_id,
            name: productInfo?.name,
            weight: p.weight,
          };
        });

        setSelectedDish(prev => ({
          ...prev,
          products: localProds,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchDishProducts();
  }, [selectedDish?.id]);

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDishes(selectedSection === "Мои блюда" ? favoriteDishes : await listDishes());
      return;
    }

    if (selectedSection === "Мои блюда") {
      const filtered = favoriteDishes.filter(d =>
        d.name.toLowerCase().includes(trimmed.toLowerCase())
      );
      setDishes(filtered);
    } else {
      const results = await searchDishes(trimmed);
      setDishes(results);
    }
  };
  
  const handleDelete = async (dishId) => {
    try {
      await removeFavoriteDish(dishId);
      setFavoriteDishes(prev => prev.filter(d => d.id !== dishId));
      setSelectedDish(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои блюда"} option2={"Все блюда"} onChange={setSelectedSection} />
      <Input
        size="lg"
        placeholder="Введите название блюда"
        background="white"
        marginBottom="3vh"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(searchQuery); }}
      />
      <Button
        size="md"
        leftIcon={<SmallAddIcon />}
        height="3rem"
        colorScheme="purple"
        marginBottom="3vh"
        onClick={() => navigate(`/dishes/editor/new`)}
      >
        Добавить блюдо
      </Button>

      {dishes.length > 0 ? (
        <DishesList dishes={dishes} setSelectedDish={setSelectedDish} favoriteDishes={favoriteDishes} setFavoriteDishes={setFavoriteDishes}/>
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить блюдо.
        </Card>
      )}

      {selectedDish && (
        <DishCard
          ref={cardRef}
          dish={selectedDish}
          isFavorite={favoriteDishes.some(d => d.id === selectedDish.id)}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}
