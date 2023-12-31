import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentMenu = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    birthDate: "",
  });
  const navigate = useNavigate();

  const apiUrl = "http://localhost:8080/students/search";

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}?${Object.entries(filters)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error fetching students");
        console.error("Error fetching students:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (student) => {
    console.log("Update student with ID:", student);
    navigate(`/update-student/${student.id}`, {
      state: { studentData: student },
    });
  };

  const handleDelete = async (studentId) => {
    console.log("Delete student with ID:", studentId);

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!shouldDelete) {
      return;
    }

    const apiUrl = `http://localhost:8080/students/${studentId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Student deleted successfully!");
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== studentId)
        );
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Error deleting student");
        console.error("Error deleting student:", errorResponse);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error deleting student:", error);
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
      <h2>Student Menu</h2>
      <form onSubmit={handleFilterSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              value={filters.firstName}
              onChange={(e) => handleFilterChange(e, "firstName")}
              placeholder="First Name"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              value={filters.lastName}
              onChange={(e) => handleFilterChange(e, "lastName")}
              placeholder="Last Name"
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              value={filters.pin}
              onChange={(e) => handleFilterChange(e, "pin")}
              placeholder="PIN"
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              value={filters.birthDate}
              onChange={(e) => handleFilterChange(e, "birthDate")}
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
      <Link to="/students/add" className="btn btn-success">
        Add New Student
      </Link>
      {students.length > 0 ? (
        <table className="table mt-3">
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
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.pin}</td>
                <td>{student.email}</td>
                <td>{student.birthDate}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(student)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}
      <Link to="/" className="btn btn-primary">
        Back
      </Link>
    </div>
  );
};

export default StudentMenu;
