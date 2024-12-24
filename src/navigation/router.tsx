import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import Register from "../pages/Register";
import CreateBudget from "../pages/CreateBudget";
import PrivateLayout from "../layout/PrivateLayout";
import BudgetsView from "../pages/BudgetsView";
import BudgetDetails from "../pages/BudgetDetails.tsx"; // Importa la nueva página de detalles
import CreateTransaction from "../pages/CreateTransaction.tsx";
import TransactionEditor from "../pages/TransactionEditor.tsx";
import MyProfile from "../pages/MyProfile.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateLayout />,
    children: [
      { path: "home", element: <BudgetsView /> },
      { path: "create-budget", element: <CreateBudget /> },
      { path: "budgets/:id", element: <BudgetDetails /> },
      { path: "budgets/:id/create-transaction", element: <CreateTransaction /> },
      { path: "budget/:idBudget/edit-transaction/:idTransaction", element:<TransactionEditor /> },
      { path: "profile", element: <MyProfile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);