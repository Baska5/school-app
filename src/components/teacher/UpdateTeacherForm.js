import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpdateTeacherForm = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('UpdateTeacherForm location:', location);
  const { teacherData } = location.state || {};
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pin: '',
    email: '',
    birthDate: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teacherData) {
      setFormData({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        pin: teacherData.pin,
        email: teacherData.email,
        birthDate: teacherData.birthDate,
      });
    }
  }, [teacherData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `http://localhost:8080/teachers/${teacherData.id}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Teacher updated successfully!');
        setError(null);
        navigate('/teachers');
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(', ');
        setError(errorMessage);
      } else {
        setError('Error updating teacher');
      }
    } catch (error) {
      setError('Error updating teacher');
      console.error('Error updating teacher:', error);
    }
  };

  const handleCancel = () => {
    navigate('/teachers');
  };


  return (
    <div>
      <h2>Update Teacher</h2>
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
        <button type="submit">Update Teacher</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateTeacherForm;