import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TeacherMenu = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    birthDate: "",
  });
  const navigate = useNavigate();

  const apiUrl = "http://localhost:8080/teachers/search";

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}?${Object.entries(filters)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      );

      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error fetching teachers");
        console.error("Error fetching teachers:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (teacher) => {
    console.log("Update teacher with ID:", teacher.id);
    navigate(`/update-teacher/${teacher.id}`, {
      state: { teacherData: teacher },
    });
  };

  const handleDelete = async (teacherId) => {
    console.log("Delete teacher with ID:", teacherId);

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!shouldDelete) {
      return;
    }

    const apiUrl = `http://localhost:8080/teachers/${teacherId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Teacher deleted successfully!");
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== teacherId)
        );
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error deleting teacher");
        console.error("Error deleting teacher:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error deleting teacher:", error);
    }
  };

  const handleFilterChange = (e, filterKey) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: e.target.value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h2>Teacher Menu</h2>
      <form onSubmit={handleFilterSubmit} className="mb-3">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              value={filters.firstName}
              onChange={(e) => handleFilterChange(e, "firstName")}
              className="form-control"
              placeholder="First Name"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              value={filters.lastName}
              onChange={(e) => handleFilterChange(e, "lastName")}
              className="form-control"
              placeholder="Last Name"
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              value={filters.pin}
              onChange={(e) => handleFilterChange(e, "pin")}
              className="form-control"
              placeholder="PIN"
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              value={filters.birthDate}
              onChange={(e) => handleFilterChange(e, "birthDate")}
              className="form-control"
              placeholder="Birth Date"
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary">
              Submit Filter
            </button>
          </div>
        </div>
      </form>
      <Link to="/teachers/add" className="btn btn-success mb-2">
        Add New Teacher
      </Link>
      {teachers.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>PIN</th>
              <th>Email</th>
              <th>Birth Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.firstName}</td>
                <td>{teacher.lastName}</td>
                <td>{teacher.pin}</td>
                <td>{teacher.email}</td>
                <td>{teacher.birthDate}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(teacher)}
                    className="btn btn-warning btn-sm"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No teachers found.</p>
      )}
      <Link to="/" className="btn btn-secondary">
        Back
      </Link>
    </div>
  );
};

export default TeacherMenu;