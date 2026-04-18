import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import ProductsPage from "./ProductsPage";
import { AuthContext } from "../../context/AuthContext";
import * as productsApi from "../../api/products";

jest.mock("../../api/products");

jest.mock("@chakra-ui/react", () => {
  const React = require("react");
  const filterProps = (props) => {
    const {
      marginBottom, backgroundColor, textAlign, colorScheme,
      leftIcon, rightIcon, size, variant, borderRadius,
      isLoading, minH, alignItems, justifyContent, pr, mr, ...rest
    } = props;
    return rest;
  };

  const el = (tag) => (props) => React.createElement(tag, filterProps(props));

  return {
    Box: el("div"),
    Card: el("div"),
    Input: el("input"),
    Button: el("button"),
    Select: el("select"),
    Heading: el("h1"),
    InputGroup: el("div"),
    InputRightElement: ({ children }) => <div>{children}</div>,
    useOutsideClick: jest.fn(),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  SmallAddIcon: () => <span>+</span>,
}));

jest.mock("./ProductsList", () => ({
  __esModule: true,
  default: ({ products, setSelectedProduct }) => (
    <div data-testid="products-list">
      {products.map(p => (
        <div key={p.id} onClick={() => setSelectedProduct(p)}>
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("./ProductCard", () => ({
  __esModule: true,
  default: ({ product }) => <div data-testid="product-card">{product.name}</div>,
}));

jest.mock("./ProductEditor", () => ({
  __esModule: true,
  default: ({ onSave }) => (
    <div data-testid="product-editor">
      <button onClick={() => onSave({ name: "New Product", calories: "100" })}>Save</button>
    </div>
  ),
}));

jest.mock("../../components/Pagination", () => ({
  __esModule: true,
  default: () => <div>Pagination</div>,
}));

jest.mock("../../components/ToggleCards", () => ({
  __esModule: true,
  default: ({ onChange, value }) => (
    <div>
      <button onClick={() => onChange("Все продукты")}>All Products</button>
      <button onClick={() => onChange("Мои продукты")}>My Products</button>
      <span>{value}</span>
    </div>
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

async function renderProductsPage(ctxValue = {}) {
  const defaultCtx = {
    isAuthenticated: false,
    currentUserId: null,
    userRole: "user",
    ...ctxValue
  };

  let result;
  await act(async () => {
    result = render(
      <HelmetProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthContext.Provider value={defaultCtx}>
            <ProductsPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </HelmetProvider>
    );
  });
  return result;
}

describe("ProductsPage (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    productsApi.getFavoriteProducts.mockResolvedValue([]);
    productsApi.searchProducts.mockResolvedValue([]);
  });

  it("should load and display products from search API", async () => {
    productsApi.searchProducts.mockResolvedValue([
      { id: "1", name: "Chicken", calories: 165 },
    ]);

    await renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Chicken")).toBeInTheDocument();
    });
  });

  it("should switch section to 'All Products' when filters are applied", async () => {
    await renderProductsPage({ isAuthenticated: true });

    const allBtn = screen.getByText("All Products");
    userEvent.click(allBtn);

    const minInput = await screen.findByPlaceholderText(/мин\./i);
    userEvent.type(minInput, "100");

    await waitFor(() => {
      expect(productsApi.searchProducts).toHaveBeenCalled();
    });
  });

  it("should call save API and update list when new product is saved", async () => {
    productsApi.saveProduct.mockResolvedValue({ id: "2", name: "New Product", calories: 100 });
    await renderProductsPage({ isAuthenticated: true, currentUserId: "1" });

    const addBtn = screen.getByRole("button", { name: /добавить продукт/i });
    userEvent.click(addBtn);

    const saveBtn = await screen.findByText("Save");
    userEvent.click(saveBtn);

    await waitFor(() => {
      expect(productsApi.saveProduct).toHaveBeenCalled();
      const items = screen.getAllByText("New Product");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("should handle search with debounce", async () => {
    await renderProductsPage();

    const input = screen.getByPlaceholderText(/введите название продукта/i);
    userEvent.type(input, "milk");

    await waitFor(() => {
      expect(productsApi.searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ query: "milk" })
      );
    }, { timeout: 1500 });
  });
});
