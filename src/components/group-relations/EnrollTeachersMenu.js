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
    <div>
      <h2>Add Teachers to Group - {groupData.groupName}</h2>
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
      {teachers.length > 0 ? (
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
          >
            Add Teachers
          </button>
        </div>
      ) : (
        <p>No teachers found.</p>
      )}
      <Link to="/groups">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default EnrollTeachersMenu;
