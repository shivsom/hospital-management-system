import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import apiService from '../services/apiService';

const MedicalRecords = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await apiService.getMedicalRecords();
      setRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError('Failed to fetch medical records');
      setLoading(false);
    }
  };

  const handleGenerateSummary = async (record) => {
    try {
      setSelectedRecord(record);
      setAiSummary('Generating AI summary...');
      setShowSummaryModal(true);

      // Simulate AI API call
      setTimeout(() => {
        const mockSummary = `AI Summary for ${record.title}:\n\n• Patient: ${record.patientName}\n• Main Issue: ${record.diagnosis}\n• Treatment: ${record.prescription}\n• Key Test Results: ${record.testResults}\n• Recommendation: Continue current treatment plan and monitor progress.`;
        setAiSummary(mockSummary);
      }, 2000);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAiSummary('Failed to generate AI summary. Please try again.');
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
        <h1>Medical Records</h1>
        {user?.role === 'DOCTOR' && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Record
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Diagnosis</th>
                <th>AI Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td>{record.title}</td>
                  <td>{record.patientName}</td>
                  <td>{record.doctorName}</td>
                  <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                  <td>{record.diagnosis}</td>
                  <td>
                    {record.aiSummary ? (
                      <Badge bg="success">Available</Badge>
                    ) : (
                      <Badge bg="secondary">Not Generated</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleGenerateSummary(record)}
                    >
                      🤖 AI Summary
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Medical Record Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRecord ? 'Medical Record Details' : 'Add New Medical Record'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord ? (
            <div>
              <h5>{selectedRecord.title}</h5>
              <hr />
              <p><strong>Patient:</strong> {selectedRecord.patientName}</p>
              <p><strong>Doctor:</strong> {selectedRecord.doctorName}</p>
              <p><strong>Date:</strong> {new Date(selectedRecord.recordDate).toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedRecord.description}</p>
              <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
              <p><strong>Prescription:</strong> {selectedRecord.prescription}</p>
              <p><strong>Test Results:</strong> {selectedRecord.testResults}</p>
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter record title" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter description" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Diagnosis</Form.Label>
                <Form.Control type="text" placeholder="Enter diagnosis" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prescription</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Enter prescription" />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {!selectedRecord && (
            <Button variant="primary">
              Save Record
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* AI Summary Modal */}
      <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🤖 AI Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: 'pre-line', minHeight: '200px' }}>
            {aiSummary}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicalRecords;