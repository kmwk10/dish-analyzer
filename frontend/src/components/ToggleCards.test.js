import { render, screen, fireEvent } from "@testing-library/react";
import ToggleCards from "./ToggleCards";

jest.mock("@chakra-ui/react", () => ({
  Flex: ({ children }) => <div>{children}</div>,
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>
}));

describe("ToggleCards", () => {
  it("renders options", () => {
    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="A"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("calls onChange when clicking option1", () => {
    const mock = jest.fn();

    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="B"
        onChange={mock}
      />
    );

    fireEvent.click(screen.getByText("A"));

    expect(mock).toHaveBeenCalledWith("A");
  });

  it("calls onChange when clicking option2", () => {
    const mock = jest.fn();

    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="A"
        onChange={mock}
      />
    );

    fireEvent.click(screen.getByText("B"));

    expect(mock).toHaveBeenCalledWith("B");
  });

  it("does not crash without onChange", () => {
    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="A"
      />
    );

    fireEvent.click(screen.getByText("B"));
  });
});
