import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import DishesPage from "./DishesPage";
import { AuthContext } from "../../context/AuthContext";
import * as dishesApi from "../../api/dishes";

jest.mock("../../api/dishes");
jest.mock("../../api/products");

jest.mock("@chakra-ui/react", () => {
  const React = require("react");
  const el = (tag) => ({ children, ...props }) => {
    const {
      marginBottom, backgroundColor, textAlign, colorScheme,
      leftIcon, rightIcon, size, variant, borderRadius,
      InputRightElement, ...cleanProps
    } = props;
    return React.createElement(tag, cleanProps, children);
  };

  return {
    Box: el("div"),
    Card: el("div"),
    Input: el("input"),
    Button: el("button"),
    Select: el("select"),
    Heading: el("h1"),
    InputGroup: el("div"),
    InputRightElement: el("div"),
    useOutsideClick: jest.fn(),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  SmallAddIcon: () => <span>+</span>,
}));

jest.mock("./DishesList", () => ({
  __esModule: true,
  default: ({ dishes }) => (
    <div data-testid="dishes-list">
      {dishes?.map((d) => (
        <div key={d.id}>{d.name}</div>
      ))}
    </div>
  ),
}));

jest.mock("./DishCard", () => ({
  __esModule: true,
  default: () => <div>DishCard</div>,
}));

jest.mock("../../components/Pagination", () => ({
  __esModule: true,
  default: () => <div>Pagination</div>,
}));

jest.mock("../../components/ToggleCards", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <div>
      <button onClick={() => onChange("Все блюда")}>Все блюда</button>
      <button onClick={() => onChange("Мои блюда")}>Мои блюда</button>
      <div>{value}</div>
    </div>
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

async function renderPage(ctxValue) {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthContext.Provider value={ctxValue}>
          <DishesPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
  return result;
}

describe("DishesPage (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dishesApi.searchDishes.mockResolvedValue([]);
    dishesApi.getFavoriteDishes.mockResolvedValue([]);
  });

  it("should show empty state message when no dishes found", async () => {
    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    expect(await screen.findByText(/здесь пока ничего нет/i)).toBeInTheDocument();
    
    await waitFor(() => expect(dishesApi.searchDishes).toHaveBeenCalled());
  });

  it("should load and display dishes from API", async () => {
    dishesApi.searchDishes.mockResolvedValue([
      { id: "1", name: "Pasta", calories: 100 },
      { id: "2", name: "Soup", calories: 50 },
    ]);

    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    expect(await screen.findByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Soup")).toBeInTheDocument();
  });

  it("should trigger API search when user types in search input", async () => {
    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    const input = screen.getByPlaceholderText(/введите название блюда/i);
    userEvent.type(input, "pasta");

    await waitFor(() => {
      expect(dishesApi.searchDishes).toHaveBeenCalledWith(
        expect.objectContaining({ query: "pasta" })
      );
    });
  });

  it("should redirect to auth page when switching to 'My Dishes' without authentication", async () => {
    dishesApi.getFavoriteDishes.mockRejectedValue(new Error("unauth"));

    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    const btn = screen.getByText("Мои блюда");
    userEvent.click(btn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
    });
  });

  it("should navigate to editor when 'Add Dish' button is clicked", async () => {
    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    const btn = screen.getByRole("button", { name: /добавить блюдо/i });
    userEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/dishes/editor/new");
  });

  it("should fetch favorite dishes for authenticated user", async () => {
    dishesApi.getFavoriteDishes.mockResolvedValue([
      { id: "1", name: "Fav Dish", calories: 200 },
    ]);

    await renderPage({ isAuthenticated: true, currentUserId: "1", userRole: "user" });

    await waitFor(() => {
      expect(dishesApi.getFavoriteDishes).toHaveBeenCalled();
    });
  });

  it("should refresh the list after a dish is deleted", async () => {
    dishesApi.searchDishes.mockResolvedValue([{ id: "1", name: "To Delete" }]);
    dishesApi.deleteDish.mockResolvedValue({});

    await renderPage({ isAuthenticated: false, currentUserId: "1", userRole: "user" });

    await screen.findByText("To Delete");

    await waitFor(() => {
      expect(dishesApi.searchDishes).toHaveBeenCalled();
    });
  });
});
