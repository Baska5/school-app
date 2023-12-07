import { React, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const GroupDetailsMenu = () => {
  const location = useLocation();
  const { groupData } = location.state || {};
  const [teachers, setTeachers] = useState(groupData.teachers);
  const [students, setStudents] = useState(groupData.students);

  const fetchData = async () => {
    try {
      const apiUrl = `http://localhost:8080/groups/${groupData.id}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const updatedGroupData = await response.json();
        setTeachers(updatedGroupData.teachers);
        setStudents(updatedGroupData.students);
      } else {
        const errorResponse = await response.json();
        console.error("Error fetching updated group details:", errorResponse);
      }
    } catch (error) {
      console.error("Unexpected error fetching updated group details:", error);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    try {
      const apiUrl = `http://localhost:8080/groups/${groupData.id}/teacher/${teacherId}`;
      const response = await fetch(apiUrl, { method: "DELETE" });

      if (response.ok) {
        console.log("Teacher removed successfully!");
        fetchData();
      } else {
        const errorResponse = await response.json();
        console.error("Error removing teacher:", errorResponse);
      }
    } catch (error) {
      console.error("Unexpected error removing teacher:", error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const apiUrl = `http://localhost:8080/groups/${groupData.id}/student/${studentId}`;
      const response = await fetch(apiUrl, { method: "DELETE" });

      if (response.ok) {
        console.log("Student removed successfully!");
        fetchData();
      } else {
        const errorResponse = await response.json();
        console.error("Error removing student:", errorResponse);
      }
    } catch (error) {
      console.error("Unexpected error removing student:", error);
    }
  };

  return (
    <div>
      <h2>{`Group - ${groupData.groupName}`}</h2>

      <section>
        <h3>Teachers</h3>
        {teachers.length > 0 ? (
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
                    <button onClick={() => handleRemoveTeacher(teacher.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No teachers found for this group.</p>
        )}
      </section>

      <section>
        <h3>Students</h3>
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
                    <button onClick={() => handleRemoveStudent(student.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found for this group.</p>
        )}
      </section>
      <Link to="/groups">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default GroupDetailsMenu;
