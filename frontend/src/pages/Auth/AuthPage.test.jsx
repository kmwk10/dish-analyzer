import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AuthPage from "./AuthPage";
import { AuthContext } from "../../context/AuthContext";

import * as authApi from "../../api/auth";
import * as userApi from "../../api/user";

jest.mock("../../api/auth");
jest.mock("../../api/user");

jest.mock("@chakra-ui/react", () => {
  const React = require("react");

  const filterProps = (props) => {
    const {
      bg,
      bgImage,
      bgSize,
      bgPosition,
      bgRepeat,
      bgAttachment,
      colorScheme,
      isLoading,
      minH,
      textAlign,
      lineHeight,
      alignItems,
      justifyContent,
      zIndex,
      marginBottom,
      ...rest
    } = props;

    return rest;
  };

  const el = (tag) => (props) =>
    React.createElement(tag, filterProps(props));

  return {
    Box: el("div"),
    Flex: el("div"),
    Card: el("div"),
    CardHeader: el("div"),
    CardBody: el("div"),

    Heading: el("h1"),
    Text: el("p"),

    Alert: el("div"),
    AlertIcon: () => React.createElement("span", null, "!"),

    CloseButton: el("button"),

    Input: el("input"),
    Button: el("button"),
    IconButton: el("button"),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  ArrowBackIcon: () => <span>back</span>,
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderWithContext() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthContext.Provider
        value={{
          setCurrentUserId: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUserRole: jest.fn(),
        }}
      >
        <AuthPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe("AuthPage (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should show welcome screen on first visit", () => {
    renderWithContext();

    expect(screen.getByRole("heading", { name: /кбжушка/i })).toBeInTheDocument();
  });

  it("should transition from welcome screen to login", async () => {
    renderWithContext();

    const buttons = screen.getAllByRole("button");
    userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(localStorage.getItem("hasSeenWelcome")).toBe("true");
    });
  });

  it("should login successfully with valid credentials", async () => {
    authApi.login.mockResolvedValue({
      access_token: "access",
      refresh_token: "refresh",
    });

    userApi.getUserInfo.mockResolvedValue({
      id: "1",
      role: "user",
    });

    localStorage.setItem("hasSeenWelcome", "true");

    renderWithContext();

    userEvent.type(
          screen.getByPlaceholderText(/введите электронную почту/i),
          "test@test.com"
      );

    userEvent.type(
          screen.getByPlaceholderText(/введите пароль/i),
          "123456"
      );

    userEvent.click(
          screen.getByRole("button", { name: /войти/i })
      );

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled();
      expect(userApi.getUserInfo).toHaveBeenCalled();
      expect(localStorage.getItem("access_token")).toBe("access");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should show error message on failed login", async () => {
    authApi.login.mockRejectedValue(new Error("error"));

    localStorage.setItem("hasSeenWelcome", "true");

    renderWithContext();

    userEvent.type(
          screen.getByPlaceholderText(/введите электронную почту/i),
          "test@test.com"
      );

    userEvent.type(
          screen.getByPlaceholderText(/введите пароль/i),
          "wrong"
      );

    userEvent.click(
          screen.getByRole("button", { name: /войти/i })
      );

    expect(
      await screen.findByText("Неверная почта или пароль")
    ).toBeInTheDocument();
  });

  it("should show error when registration passwords do not match", async () => {
    localStorage.setItem("hasSeenWelcome", "true");

    renderWithContext();

    userEvent.click(
          screen.getByText(/зарегистрироваться/i)
      );

    userEvent.type(
          screen.getByPlaceholderText(/имя/i),
          "test"
      );

    userEvent.type(
          screen.getByPlaceholderText(/введите электронную почту/i),
          "test@test.com"
      );

    userEvent.type(
          screen.getByPlaceholderText(/введите пароль/i),
          "123"
      );

    userEvent.type(
          screen.getByPlaceholderText(/повтор/i),
          "456"
      );

    userEvent.click(
          screen.getByRole("button", { name: /зарегистрироваться/i })
      );

    expect(
      await screen.findByText("Пароли не совпадают")
    ).toBeInTheDocument();
  });
});
