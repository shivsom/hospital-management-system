import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = ({ user }) => {
  const menuItems = [
    { path: '/dashboard', label: '📊 Dashboard', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { path: '/appointments', label: '📅 Appointments', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { path: '/patients', label: '👥 Patients', roles: ['ADMIN', 'DOCTOR'] },
    { path: '/doctors', label: '👨‍⚕️ Doctors', roles: ['ADMIN', 'PATIENT'] },
    { path: '/medical-records', label: '📋 Medical Records', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { path: '/bills', label: '💰 Bills', roles: ['ADMIN', 'PATIENT'] }
  ];

  const userRole = user?.role || 'PATIENT';

  return (
    <div className="sidebar bg-light p-3">
      <Nav className="flex-column">
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map((item, index) => (
            <LinkContainer key={index} to={item.path}>
              <Nav.Link className="py-2">
                {item.label}
              </Nav.Link>
            </LinkContainer>
          ))}
      </Nav>
    </div>
  );
};

export default Sidebar;