import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const UserEnabDis = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState(""); // Track search input
    const [searchQuery, setSearchQuery] = useState("");

  const [userData, setUserData] = useState([
    { id: "user1", name: "User 1", enabled: false },
    { id: "user2", name: "User 2", enabled: false },
    { id: "user3", name: "User 3", enabled: false },
    { id: "user4", name: "User 4", enabled: false },
    { id: "user5", name: "User 5", enabled: false },
  ]);

  // Convert user data for react-select
  const userOptions = userData.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  // Handle user selection
  const handleUserSelect = (option) => {
    const selected = userData.find((b) => b.id === option.value);
    setSelectedUser(selected);
    setSearchQuery(selected.name); // Set search query to highlight selected bank in table
  };

  // Toggle Enable/Disable status
  const handleToggle = (id) => {
    setUserData((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, enabled: !user.enabled } : user
      )
    );

  
  
    // Update selected user if it is the one being toggled
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser((prev) => ({ ...prev, enabled: !prev.enabled }));
    }
  };

  const dropdownOptions = dropdownSearch
  ? userData.map((user) => ({ value: user.id, label: user.name })) // Show all when searching
  : userData.slice(0, 3).map((user) => ({ value: user.id, label: user.name })); // Show only top 3 by default

  const filteredBanks = userData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = filteredBanks.sort((a, b) => {
    if (a.name.toLowerCase() === searchQuery.toLowerCase()) return -1;
    return 0;
  });

  return (
    <>
    <div className="container mt-3">
       <div className="card">
          <div className="card-header">
          <h3 className="mb-3">User Enable/Disable</h3>
          </div>
          <div className="card-body">
          <div className="container mt-4">

{/* Search User */}
<div className="mb-3">
  <label className="form-label">Search User</label>
  {/* <Select
    options={userOptions}
    value={selectedUser ? { value: selectedUser.id, label: selectedUser.name } : null}
    onChange={handleUserSelect}
    placeholder="Search and select a user..."
    isSearchable
  /> */}
  <Select
              options={dropdownOptions}
              value={selectedUser ? { value: selectedUser.id, label: selectedUser.name } : null}
              onChange={handleUserSelect}
              placeholder="Search and select a bank..."
              isSearchable
              onInputChange={(input) => setDropdownSearch(input)}
            />
</div>

{/* User Table */}
<table className="table table-bordered">
  <thead className="table-dark">
    <tr>
      <th>Sr No</th>
      <th>User Name</th>
      <th>User ID</th>
      <th>Enable/Disable</th>
    </tr>
  </thead>
  <tbody>
    {sortedUsers.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.id}</td>
        <td>
          <button
            className={`btn btn-sm ${user.enabled ? "btn-danger" : "btn-success"}`}
            onClick={() => handleToggle(user.id)}
          >
            {user.enabled ? "Disable" : "Enable"}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
          </div>
       </div>
    </div>
 
    </>
  );
};

export default UserEnabDis;
