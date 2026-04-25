import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import apiService from '../services/apiService';

const Doctors = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiService.getDoctors();
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'secondary';
      case 'ON_LEAVE':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Doctors</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Qualification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.firstName} {doctor.lastName}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.experienceYears} years</td>
                  <td>{doctor.qualification}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(doctor.status)}>
                      {doctor.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      View Profile
                    </Button>
                    {user?.role === 'PATIENT' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={doctor.status !== 'ACTIVE'}
                      >
                        Book Appointment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Doctors;