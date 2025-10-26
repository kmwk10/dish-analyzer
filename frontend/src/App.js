import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/Auth/AuthPage";
import DishesPage from "./pages/Dishes/DishesPage";
import EditorDishPage from "./pages/EditorDish/EditorDishPage";
import ProductsPage from "./pages/Products/ProductsPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  function HomeRedirect() {
    // const isAuthenticated = localStorage.getItem("token");
    const isAuthenticated = true; // ! заменить на настоящую проверку !

    return isAuthenticated ? (
      <Navigate to="/dishes" replace />
    ) : (
      <Navigate to="/auth" replace />
    );
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dishes" element={<DishesPage />} />
        <Route path="/dishes/editor" element={<EditorDishPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
