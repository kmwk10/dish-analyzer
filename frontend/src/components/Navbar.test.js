import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

jest.mock("@chakra-ui/react", () => ({
  Card: ({ children }) => <div>{children}</div>,
  Flex: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

describe("Navbar", () => {
  it("renders all links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Блюда")).toBeInTheDocument();
    expect(screen.getByText("Продукты")).toBeInTheDocument();
    expect(screen.getByText("Настройки")).toBeInTheDocument();
  });

  it("renders correct number of links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("has correct routes", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Блюда").closest("a")).toHaveAttribute("href", "/dishes");
    expect(screen.getByText("Продукты").closest("a")).toHaveAttribute("href", "/products");
    expect(screen.getByText("Настройки").closest("a")).toHaveAttribute("href", "/settings");
  });
});
