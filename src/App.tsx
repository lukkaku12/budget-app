import { RouterProvider } from "react-router"
import { router } from "./navigation/router"
import { useAuth } from "./context/AuthContext"



function App() {
  const auth = useAuth()
  return (
    
      <RouterProvider router={router} />
  )
}

export default App
