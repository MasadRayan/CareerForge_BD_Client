import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaTrashAlt, FaUserShield } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";

const PAGE_SIZE = 10;

const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return pages;
};

const AllUsers = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const {
    data,
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

  const users = data?.users ?? [];
  const pagination = data?.pagination ?? {
    currentPage: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

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
    if (users.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      refetch();
    }
  };

  const handleRoleChange = async (item) => {
    if (item.email === user.email) {
      Swal.fire("Info", "You cannot change your own role", "info");
      return;
    }

    const { value: newRole } = await Swal.fire({
      title: `Change role for ${item.name}`,
      input: "select",
      inputOptions: {
        free_user: "Free User",
        premium_user: "Premium User",
        admin: "Admin",
      },
      inputValue: item.role,
      showCancelButton: true,
      confirmButtonText: "Update",
      inputValidator: (value) => {
        if (!value) return "Please select a role";
      },
    });

    if (!newRole || newRole === item.role) return;

    try {
      const token = await user.getIdToken();
      const res = await axios.patch(
        `http://localhost:3000/api/users/role/${item.email}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Updated!", `Role changed to ${res.data.data.role}`, "success");
      refetch();
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to update role",
        "error"
      );
    }
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setPage(nextPage);
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
                <tr key={item.id}>
                  <td>
                    {(page - 1) * PAGE_SIZE + index + 1}
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
                      onClick={() => handleRoleChange(item)}
                      className="btn btn-ghost btn-sm"
                      title="Change role">
                      <FaUserShield className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.email)}
                      className="btn btn-ghost btn-sm"
                      title="Delete user">
                      <FaTrashAlt className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 mt-6">
        <div className="flex items-center gap-2">

          <button
            className="btn btn-sm"
            disabled={!pagination.hasPreviousPage}
            onClick={() => goToPage(page - 1)}>
            Prev
          </button>

          {getPageNumbers(pagination.currentPage, pagination.totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1">...</span>
            ) : (
              <button
                key={p}
                className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
                onClick={() => goToPage(p)}>
                {p}
              </button>
            )
          )}

          <button
            className="btn btn-sm"
            disabled={!pagination.hasNextPage}
            onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>

        <p className="text-sm text-base-content/50">
          Page {pagination.totalPages === 0 ? 0 : pagination.currentPage} of {pagination.totalPages} · {pagination.totalItems} users
        </p>
      </div>
    </div>
  );
};

export default AllUsers;