import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddGroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    groupNumber: 0
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'http://localhost:8080/groups';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Group added successfully!');
        navigate('/groups');
      } else {
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        if (errors && Array.isArray(errors)) {
          const errorMessage = errors.join(', ');
          setError(errorMessage);
        } else {
          setError(errorResponse.message || 'Error updating group');
        }
        console.error('Error updating group:', errorResponse);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error adding group:', error);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  return (
    <div>
      <h2>Add New Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input type="text" name="groupName" value={formData.groupName} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Group Number:
          <input type="number" name="groupNumber" value={formData.groupNumber} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Add Group</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddGroupForm;