import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/Auth/AuthPage";
import DishesPage from "./pages/Dishes/DishesPage";
import EditorDishPage from "./pages/EditorDish/EditorDishPage";
import ProductsPage from "./pages/Products/ProductsPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthContext } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";
  const { isAuthenticated } = useContext(AuthContext);

  function PrivateRoute({ children }) {
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dishes" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dishes" element={<DishesPage />} />
        <Route path="/dishes/editor/:id" element={<PrivateRoute><EditorDishPage /></PrivateRoute>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
