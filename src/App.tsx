import { RouterProvider } from "react-router"
import { router } from "./navigation/router"

function App() {

  return (
      <RouterProvider router={router} />
  )
}

export default App
