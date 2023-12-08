import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const EnrollStudentsMenu = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    birthDate: "",
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { groupData } = location.state || {};

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

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelectedStudents) => {
      if (prevSelectedStudents.includes(studentId)) {
        return prevSelectedStudents.filter((id) => id !== studentId);
      } else {
        return [...prevSelectedStudents, studentId];
      }
    });
  };

  const handleBatchEnroll = async () => {
    for (const studentId of selectedStudents) {
      const enrollUrl = `http://localhost:8080/groups/${groupData.id}/student/${studentId}`;

      try {
        const response = await fetch(enrollUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`Student ${studentId} enrolled successfully!`);
        } else {
          const errorResponse = await response.json();
          console.error(`Error enrolling student ${studentId}:`, errorResponse);
        }
      } catch (error) {
        console.error(`Error enrolling student ${studentId}:`, error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Students to Group - {groupData.groupName}</h2>
      <form onSubmit={handleFilterSubmit} className="mb-3">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">First Name:</label>
            <input
              type="text"
              value={filters.firstName}
              onChange={(e) => handleFilterChange(e, "firstName")}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              value={filters.lastName}
              onChange={(e) => handleFilterChange(e, "lastName")}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">PIN:</label>
            <input
              type="text"
              value={filters.pin}
              onChange={(e) => handleFilterChange(e, "pin")}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Birth Date:</label>
            <input
              type="text"
              value={filters.birthDate}
              onChange={(e) => handleFilterChange(e, "birthDate")}
              className="form-control"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Submit Filter
        </button>
      </form>
      {students.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>PIN</th>
                <th>Email</th>
                <th>Birth Date</th>
                <th>Select</th>
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
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(student.id)}
                      checked={selectedStudents.includes(student.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleBatchEnroll}
            disabled={selectedStudents.length === 0}
            className="btn btn-success"
          >
            Add Students
          </button>
        </div>
      ) : (
        <p>No students found.</p>
      )}
      <Link to="/groups" className="btn btn-secondary">
        Back
      </Link>
    </div>
  );
};

export default EnrollStudentsMenu;