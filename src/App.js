import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './components/LandingPage';

import StudentMenu from './components/student/StudentMenu';
import AddStudentForm from './components/student/AddStudentForm';
import UpdateStudentForm from './components/student/UpdateStudentForm';

import TeacherMenu from './components/teacher/TeacherMenu';
import AddTeacherForm from './components/teacher/AddTeacherForm';
import UpdateTeacherForm from './components/teacher/UpdateTeacherForm';

import GroupMenu from './components/group/GroupMenu';
import AddGroupForm from './components/group/AddGroupForm';
import UpdateGroupForm from './components/group/UpdateGroupForm';

import EnrollStudentsMenu from './components/group-relations/EnrollStudentsMenu';
import EnrollTeachersMenu from './components/group-relations/EnrollTeachersMenu';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/students" element={<StudentMenu />} />
        <Route path="/students/add" element={<AddStudentForm />} />
        <Route path="/update-student/:studentId" element={<UpdateStudentForm />} />

        <Route path="/teachers" element={<TeacherMenu />} />
        <Route path="/teachers/add" element={<AddTeacherForm />} />
        <Route path="/update-teacher/:teacherId" element={<UpdateTeacherForm />} />

        <Route path="/groups" element={<GroupMenu />} />
        <Route path="/groups/add" element={<AddGroupForm />} />
        <Route path="/update-group/:groupId" element={<UpdateGroupForm />} />

        <Route path="/:groupId/students" element={<EnrollStudentsMenu />} />
        <Route path="/:groupId/teachers" element={<EnrollTeachersMenu />} />
      </Routes>
    </Router>
  );
};

export default App;