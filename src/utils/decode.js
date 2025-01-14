import { jwtDecode } from "jwt-decode"; // Correctly importing jwtDecode

export const tokenDecoder = async (router) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token not found.");
    await router.push("/login"); // Redirect to login page
    return false;
  }

  try {
    // Decode the token to check its expiry time
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token has expired.");
      localStorage.removeItem("token"); // Remove the expired token
      await router.push("/login"); // Redirect to login page
      return false;
    }

    // Call the backend API to further validate the token
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      console.log("Invalid or expired token.");
      localStorage.removeItem("token"); // Remove the invalid token
      await router.push("/login"); // Redirect to login page
      return false;
    }

    if (!response.ok) {
      console.error("Unexpected error during token validation:", response.statusText);
      return false;
    }

    await response.json();

    return decodedToken; 
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};
