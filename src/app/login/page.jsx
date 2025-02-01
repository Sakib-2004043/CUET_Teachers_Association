import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import LoginForm from "./page";
import { act } from "react-dom/test-utils";

// Mock the useRouter hook to simulate routing behavior
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
    },
    writable: true,
  });
});

// Simulate the router push function
const pushMock = jest.fn();
beforeEach(() => {
  // Reset mock functions before each test
  pushMock.mockReset();
});

describe("LoginForm", () => {
  test("renders the login form", () => {
    render(<LoginForm />);
    
    // Check if the elements are rendered correctly
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/register now/i)).toBeInTheDocument();
  });

  test("submits the login form and makes the API call", async () => {
    // Mock the fetch response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: "mocked-token",
        role: "Member",
      }),
    });

    render(<LoginForm />);

    // Find input fields and buttons
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/🚀 Log In/i);

    // Simulate user typing into inputs
    fireEvent.change(emailInput, { target: { value: "saadman@cuet.ac.bd" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for the API call to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/register", expect.any(Object)));

    // Check if the localStorage is set
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "mocked-token");

    // Check if the router push was called
    expect(pushMock).toHaveBeenCalledWith("/teacher");
  });

  test("handles failed login with error message", async () => {
    // Mock the fetch response for a failed login
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: "Invalid credentials",
      }),
    });

    render(<LoginForm />);

    // Find input fields and buttons
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/🚀 Log In/i);

    // Simulate user typing into inputs
    fireEvent.change(emailInput, { target: { value: "saadman@cuet.ac.bd" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for the API call to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/register", expect.any(Object)));

    // Check if the alert message is called
    expect(window.alert).toHaveBeenCalledWith("⚠️ Failed to log in: Invalid credentials");
  });

  test("handles network error", async () => {
    // Mock the fetch response for a network error
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<LoginForm />);

    // Find input fields and buttons
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/🚀 Log In/i);

    // Simulate user typing into inputs
    fireEvent.change(emailInput, { target: { value: "saadman@cuet.ac.bd" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for the network error to be caught
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("❌ An error occurred. Please try again."));
  });

  test("navigates to register page when clicked", () => {
    render(<LoginForm />);

    // Find the 'Register Now' button
    const registerButton = screen.getByText(/Register Now!/i);

    // Simulate click on the register button
    fireEvent.click(registerButton);

    // Check if the router push function was called for the correct URL
    expect(pushMock).toHaveBeenCalledWith("/register");
  });
});
