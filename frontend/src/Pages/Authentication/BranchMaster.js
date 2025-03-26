import React, { useState } from "react";
import Select from "react-select";

const accessTypes = [
  { value: "user", label: "User" },
  { value: "branch", label: "Branch" },
];

const users = [
  { value: "user1", label: "Demo User 1" },
  { value: "user2", label: "Demo User 2" },
  { value: "user3", label: "Demo User 3" },
  { value: "user4", label: "Demo User 4" },
  { value: "user5", label: "Demo User 5" },
];

const branches = [
  { value: "branch1", label: "Demo Branch 1" },
  { value: "branch2", label: "Demo Branch 2" },
  { value: "branch3", label: "Demo Branch 3" },
  { value: "branch4", label: "Demo Branch 4" },
  { value: "branch5", label: "Demo Branch 5" },
];

const menus = [
  { value: "menu1", label: "Menu 1" },
  { value: "menu2", label: "Menu 2" },
  { value: "menu3", label: "Menu 3" },
  { value: "menu4", label: "Menu 4" },
  { value: "menu5", label: "Menu 5" },
];

const BranchMaster = () => {
  const [selectedAccessType, setSelectedAccessType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([]);

  // Determine options for second dropdown based on Access Type selection
  const secondDropdownOptions =
    selectedAccessType?.value === "user" ? users : branches;

  return (
    <>
    <div className="container mt-3">
       <div className="card">
          <div className="card-header">
          <h2>User Branch Access</h2>
          </div>
          <div className="card-body">
          <label>Access Type:</label>
      <Select
        options={accessTypes}
        onChange={(selected) => {
          setSelectedAccessType(selected);
          setSelectedOption(null); // Reset second dropdown when access type changes
        }}
        placeholder="Select Access Type"
      />
      <br />

      {/* Second Dropdown (User or Branch) */}
      {selectedAccessType && (
        <Select
          options={secondDropdownOptions}
          onChange={setSelectedOption}
          placeholder={`Select ${selectedAccessType.label}`}
        />
      )}
      <br />

      {/* Multi-Select Menu Dropdown */}
      {selectedAccessType && selectedOption && (
        <>
          <label>Menu Selection:</label>
          <Select
            options={menus}
            isMulti
            onChange={setSelectedMenus}
            placeholder="Select Menus"
          />
        </>
      )}

      {/* Display Selected Menus */}
      <br />
      {selectedMenus.length > 0 && (
        <div>
          <h3>Selected Menus:</h3>
          <ul>
            {selectedMenus.map((menu) => (
              <li key={menu.value}>{menu.label}</li>
            ))}
          </ul>
        </div>
      )}
          </div>
       </div>
    </div>
    </>
  );
};

export default BranchMaster;
