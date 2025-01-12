import React from 'react';
import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('auth_token'); // Remove token
  window.location.href = '/users/login_user'; // Redirect to login
};


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/invoice/display_invoices">
                Invoices
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sales">
                All Sales
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users/display_users">
                Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users/display_users">
                Producsts and Services
              </Link>
            </li>
            <li className="nav-item">
              <button type="button" className="btn btn-danger" onClick={() => handleLogout()}>Log out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  
  );
};

export default Header;
