import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import apiService from '../services/apiService';

const Patients = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
      setLoading(false);
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
        <h1>Patients</h1>
        {user?.role === 'ADMIN' && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Patient
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phoneNumber}</td>
                  <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.bloodGroup?.replace('_', ' ')}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingPatient(patient);
                        setShowModal(true);
                      }}
                    >
                      View/Edit
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                    >
                      Medical History
                    </Button>
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

export default Patients;