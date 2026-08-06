import useUserRole from "../../Hooks/useUserRole";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import AdminDashboardHome from "../../Pages/Dashboard/AdminDashboard/Admin/AdminDashboardHome";
import UserDashboardHome from "../../Pages/Dashboard/UserDashboard/UserDashboardHome/UserDashboardHome";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <LoadingSpinner />;
  }

  if (role === "admin") {
    return <AdminDashboardHome />;
  }

  return <UserDashboardHome />;
};

export default Dashboard;
