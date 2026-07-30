import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import Home from "../Pages/Home/Home";
import Error from "../Pages/ErrorPage";
import SignIn from "../Pages/Authentication/SignIn";
import Signup from "../Pages/Authentication/SignUp";
import ErrorPage from "../Pages/ErrorPage";
import PrivateRoute from "../Routes/PrivateRoute";
import AdminRoute from "../Routes/AdminRoute";
import UserRoute from "../Routes/UserRoute";

import Profile from "../Components/Dashboard/Profile";
import UpdateProfile from "../Components/Dashboard/UpdateProfile";
import DashboardHome from "../Components/Dashboard/Dashboard";
import Settings from "../Components/Dashboard/Settings";

import AllUsers from "../Pages/Dashboard/AdminDashboard/Admin/AllUsers";
import AdminAnalytics from "../Pages/Dashboard/AdminDashboard/Admin/AdminAnalytics";

import CVList from "../Pages/Dashboard/UserDashboard/CV/CVList";
import CVDetails from "../Pages/Dashboard/UserDashboard/CV/CVDetails";
import CVAnalysis from "../Pages/Dashboard/UserDashboard/CV/CVAnalysis";
import AnalysisHistory from "../Pages/Dashboard/UserDashboard/Analysis/AnalysisHistory";

import Roadmap from "../Pages/Dashboard/UserDashboard/Roadmap/Roadmap";
import Roadmapdetails from "../Pages/Dashboard/UserDashboard/Roadmap/Roadmapdetails";

import Quiz from "../Pages/Dashboard/UserDashboard/Quiz/Quiz";
import QuizStats from "../Pages/Dashboard/UserDashboard/Quiz/QuizStats";
import QuizHistory from "../Pages/Dashboard/UserDashboard/Quiz/QuizHistory";

import MocInterview from "../Pages/Dashboard/UserDashboard/Interview/MocInterview";
import InterviewHistory from "../Pages/Dashboard/UserDashboard/Interview/InterviewHistory";
import InterviewResult from "../Pages/Dashboard/UserDashboard/Interview/InterviewResult";

import ReadinessScore from "../Pages/Dashboard/UserDashboard/Readiness/ReadinessScore";

import Subscription from "../Pages/Dashboard/UserDashboard/Subscription/Subscription";
import PaymentHistory from "../Pages/Dashboard/UserDashboard/Subscription/PaymentHistory";

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
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "updateprofile",
        Component: UpdateProfile,
      },
      {
        path: "settings",
        Component: Settings,
      },

      // Admin routes
      {
        path: "admin/users",
        element: <AdminRoute><AllUsers /></AdminRoute>,
      },
      {
        path: "admin/analytics",
        element: <AdminRoute><AdminAnalytics /></AdminRoute>,
      },

      // CV & Analysis routes
      {
        path: "cvs",
        element: <UserRoute><CVList /></UserRoute>,
      },
      {
        path: "cvs/:id",
        element: <UserRoute><CVDetails /></UserRoute>,
      },
      {
        path: "cvs/:id/analysis",
        element: <UserRoute><CVAnalysis /></UserRoute>,
      },
      {
        path: "analyses",
        element: <UserRoute><AnalysisHistory /></UserRoute>,
      },

      // Roadmap routes
      {
        path: "roadmaps",
        element: <UserRoute><Roadmap /></UserRoute>,
      },
      {
        path: "roadmaps/:id",
        element: <UserRoute><Roadmapdetails /></UserRoute>,
      },

      // Quiz routes
      {
        path: "quiz",
        element: <UserRoute><Quiz /></UserRoute>,
      },
      {
        path: "quiz/stats",
        element: <UserRoute><QuizStats /></UserRoute>,
      },
      {
        path: "quiz/history",
        element: <UserRoute><QuizHistory /></UserRoute>,
      },

      // Interview routes
      {
        path: "interview",
        element: <UserRoute><MocInterview /></UserRoute>,
      },
      {
        path: "interview/history",
        element: <UserRoute><InterviewHistory /></UserRoute>,
      },
      {
        path: "interview/result/:id",
        element: <UserRoute><InterviewResult /></UserRoute>,
      },

      // Readiness
      {
        path: "readiness",
        element: <UserRoute><ReadinessScore /></UserRoute>,
      },

      // Subscription
      {
        path: "subscription",
        element: <UserRoute><Subscription /></UserRoute>,
      },
      {
        path: "payment-history",
        element: <UserRoute><PaymentHistory /></UserRoute>,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
