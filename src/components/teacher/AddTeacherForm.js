import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddTeacherForm = () => {
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

    const apiUrl = "http://localhost:8080/teachers";

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
        console.log("Teacher added successfully!");
        setError(null);
        setSuccessMessage("Teacher added successfully!");
      } else if (response.status === 400) {
        setSuccessMessage(null);
        const errorResponse = await response.json();
        const { errors } = errorResponse;
        const errorMessage = errors.join(", ");
        setError(errorMessage);
      } else {
        setSuccessMessage(null);
        setError("Error updating teacher");
      }
    } catch (error) {
      setSuccessMessage(null);
      setError("An unexpected error occurred");
      console.error("Error adding teacher:", error);
    }
  };

  return (
    <div>
      <h2>Add New Teacher</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          PIN:
          <input
            type="text"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Birth Date:
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Add Teacher</button>
      </form>
      <Link to="/teachers">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default AddTeacherForm;
