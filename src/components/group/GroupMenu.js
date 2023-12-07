import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const GroupMenu = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const apiUrl = "http://localhost:8080/groups/search";

  const fetchData = async (filterParam = "") => {
    try {
      const response = await fetch(`${apiUrl}?groupNumber=${filterParam}`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error fetching groups");
        console.error("Error fetching groups:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (group) => {
    console.log("Update group with ID:", group);
    navigate(`/update-group/${group.id}`, { state: { groupData: group } });
  };

  const handleDelete = async (groupId) => {
    console.log("Delete group with ID:", groupId);
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!shouldDelete) {
      return;
    }

    const deleteUrl = `http://localhost:8080/groups/${groupId}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Group deleted successfully!");
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error deleting group");
        console.error("Error deleting group:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error deleting group:", error);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterValue = e.target.elements.filter.value;
    setFilter(filterValue);
    fetchData(filterValue);
  };

  const handleAddStudents = (group) => {
    navigate(`/${group.id}/students`, { state: { groupData: group } });
  };

  const handleAddTeachers = (group) => {
    navigate(`/${group.id}/teachers`, { state: { groupData: group } });
  };

  const handleDetails = (group) => {
    navigate(`/groups/${group.id}`, { state: { groupData: group } });
  };

  return (
    <div>
      <h2>Group Menu</h2>
      <form onSubmit={handleFilterSubmit}>
        <label>
          Group Number:
          <input type="text" name="filter" />
        </label>
        <button type="submit">Submit Filter</button>
      </form>
      <Link to="/groups/add">
        <button>Add New Group</button>
      </Link>
      {groups.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Group Number</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.groupName}</td>
                <td>{group.groupNumber}</td>
                <td>
                  <button onClick={() => handleUpdate(group)}>Update</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(group.id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleAddStudents(group)}>
                    Add Students
                  </button>
                </td>
                <td>
                  <button onClick={() => handleAddTeachers(group)}>
                    Add Teachers
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDetails(group)}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No groups found.</p>
      )}
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default GroupMenu;
