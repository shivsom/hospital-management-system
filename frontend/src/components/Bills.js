import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import apiService from '../services/apiService';

const Bills = ({ user }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await apiService.getBills();
      setBills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError('Failed to fetch bills');
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'OVERDUE':
        return 'danger';
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handlePayment = async (billId) => {
    try {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        const updatedBill = { ...bill, paymentStatus: 'PAID' };
        await apiService.updateBill(billId, updatedBill);
        fetchBills();
        alert('Payment processed successfully!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
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
        <h1>Bills & Payments</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Patient</th>
                <th>Service Date</th>
                <th>Consultation</th>
                <th>Tests</th>
                <th>Medication</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.billNumber}</td>
                  <td>{bill.patientName}</td>
                  <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td>₹{bill.consultationFee.toFixed(2)}</td>
                  <td>₹{bill.testFee.toFixed(2)}</td>
                  <td>₹{bill.medicationFee.toFixed(2)}</td>
                  <td><strong>₹{bill.totalAmount.toFixed(2)}</strong></td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(bill.paymentStatus)}>
                      {bill.paymentStatus}
                    </Badge>
                  </td>
                  <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      View Details
                    </Button>
                    {user?.role === 'PATIENT' && bill.paymentStatus !== 'PAID' && (
                      <Button
                        variant={bill.paymentStatus === 'OVERDUE' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handlePayment(bill.id)}
                      >
                        Pay Now
                      </Button>
                    )}
                    {bill.paymentStatus === 'PAID' && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                      >
                        Download Receipt
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

export default Bills;