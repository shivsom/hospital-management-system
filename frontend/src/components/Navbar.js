import React from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown } from 'react-bootstrap';

const Navbar = ({ user, onLogout }) => {
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="px-3">
      <BootstrapNavbar.Brand href="/">
        🏥 Hospital Management System
      </BootstrapNavbar.Brand>
      
      <BootstrapNavbar.Toggle />
      <BootstrapNavbar.Collapse className="justify-content-end">
        <Nav>
          <NavDropdown title={`👤 ${user?.email || 'User'}`} id="user-dropdown">
            <NavDropdown.Item href="/profile">
              Profile Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;