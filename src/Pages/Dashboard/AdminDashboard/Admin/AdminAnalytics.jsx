import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";
const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/analytics/admin");
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const {
    totalUsers = 110,
    activeUsers = 220,
    adminUsers = 330,
    totalRoles = 120,
    roleData = [],
    experienceData = [],
    growthData = [],
  } = data || {};

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold text-primary mb-6">
        Admin Analytics
      </h2>
      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-base-200 p-5 rounded-2xl shadow border border-base-300">
          <p className="text-base-content/60">
            Total Users
          </p>
          <h3 className="text-3xl font-bold">
            {totalUsers}
          </h3>
        </div>

        <div className="bg-base-200 p-5 rounded-2xl shadow border border-base-300">
          <p className="text-base-content/60">
            Active Users
          </p>
          <h3 className="text-3xl font-bold">
            {activeUsers}
          </h3>
        </div>

        <div className="bg-base-200 p-5 rounded-2xl shadow border border-base-300">
          <p className="text-base-content/60">
            Admin Users
          </p>
          <h3 className="text-3xl font-bold">
            {adminUsers}
          </h3>
        </div>

        <div className="bg-base-200 p-5 rounded-2xl shadow border border-base-300">
          <p className="text-base-content/60">
            Total Roles
          </p>
          <h3 className="text-3xl font-bold">
            {totalRoles}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Ratio */}

        <div className="bg-base-200 rounded-2xl shadow border border-base-300 p-5">
          <h3 className="text-xl font-semibold mb-4">
            User Role Ratio
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {
                  roleData.map((item,index)=>(
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Experience Ratio */}

        <div className="bg-base-200 rounded-2xl shadow border border-base-300 p-5">
          <h3 className="text-xl font-semibold mb-4">
            Experience Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={experienceData}>
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="users"
                fill="#6366f1"
                radius={[8,8,0,0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* User Growth */}
        <div className="bg-base-200 rounded-2xl shadow border border-base-300 p-5 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;