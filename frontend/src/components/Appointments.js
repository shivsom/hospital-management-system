import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import apiService from '../services/apiService';

const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDateTime: '',
    reason: '',
    status: 'SCHEDULED'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiService.getAppointments();
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await apiService.updateAppointment(editingAppointment.id, formData);
      } else {
        await apiService.createAppointment(formData);
      }
      
      setShowModal(false);
      setEditingAppointment(null);
      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError('Failed to save appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId || '',
      doctorId: appointment.doctorId || '',
      appointmentDateTime: appointment.appointmentDateTime,
      reason: appointment.reason,
      status: appointment.status
    });
    setShowModal(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiService.deleteAppointment(appointmentId);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        setError('Failed to delete appointment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDateTime: '',
      reason: '',
      status: 'SCHEDULED'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'NO_SHOW':
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
        <h1>Appointments</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Book New Appointment
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(appointment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Appointment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                <option value="1">Arjun Singh</option>
                <option value="2">Kavya Patel</option>
                <option value="3">Rahul Mehta</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                required
              >
                <option value="">Select Doctor</option>
                <option value="1">Dr. Priya Sharma</option>
                <option value="2">Dr. Rajesh Kumar</option>
                <option value="3">Dr. Ananya Reddy</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.appointmentDateTime}
                onChange={(e) => setFormData({...formData, appointmentDateTime: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </Form.Group>

            {editingAppointment && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingAppointment ? 'Update' : 'Book'} Appointment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Appointments;