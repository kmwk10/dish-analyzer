import { Card, Box, Input, Button, Select, InputGroup, InputRightElement, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ToggleCards from "../../components/ToggleCards";
import DishesList from "./DishesList";
import DishCard from "./DishCard";
import Pagination from "../../components/Pagination";

import { searchDishes, deleteDish, getFavoriteDishes, removeFavoriteDish, getDishProducts } from "../../api/dishes";
import { listProducts } from "../../api/products";
import { AuthContext } from "../../context/AuthContext";

export default function DishesPage() {
  const navigate = useNavigate();
  const cardRef = useRef();
  const { isAuthenticated, currentUserId, userRole } = useContext(AuthContext);

  const [selectedDish, setSelectedDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [desc, setDesc] = useState(true);

  const [selectedSection, setSelectedSection] = useState(isAuthenticated ? "Мои блюда" : "Все блюда");

  const [page, setPage] = useState(1);
  const limit = 10;

  useOutsideClick({ ref: cardRef, handler: () => setSelectedDish(null) });

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchFavorites() {
      try {
        const favs = await getFavoriteDishes();
        setFavoriteDishes(favs);
      } catch {
        navigate("/auth");
      }
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchDishes() {
      try {
        const offset = (page - 1) * limit;

        if (selectedSection === "Мои блюда") {
          setDishes(favoriteDishes.slice(offset, offset + limit));
        } else {
          const queryTrimmed = searchQuery.trim();
          const min = minCalories ? Number(minCalories) : undefined;
          const max = maxCalories ? Number(maxCalories) : undefined;

          const results = await searchDishes({
            query: queryTrimmed || undefined,
            min_calories: min,
            max_calories: max,
            offset,
            limit,
            desc
          });

          setDishes(results);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDishes();
  }, [selectedSection, favoriteDishes, searchQuery, minCalories, maxCalories, page, desc]);

  useEffect(() => {
    if (!selectedDish?.id) return;

    async function fetchDishProducts() {
      try {
        const dishProducts = await getDishProducts(selectedDish.id);
        const allProducts = await listProducts();

        const localProds = dishProducts.map(p => {
          const productInfo = allProducts.find(prod => prod.id === p.product_id);
          return { id: p.product_id, name: productInfo?.name, weight: p.weight };
        });

        setSelectedDish(prev => ({ ...prev, products: localProds }));
      } catch (err) {
        console.error(err);
      }
    }
    fetchDishProducts();
  }, [selectedDish?.id]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
    if (value.trim() && selectedSection === "Мои блюда") setSelectedSection("Все блюда");
  };

  const handleMinCaloriesChange = (value) => {
    setMinCalories(value);
    setPage(1);
    if (value && selectedSection === "Мои блюда") setSelectedSection("Все блюда");
  };

  const handleMaxCaloriesChange = (value) => {
    setMaxCalories(value);
    setPage(1);
    if (value && selectedSection === "Мои блюда") setSelectedSection("Все блюда");
  };

  const handleSortChange = (value) => {
    setDesc(value === "desc");
    setPage(1);
  };

  const handleSectionChange = (option) => {
    if (option === "Мои блюда" && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (option === "Мои блюда") {
      setSearchQuery("");
      setMinCalories("");
      setMaxCalories("");
    }
    setSelectedSection(option);
    setPage(1);
  };

  const handleRemoveFavorite = async (dishId) => {
    try {
      await removeFavoriteDish(dishId);
      setFavoriteDishes(prev => prev.filter(d => d.id !== dishId));
      setDishes(prev => prev.filter(d => d.id !== dishId));
      setSelectedDish(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await deleteDish(dishId);
      setDishes(prev => prev.filter(d => d.id !== dishId));
      setFavoriteDishes(prev => prev.filter(d => d.id !== dishId));
      setSelectedDish(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box margin="2vh 10vw">
      <ToggleCards
        option1="Мои блюда"
        option2="Все блюда"
        value={selectedSection}
        onChange={handleSectionChange}
      />

      <Input
        size="lg"
        placeholder="Введите название блюда"
        background="white"
        marginBottom="1.5vh"
        value={searchQuery}
        onChange={e => handleSearchChange(e.target.value)}
      />

      {selectedSection === "Все блюда" && (
        <Box display="flex" gap="1rem" marginBottom="3vh">
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
            onChange={e => handleSortChange(e.target.value)}
          >
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </Select>
        </Box>
      )}

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
        <DishesList
          dishes={dishes}
          setSelectedDish={setSelectedDish}
          favoriteDishes={favoriteDishes}
          setFavoriteDishes={setFavoriteDishes}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить блюдо.
        </Card>
      )}
      <Pagination page={page} setPage={setPage} itemsLength={dishes.length} limit={limit} />

      {selectedDish && (
        <DishCard
          ref={cardRef}
          dish={selectedDish}
          isFavorite={favoriteDishes.some(d => d.id === selectedDish.id)}
          onRemoveFavorite={handleRemoveFavorite}
          onDeleteDish={handleDeleteDish}
          currentUserId={currentUserId}
          isAdmin={userRole === "admin"}
        />
      )}
    </Box>
  );
}
