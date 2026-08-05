import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";

const AdminDashboardHome = () => {

  const axiosSecure = useAxiosSecure();


  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/dashboard");
      return res.data;
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const {
    totalUsers = 0,
    todayUsers = 0,
    activeUsers = 0,
    recentUsers = []
  } = data || {};

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold text-primary mb-2">
        Admin Dashboard
      </h2>

      <p className="text-base-content/60 mb-8">
        Monitor users and manage your system.
      </p>



      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


        <div className="bg-base-200 p-5 rounded-2xl shadow border">
          <p className="text-base-content/60">
            Total Users
          </p>

          <h3 className="text-3xl font-bold">
            {totalUsers}
          </h3>
        </div>

        <div className="bg-base-200 p-5 rounded-2xl shadow border">
          <p className="text-base-content/60">
            New Users Today
          </p>

          <h3 className="text-3xl font-bold">
            {todayUsers}
          </h3>
        </div>



        <div className="bg-base-200 p-5 rounded-2xl shadow border">
          <p className="text-base-content/60">
            Active Users
          </p>

          <h3 className="text-3xl font-bold">
            {activeUsers}
          </h3>
        </div>


      </div>



      {/* Recent Users */}

      <div className="mt-8 bg-base-200 p-6 rounded-2xl shadow border">

        <h3 className="text-xl font-semibold mb-5">
          Recent Registered Users
        </h3>


        <div className="space-y-3">

          {
            recentUsers.map(user => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-base-300 p-4 rounded-xl"
              >

                <div>
                  <p className="font-semibold">
                    {user.name}
                  </p>

                  <p className="text-sm text-base-content/60">
                    {user.email}
                  </p>
                </div>


                <span className="badge badge-primary">
                  {user.role}
                </span>


              </div>
            ))
          }

        </div>

      </div>


    </div>
  );
};

export default AdminDashboardHome;