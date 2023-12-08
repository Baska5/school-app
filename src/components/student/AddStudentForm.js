import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    email: "",
    birthDate: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/students";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          pin: "",
          email: "",
          birthDate: "",
        });
        console.log("Student added successfully!");
        setError(null);
        setSuccessMessage("Student added successfully!");
      } else if (response.status === 400) {
        setSuccessMessage(null);
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(", ");
        setError(errorMessage);
      } else {
        setSuccessMessage(null);
        setError("Error adding student");
      }
    } catch (error) {
      setSuccessMessage(null);
      setError("An unexpected error occurred");
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Student</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
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
        <button type="submit" className="btn btn-primary">Add Student</button>
      </form>
      <Link to="/students" className="btn btn-secondary mt-3">Back</Link>
    </div>
  );
};

export default AddStudentForm;
