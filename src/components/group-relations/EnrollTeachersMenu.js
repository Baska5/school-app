import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const EnrollTeachersMenu = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    pin: "",
    birthDate: "",
  });
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { groupData } = location.state || {};

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

  const handleCheckboxChange = (teacherId) => {
    setSelectedTeachers((prevSelectedTeachers) => {
      if (prevSelectedTeachers.includes(teacherId)) {
        return prevSelectedTeachers.filter((id) => id !== teacherId);
      } else {
        return [...prevSelectedTeachers, teacherId];
      }
    });
  };

  const handleBatchEnroll = async () => {
    for (const teacherId of selectedTeachers) {
      const enrollUrl = `http://localhost:8080/groups/${groupData.id}/teacher/${teacherId}`;

      try {
        const response = await fetch(enrollUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`Teacher ${teacherId} enrolled successfully!`);
        } else {
          const errorResponse = await response.json();
          console.error(`Error enrolling teacher ${teacherId}:`, errorResponse);
        }
      } catch (error) {
        console.error(`Error enrolling teacher ${teacherId}:`, error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Teachers to Group - {groupData.groupName}</h2>
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
      {teachers.length > 0 ? (
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
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.firstName}</td>
                  <td>{teacher.lastName}</td>
                  <td>{teacher.pin}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.birthDate}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(teacher.id)}
                      checked={selectedTeachers.includes(teacher.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleBatchEnroll}
            disabled={selectedTeachers.length === 0}
            className="btn btn-success"
          >
            Add Teachers
          </button>
        </div>
      ) : (
        <p>No teachers found.</p>
      )}
      <Link to="/groups" className="btn btn-secondary">
        Back
      </Link>
    </div>
  );
};

export default EnrollTeachersMenu;