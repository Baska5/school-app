import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Welcome to School Management System</h1>
      <div className="d-flex justify-content-between">
        <Link to="/students" className="w-100 me-2">
          <button className="btn btn-primary w-100 btn-lg custom-btn">Students</button>
        </Link>
        <Link to="/teachers" className="w-100 me-2">
          <button className="btn btn-secondary w-100 btn-lg custom-btn">Teachers</button>
        </Link>
        <Link to="/groups" className="w-100">
          <button className="btn btn-success w-100 btn-lg custom-btn">Groups</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;