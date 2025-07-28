import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Project Tracker
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/projects" className={isActive('/projects')}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="/resources" className={isActive('/resources')}>
              Resources
            </Link>
          </li>
          <li>
            <Link to="/milestones" className={isActive('/milestones')}>
              Milestones
            </Link>
          </li>
          <li>
            <Link to="/reports" className={isActive('/reports')}>
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;