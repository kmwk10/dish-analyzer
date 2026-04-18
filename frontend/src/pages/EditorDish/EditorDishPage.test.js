import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EditorDishPage from "./EditorDishPage";
import { AuthContext } from "../../context/AuthContext";
import * as productsApi from "../../api/products";
import * as dishesApi from "../../api/dishes";

jest.mock("../../api/products");
jest.mock("../../api/dishes");

jest.mock("@chakra-ui/react", () => {
  const React = require("react");
  const filterProps = (props) => {
    const {
      marginBottom, backgroundColor, textAlign, colorScheme,
      leftIcon, rightIcon, size, variant, borderRadius,
      isLoading, minH, alignItems, justifyContent, ...rest
    } = props;
    return rest;
  };

  const el = (tag) => (props) => React.createElement(tag, filterProps(props));

  return {
    Box: el("div"),
    Flex: el("div"),
    Card: el("div"),
    Input: el("input"),
    Button: el("button"),
    useOutsideClick: jest.fn(),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  SmallAddIcon: () => <span>+</span>,
}));

jest.mock("./EditorDishCard", () => ({
  __esModule: true,
  default: ({ onSave, dish }) => (
    <div data-testid="editor-dish-card">
      <button onClick={() => onSave({ name: "New Dish", calories: "100" })}>Save Dish</button>
      <div>{dish?.name}</div>
    </div>
  ),
}));

jest.mock("./EditorProductsList", () => ({
  __esModule: true,
  default: ({ products, onAddProduct }) => (
    <div data-testid="products-list">
      {products.map(p => (
        <div key={p.id}>
          <span>{p.name}</span>
          <button onClick={() => onAddProduct(p)}>Add to Dish</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../Products/ProductEditor", () => ({
  __esModule: true,
  default: ({ onSave }) => (
    <div data-testid="product-editor">
      <button onClick={() => onSave({ name: "New Product", calories: "50" })}>Save Product</button>
    </div>
  ),
}));

jest.mock("../../components/ToggleCards", () => ({
  __esModule: true,
  default: ({ onChange, value }) => (
    <div>
      <button onClick={() => onChange("Все продукты")}>All Products</button>
      <span>{value}</span>
    </div>
  ),
}));

jest.mock("../../components/Pagination", () => ({
  __esModule: true,
  default: () => <div>Pagination</div>,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "new" }),
}));

async function renderEditor(ctxValue = { currentUserId: "1" }, routeId = "new") {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={[`/dishes/editor/${routeId}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthContext.Provider value={ctxValue}>
          <Routes>
            <Route path="/dishes/editor/:id" element={<EditorDishPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
  return result;
}

describe("EditorDishPage (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    productsApi.getFavoriteProducts.mockResolvedValue([]);
    productsApi.searchProducts.mockResolvedValue([]);
    productsApi.listProducts.mockResolvedValue([]);
  });

  it("should display empty state when no products are available", async () => {
    await renderEditor();
    expect(await screen.findByText(/здесь пока ничего нет/i)).toBeInTheDocument();
  });

  it("should load and display favorite products on mount", async () => {
    const favs = [{ id: "p1", name: "Apple" }];
    productsApi.getFavoriteProducts.mockResolvedValue(favs);

    await renderEditor();

    expect(await screen.findByText("Apple")).toBeInTheDocument();
  });

  it("should switch between 'My Products' and 'All Products'", async () => {
    await renderEditor();

    const toggleBtn = screen.getByText("All Products");
    userEvent.click(toggleBtn);

    await waitFor(() => {
      expect(productsApi.searchProducts).toHaveBeenCalled();
    });
  });

  it("should trigger product search when typing in search input", async () => {
    await renderEditor();

    const input = screen.getByPlaceholderText(/введите название продукта/i);
    userEvent.type(input, "banana");

    await waitFor(() => {
      expect(productsApi.searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ query: "banana" })
      );
    });
  });

  it("should open product editor when 'Add Product' button is clicked", async () => {
    await renderEditor();

    const addBtn = screen.getByRole("button", { name: /добавить продукт/i });
    userEvent.click(addBtn);

    expect(screen.getByTestId("product-editor")).toBeInTheDocument();
  });

  it("should save a new product and update the list", async () => {
    const savedProduct = { id: "p2", name: "New Product", calories: 50 };
    productsApi.saveProduct.mockResolvedValue(savedProduct);

    await renderEditor();

    const addBtn = screen.getByRole("button", { name: /добавить продукт/i });
    userEvent.click(addBtn);

    const saveBtn = screen.getByText("Save Product");
    userEvent.click(saveBtn);

    expect(await screen.findByText("New Product")).toBeInTheDocument();
  });

  it("should save dish and navigate back to dishes list", async () => {
    const savedDish = { id: "d1", name: "New Dish" };
    dishesApi.saveDish.mockResolvedValue(savedDish);
    dishesApi.updateDishProducts.mockResolvedValue({});

    await renderEditor();

    const saveDishBtn = screen.getByText("Save Dish");
    userEvent.click(saveDishBtn);

    await waitFor(() => {
      expect(dishesApi.saveDish).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/dishes");
    });
  });

  it("should load existing dish data when id is not 'new'", async () => {
    const existingDish = { id: "123", name: "Existing Soup" };
    dishesApi.getDish.mockResolvedValue(existingDish);
    dishesApi.getDishProducts.mockResolvedValue([]);
    
    const routeParamMock = require("react-router-dom").useParams;
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({ id: "123" });

    await renderEditor({ currentUserId: "1" }, "123");

    expect(await screen.findByText("Existing Soup")).toBeInTheDocument();
  });
});
