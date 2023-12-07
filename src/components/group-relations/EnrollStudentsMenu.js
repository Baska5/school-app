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
    <div>
      <h2>Add Students to Group - {groupData.groupName}</h2>
      <form onSubmit={handleFilterSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={filters.firstName}
            onChange={(e) => handleFilterChange(e, "firstName")}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={filters.lastName}
            onChange={(e) => handleFilterChange(e, "lastName")}
          />
        </label>
        <label>
          PIN:
          <input
            type="text"
            value={filters.pin}
            onChange={(e) => handleFilterChange(e, "pin")}
          />
        </label>
        <label>
          Birth Date:
          <input
            type="text"
            value={filters.birthDate}
            onChange={(e) => handleFilterChange(e, "birthDate")}
          />
        </label>
        <button type="submit">Submit Filter</button>
      </form>
      {students.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>PIN</th>
                <th>Email</th>
                <th>Birth Date</th>
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
          >
            Add Students
          </button>
        </div>
      ) : (
        <p>No students found.</p>
      )}
      <Link to="/groups">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default EnrollStudentsMenu;
