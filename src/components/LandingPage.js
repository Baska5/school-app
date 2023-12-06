import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to School Management System</h1>
      <div>
        <Link to="/students">
          <button>Students</button>
        </Link>
        <Link to="/teachers">
          <button>Teachers</button>
        </Link>
        <Link to="/groups">
          <button>Groups</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;