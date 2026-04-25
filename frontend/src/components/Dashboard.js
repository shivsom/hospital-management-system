import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import apiService from '../services/apiService';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // This would normally fetch real data from the API
      setStats({
        totalAppointments: 156,
        todayAppointments: 3,
        totalPatients: 89,
        totalDoctors: 15
      });

      setRecentAppointments([
        {
          id: 1,
          patientName: 'Arjun Singh',
          doctorName: 'Dr. Priya Sharma',
          appointmentDateTime: '2024-01-15T10:00:00',
          status: 'SCHEDULED'
        },
        {
          id: 2,
          patientName: 'Kavya Patel',
          doctorName: 'Dr. Rajesh Kumar',
          appointmentDateTime: '2024-01-15T14:30:00',
          status: 'COMPLETED'
        },
        {
          id: 3,
          patientName: 'Rahul Mehta',
          doctorName: 'Dr. Ananya Reddy',
          appointmentDateTime: '2024-01-15T16:00:00',
          status: 'SCHEDULED'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
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
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <Card.Text className="display-6">{stats.totalAppointments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card success">
            <Card.Body>
              <Card.Title>Today's Appointments</Card.Title>
              <Card.Text className="display-6">{stats.todayAppointments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card warning">
            <Card.Body>
              <Card.Title>Total Patients</Card.Title>
              <Card.Text className="display-6">{stats.totalPatients}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card danger">
            <Card.Body>
              <Card.Title>Total Doctors</Card.Title>
              <Card.Text className="display-6">{stats.totalDoctors}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Recent Appointments</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.doctorName}</td>
                      <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;