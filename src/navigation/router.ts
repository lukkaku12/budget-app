import { createBrowserRouter } from "react-router";
import PublicLayout from "../layout/PublicLayout";
import { Login } from "../pages/Login";
import Register from "../pages/Register";

export let router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/home", Component: PublicLayout },
  { path: "/register", Component: Register}
]);
