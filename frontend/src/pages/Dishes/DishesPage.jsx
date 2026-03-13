import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ToggleCards from "../../components/ToggleCards";
import DishesList from "./DishesList";
import DishCard from "./DishCard";
import Pagination from "../../components/Pagination";

import { listDishes, searchDishes, deleteDish, getFavoriteDishes, removeFavoriteDish, getDishProducts } from "../../api/dishes";
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
  const [selectedSection, setSelectedSection] = useState(isAuthenticated ? "Мои блюда" : "Все блюда");

  const [page, setPage] = useState(1);
  const limit = 10;

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedDish(null),
  });

  useEffect(() => {
    async function fetchDishes() {
      try {
        const offset = (page - 1) * limit;

        if (isAuthenticated) {
          const favs = await getFavoriteDishes();
          setFavoriteDishes(favs);

          if (selectedSection === "Мои блюда") {
            setDishes(favs.slice(offset, offset + limit));
            return;
          }
        }

        if (searchQuery.trim()) {
          const results = await searchDishes({ query: searchQuery.trim(), offset, limit });
          setDishes(results);
        } else {
          const all = await listDishes(offset, limit);
          setDishes(all);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchDishes();
  }, [selectedSection, isAuthenticated, page, searchQuery]);

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

        setSelectedDish(prev => ({ ...prev, products: localProds }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchDishProducts();
  }, [selectedDish?.id]);

  const handleSearch = (query) => {
    setPage(1);
    setSearchQuery(query);
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
      console.error("Не удалось удалить блюдо:", err);
    }
  };

  return (
    <Box margin="2vh 10vw">
      <ToggleCards
        option1="Мои блюда"
        option2="Все блюда"
        value={selectedSection}
        onChange={(option) => {
          if (option === "Мои блюда" && !isAuthenticated) {
            navigate("/auth");
            return;
          }
          setSelectedSection(option);
          setPage(1);
        }}
      />

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
        <>
          <DishesList
            dishes={dishes}
            setSelectedDish={setSelectedDish}
            favoriteDishes={favoriteDishes}
            setFavoriteDishes={setFavoriteDishes}
            isAuthenticated={isAuthenticated}
          />

          <Pagination page={page} setPage={setPage} itemsLength={dishes.length} limit={limit} />
        </>
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
          onRemoveFavorite={handleRemoveFavorite}
          onDeleteDish={handleDeleteDish}
          currentUserId={currentUserId}
          isAdmin={userRole === "admin"}
        />
      )}
    </Box>
  );
}
