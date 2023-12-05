import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const StudentMenu = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    pin: '',
    birthDate: '',
  });
  const navigate = useNavigate();

  const apiUrl = 'http://localhost:8080/students/search';

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}?${Object.entries(filters)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || 'Error fetching students');
        console.error('Error fetching students:', errorResponse);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Load initial data without any filter
  }, []); // Empty dependency array ensures it only runs on mount

  const handleUpdate = (student) => {
    console.log('Update student with ID:', student);
    navigate(`/update-student/${student.id}`, { state: { studentData: student } });
  };

  const handleDelete = async (studentId) => {
    console.log('Delete student with ID:', studentId);

    const shouldDelete = window.confirm('Are you sure you want to delete this student?');

    if (!shouldDelete) {
      return;
    }

    const apiUrl = `http://localhost:8080/students/${studentId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Student deleted successfully!');
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || 'Error deleting student');
        console.error('Error deleting student:', errorResponse);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error deleting student:', error);
    }
  };

  const handleFilterChange = (e, filterKey) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <h2>Student Menu</h2>
      <form onSubmit={handleFilterSubmit}>
        <label>
          First Name:
          <input type="text" value={filters.firstName} onChange={(e) => handleFilterChange(e, 'firstName')} />
        </label>
        <label>
          Last Name:
          <input type="text" value={filters.lastName} onChange={(e) => handleFilterChange(e, 'lastName')} />
        </label>
        <label>
          PIN:
          <input type="text" value={filters.pin} onChange={(e) => handleFilterChange(e, 'pin')} />
        </label>
        <label>
          Birth Date:
          <input type="text" value={filters.birthDate} onChange={(e) => handleFilterChange(e, 'birthDate')} />
        </label>
        <button type="submit">Submit Filter</button>
      </form>
      <Link to="/students/add">
        <button>Add New Student</button>
      </Link>
      {students.length > 0 ? (
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
                  <button onClick={() => handleUpdate(student)}>Update</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default StudentMenu;