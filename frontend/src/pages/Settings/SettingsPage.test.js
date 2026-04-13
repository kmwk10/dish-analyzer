import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";

import SettingsPage from "./SettingsPage";
import { AuthContext } from "../../context/AuthContext";
import * as userApi from "../../api/user";
import * as quoteApi from "../../api/quote";

jest.mock("../../api/user");
jest.mock("../../api/quote");

jest.mock("@chakra-ui/react", () => {
  const React = require("react");
  const filterProps = (props) => {
    const {
      marginBottom, backgroundColor, textAlign, colorScheme,
      leftIcon, rightIcon, size, variant, borderRadius,
      isLoading, minH, alignItems, justifyContent, mt, px, p, pr, maxW, gap, align, justify,
      flexDirection, marginTop, fontSize, fontStyle, ...rest
    } = props;
    return rest;
  };

  const el = (tag) => (props) => React.createElement(tag, filterProps(props));

  return {
    Box: el("div"),
    Card: el("div"),
    CardHeader: el("div"),
    Flex: el("div"),
    Badge: el("span"),
    Heading: el("h2"),
    Button: el("button"),
    Avatar: el("img"),
    Input: el("input"),
    IconButton: ({ icon, ...props }) => React.createElement("button", filterProps(props), icon),
    Text: el("p"),
    Stack: el("div"),
    Skeleton: el("div"),
  };
});

jest.mock("@chakra-ui/icons", () => ({
  EditIcon: () => <span>Edit</span>,
  CloseIcon: () => <span>Close</span>,
}));

jest.mock("./SettingsItem", () => ({
  __esModule: true,
  default: ({ label, onClick }) => (
    <div data-testid="settings-item" onClick={onClick}>
      {label}
    </div>
  ),
}));

jest.mock("./SettingsCard", () => ({
  __esModule: true,
  default: ({ option, onCancel }) => (
    <div data-testid="settings-card">
      {option}
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

jest.mock("./PasswordCard", () => ({
  __esModule: true,
  default: ({ onCancel }) => (
    <div data-testid="password-card">
      Password Editor
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

const mockLogout = jest.fn();

async function renderSettingsPage() {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthContext.Provider value={{ logout: mockLogout }}>
          <SettingsPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
  return result;
}

describe("SettingsPage (integration)", () => {
  const mockUser = { username: "testuser", email: "test@example.com", role: "user" };

  beforeEach(() => {
    jest.clearAllMocks();
    userApi.getUserInfo.mockResolvedValue(mockUser);
    userApi.getAvatar.mockResolvedValue(null);
    quoteApi.getQuote.mockResolvedValue({ text: "Wise words", author: "Author" });
  });

  it("should display user info and quote on load", async () => {
    await renderSettingsPage();

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText(/"Wise words"/i)).toBeInTheDocument();
    });
  });

  it("should show admin badge if user is admin", async () => {
    userApi.getUserInfo.mockResolvedValue({ ...mockUser, role: "admin" });
    await renderSettingsPage();

    await waitFor(() => {
      expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });
  });

  it("should open avatar file dialog when clicking avatar without image", async () => {
    await renderSettingsPage();
    const avatar = await screen.findByRole("img");
    
    const input = document.querySelector('input[type="file"]');
    const spy = jest.spyOn(input, "click");

    await userEvent.click(avatar);
    expect(spy).toHaveBeenCalled();
  });

  it("should upload avatar and update image", async () => {
    await renderSettingsPage();
    const input = document.querySelector('input[type="file"]');
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    userApi.uploadAvatar.mockResolvedValue({});
    userApi.getAvatar.mockResolvedValue("new-avatar-url");

    await act(async () => {
      await userEvent.upload(input, file);
    });

    await waitFor(() => {
      expect(userApi.uploadAvatar).toHaveBeenCalledWith(file);
      expect(screen.getByRole("img")).toHaveAttribute("src", "new-avatar-url");
    });
  });

  it("should open settings card when clicking on a setting item", async () => {
    await renderSettingsPage();
    const nameItem = await screen.findByText("Имя");

    await userEvent.click(nameItem);
    expect(screen.getByTestId("settings-card")).toHaveTextContent("username");
  });

  it("should open password card when clicking on Password item", async () => {
    await renderSettingsPage();
    const passwordItem = await screen.findByText("Пароль");

    await userEvent.click(passwordItem);
    expect(screen.getByTestId("password-card")).toBeInTheDocument();
  });

  it("should call logout when exit button is clicked", async () => {
    await renderSettingsPage();
    const logoutBtn = await screen.findByRole("button", { name: /выйти/i });

    await userEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("should handle avatar deletion", async () => {
    userApi.getAvatar.mockResolvedValue("current-avatar-url");
    await renderSettingsPage();

    const deleteBtn = await screen.findByText("Close");
    userApi.deleteAvatar.mockResolvedValue({});

    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(userApi.deleteAvatar).toHaveBeenCalled();
      expect(screen.getByRole("img")).not.toHaveAttribute("src", "current-avatar-url");
    });
  });
});
