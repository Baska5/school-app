import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateStudentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentData } = location.state || {};
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    email: "",
    birthDate: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentData) {
      setFormData({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        pin: studentData.pin,
        email: studentData.email,
        birthDate: studentData.birthDate,
      });
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `http://localhost:8080/students/${studentData.id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Student updated successfully!");
        setError(null);
        navigate("/students");
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(", ");
        setError(errorMessage);
      } else {
        setError("Error updating student");
      }
    } catch (error) {
      setError("Error updating student");
      console.error("Error updating student:", error);
    }
  };

  const handleCancel = () => {
    navigate("/students");
  };

  return (
    <div className="container mt-4">
      <h2>Update Student</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">PIN:</label>
          <input
            type="text"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Student
        </button>
        <button type="button" onClick={handleCancel} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateStudentForm;