import { useEffect, useState } from "react";
import API from "../../Common/services/api";
import Navbar from "../../Common/components/Navbar";
import BackButton from "../../Common/components/BackButton";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Filter logic
  useEffect(() => {
    let result = users;

    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFiltered(result);
  }, [search, roleFilter, users]);

  // ❌ Delete
  const deleteUser = async (id: string, role: string) => {
    if (role === "admin") {
      alert("Cannot delete admin!");
      return;
    }

    if (!confirm("Are you sure?")) return;

    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <BackButton />

        <h1 className="text-3xl font-bold">Users 👥</h1>

        {/* 🔍 Search + Filter */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* 📋 Users List */}
        <div className="bg-white rounded-xl shadow divide-y">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              No users found
            </p>
          ) : (
            filtered.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
              >
                {/* Info */}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* 👑 Role Badge */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-200 text-purple-700"
                        : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  {/* ❌ Delete */}
                  <button
                    onClick={() =>
                      deleteUser(user._id, user.role)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}