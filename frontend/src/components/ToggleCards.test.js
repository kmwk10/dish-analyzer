import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleCards from "./ToggleCards";

jest.mock("@chakra-ui/react", () => {
  const React = require("react");

  const clean = (props) => {
    const {
      bg,
      backgroundColor,
      justifyContent,
      alignItems,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      ...rest
    } = props;

    return rest;
  };

  return {
    Flex: ({ children }) => <div>{children}</div>,
    Card: ({ children, ...props }) =>
      React.createElement("div", clean(props), children),
    CardBody: ({ children }) => <div>{children}</div>,
    Text: ({ children }) => <span>{children}</span>,
  };
});

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

  it("calls onChange when clicking option1", async () => {
    const mock = jest.fn();

    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="B"
        onChange={mock}
      />
    );

    userEvent.click(screen.getByText("A"));

    expect(mock).toHaveBeenCalledWith("A");
  });

  it("calls onChange when clicking option2", async () => {
    const mock = jest.fn();

    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="A"
        onChange={mock}
      />
    );

    userEvent.click(screen.getByText("B"));

    expect(mock).toHaveBeenCalledWith("B");
  });

  it("does not crash without onChange", async () => {
    render(
      <ToggleCards
        option1="A"
        option2="B"
        value="A"
      />
    );

    userEvent.click(screen.getByText("B"));
  });
});
