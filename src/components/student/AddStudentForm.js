import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pin: '',
    email: '',
    birthDate: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'http://localhost:8080/students';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Student added successfully!');
        // Redirect to student list
        navigate('/students');
      } const errorResponse = await response.json();
      const { errors } = errorResponse;
      if (errors && Array.isArray(errors)) {
        const errorMessage = errors.join(', ');
        setError(errorMessage);
      } else {
        setError(errorResponse.message || 'Error updating student');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error adding student:', error);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  return (
    <div>
      <h2>Add New Student</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          PIN:
          <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Birth Date:
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Add Student</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddStudentForm;