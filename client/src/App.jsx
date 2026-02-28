import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",          // ✅ main route
     // layout / landing
    children: [
      {
        index: true,    // ✅ default "/"
        element: <Home/>// or landing content if separated
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Signup />
      }
    ]
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;