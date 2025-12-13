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

  function useAuth() {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  }

  function HomeRedirect() {
    const isAuthenticated = useAuth();
    return isAuthenticated ? <Navigate to="/dishes" replace /> : <Navigate to="/auth" replace />;
  }

  function PrivateRoute({ children }) {
    const isAuthenticated = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dishes" element={<PrivateRoute><DishesPage /></PrivateRoute>} />
        <Route path="/dishes/editor/:id" element={<PrivateRoute><EditorDishPage /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
