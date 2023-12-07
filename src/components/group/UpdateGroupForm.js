import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateGroupForm = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupData } = location.state || {};
  const [formData, setFormData] = useState({
    groupName: "",
    groupNumber: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (groupData) {
      setFormData({
        groupName: groupData.groupName,
        groupNumber: groupData.groupNumber,
      });
    }
  }, [groupData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `http://localhost:8080/groups/${groupData.id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Group updated successfully!");
        setError(null);
        navigate("/groups");
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(", ");
        setError(errorMessage);
      } else {
        setError("Error updating group");
      }
    } catch (error) {
      setError("Error updating group");
      console.error("Error updating group:", error);
    }
  };

  const handleCancel = () => {
    navigate("/groups");
  };

  return (
    <div>
      <h2>Update Group</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Group Number:
          <input
            type="number"
            name="groupNumber"
            value={formData.groupNumber}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Update Group</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateGroupForm;
