import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";

const AllUsers = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", page],
    enabled: !!user,

    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get(
        `http://localhost:3000/api/users/all?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data || res.data;
    },
  });


  const handleDelete = async (email) => {
    const result = await Swal.fire({
      title: "Delete user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;
    const token = await user.getIdToken();
    await axios.delete(
      `http://localhost:3000/api/users/delete/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire("Deleted!", "", "success");
    refetch();
  };


  if (isLoading)
    return <span className="loading loading-spinner loading-lg"></span>;
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        All Users
      </h1>
      <div className="overflow-x-auto border rounded-xl">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              users.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className="badge badge-primary">
                      {item.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.email)}
                      className="btn btn-ghost btn-sm">
                      <FaTrashAlt className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-3 mt-6">

        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span className="btn btn-primary">
          {page}
        </span>

        <button
          className="btn"
          disabled={users.length < 10}
          onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;