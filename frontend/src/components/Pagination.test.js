import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

jest.mock("@chakra-ui/react", () => ({
  Flex: ({ children }) => <div>{children}</div>,
  IconButton: ({ icon, ...props }) => (
    <button {...props}>{icon}</button>
  ),
  Tag: ({ children }) => <div>{children}</div>
}));

jest.mock("@chakra-ui/icons", () => ({
  ArrowBackIcon: () => <span>back</span>,
  ArrowForwardIcon: () => <span>forward</span>
}));

describe("Pagination", () => {
  it("renders current page", () => {
    render(
      <Pagination
        page={2}
        setPage={() => {}}
        itemsLength={10}
        limit={5}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("disables back button on first page", () => {
    render(
      <Pagination
        page={1}
        setPage={() => {}}
        itemsLength={10}
        limit={5}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
  });

  it("calls setPage on next click", () => {
    const mock = jest.fn();

    render(
      <Pagination
        page={1}
        setPage={mock}
        itemsLength={10}
        limit={5}
      />
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(mock).toHaveBeenCalledWith(2);
  });

  it("calls setPage on prev click", () => {
    const mock = jest.fn();

    render(
      <Pagination
        page={2}
        setPage={mock}
        itemsLength={10}
        limit={5}
      />
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mock).toHaveBeenCalledWith(1);
  });

  it("disables next button when last page", () => {
    render(
      <Pagination
        page={1}
        setPage={() => {}}
        itemsLength={3}
        limit={5}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeDisabled();
  });
});
