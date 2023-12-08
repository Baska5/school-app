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
      } else if (response.status === 400) {
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
    <div className="container mt-4">
      <h2>Add New Group</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Group Name:</label>
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Group Number:</label>
          <input
            type="number"
            name="groupNumber"
            value={formData.groupNumber}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Group
        </button>
      </form>
      <Link to="/groups" className="btn btn-secondary mt-3">
        Back
      </Link>
    </div>
  );
};

export default AddGroupForm;