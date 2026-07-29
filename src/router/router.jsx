import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import Home from "../Pages/Home/Home";
import Error from "../Pages/ErrorPage";
import SignIn from "../Pages/Authentication/SignIn";
import Signup from "../Pages/Authentication/SignUp";
import ErrorPage from "../Pages/ErrorPage";
import Profile from "../Components/Dashboard/Profile";
import Dashboard from "../Components/Dashboard/Dashboard";
import PrivateRoute from "../Routes/PrivateRoute";
import UpdateProfile from "../Components/Dashboard/UpdateProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "updateprofile",
        Component: UpdateProfile
      }
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;