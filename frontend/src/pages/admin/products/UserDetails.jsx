import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../../context/ShopContext";

const UsersList = () => {
  const { token } = useContext(ShopContext);
  const [users, setUsers] = useState([]);
  const [newRole, setNewRole] = useState(""); // Holds the selected role
  const [selectedUserId, setSelectedUserId] = useState(""); // Holds the selected user ID for role update
  const [newRoleName, setNewRoleName] = useState("");
    const [roles, setRoles] = useState([]); // State to store roles


  useEffect(() => {
    // Fetch all users from the backend
    axios
      .get("http://localhost:5189/api/Auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error loading users.");
      });
  }, [token]);

  // Function to handle role change for a specific user
  const handleRoleChange = async (userId) => {
    try {
        const response = await axios.put(
            `http://localhost:5189/api/Roles/update-role/${userId}`,
            { role: newRole }, // Send the role as an object
            {
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success("User role updated successfully!");
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.log("Response error", error.response);
            toast.error(`Error: ${error.response.data.message}`);
        } else {
            toast.error("An error occurred while updating the role.");
        }
    }
};

useEffect(() => {
    // Fetch roles from the backend
    axios
      .get("http://localhost:5189/api/Roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles(response.data); // Set the roles from the backend response
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error loading roles.");
      });
  }, [token]);

  // Function to delete a role
  const handleDeleteRole = async (roleId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5189/api/Roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setRoles(roles.filter((role) => role.id !== roleId)); // Remove the deleted role from the list
        toast.success("Role deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting role.");
    }
  };

  // Function to create a new role
  const handleCreateRole = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5189/api/Roles",
        { roleName: newRoleName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setRoles([...roles, response.data]); // Add the new role to the list
        setNewRoleName(""); // Clear input field
        toast.success("Role created successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating role.");
    }
  };

  if (!users.length) {
    return <div>Loading users...</div>; // Kthe një mesazh ngarkimi nëse nuk ka përdorues ende
  }

  return (
    <div className="ml-10 mt-4">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">List of users</h2>
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-blue-600 text-white">
      <tr>
        <th className="px-6 py-4 text-left">Name</th>
        <th className="px-6 py-4 text-left">Email</th>
        <th className="px-6 py-4 text-left">Role</th>
        <th className="px-6 py-4 text-left">Update Role</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id} className="border-b hover:bg-gray-100">
          <td className="px-6 py-4">{user.name}</td>
          <td className="px-6 py-4">{user.email}</td>
          <td className="px-6 py-4">{user.roles.join(", ")}</td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <select
                value={selectedUserId === user.id ? newRole : ""}
                onChange={(e) => {
                  setSelectedUserId(user.id);
                  setNewRole(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Choose role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <button
                onClick={() => handleRoleChange(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
              >
                Update Role
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <h2 className="text-2xl font-semibold mt-8 mb-6 text-gray-800">Roles List</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Role Name</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4">{role.name}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                >
                  Delete Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter new role name"
        />
        <button
          onClick={handleCreateRole}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all ml-4"
        >
          Create Role
        </button>
      </div>
</div>

  );
};

export default UsersList;
