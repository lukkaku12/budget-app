import { RouterProvider } from "react-router-dom"; // Usa react-router-dom
import { router } from "./navigation/router";
import { useAuth } from "./context/AuthContext";
import Cookies from "js-cookie";
import { useEffect } from "react";

function App() {
  const auth = useAuth();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      auth.setIsAuthenticated(true);
      router.navigate("/home");
    } else {
      auth.setIsAuthenticated(false);
      router.navigate("/login"); // ✅ Usa router.navigate()
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;