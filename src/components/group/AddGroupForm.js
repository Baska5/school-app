import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddGroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    groupNumber: 0
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

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
        setFormData({
          groupName: '',
          groupNumber: 0
        });
        console.log('Group added successfully!');
        setError(null);
        setSuccessMessage('Group added successfully!');
      } else if (response.status === 400){
        setSuccessMessage(null);
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(', ');
        setError(errorMessage);
      } else {
        setSuccessMessage(null);
        setError('Error adding group');
      }
    } catch (error) {
      setSuccessMessage(null);
      setError('An unexpected error occurred');
      console.error('Error adding group:', error);
    }
  };

  return (
    <div>
      <h2>Add New Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
      </form>
      <Link to="/groups">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default AddGroupForm;