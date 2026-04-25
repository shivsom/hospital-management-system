import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your HMS AI Assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const predefinedResponses = {
    'book appointment': 'To book an appointment, go to the Appointments section and click "Book New Appointment". Select your preferred doctor and available time slot.',
    'payment': 'You can view and pay your bills in the Bills section. We accept credit cards, debit cards, and online banking.',
    'medical records': 'Your medical records are available in the Medical Records section. You can view your history and download reports there.',
    'contact': 'You can reach us at: Phone: +1234567890, Email: info@hospital.com, Address: 123 Hospital Street, Medical City',
    'doctors': 'You can view all available doctors in the Doctors section. Filter by specialization to find the right doctor for your needs.',
    'emergency': 'For emergencies, please call 911 immediately or visit our Emergency Department. For non-emergencies, you can book an appointment online.',
    'hours': 'Our hospital is open 24/7. Regular clinic hours are Monday-Friday 8AM-6PM, Saturday 9AM-4PM. Emergency services are available 24/7.',
    'insurance': 'We accept most major insurance plans. Please bring your insurance card to your appointment. You can verify coverage by calling your insurance provider.',
    'lab results': 'Lab results are typically available within 24-48 hours. You can view them in your Medical Records section or we\'ll call you if immediate attention is needed.',
    'prescription': 'Prescription refills can be requested through your patient portal or by calling our pharmacy at +1234567895. Allow 24-48 hours for processing.'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const lowercaseInput = inputText.toLowerCase();
      let botResponse = 'I understand you\'re asking about that. Let me help you with some general information:';

      // Find matching response
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowercaseInput.includes(key)) {
          botResponse = value;
          break;
        }
      }

      // Default responses for common questions
      if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        botResponse = 'Hello! How can I assist you with your healthcare needs today?';
      } else if (lowercaseInput.includes('help')) {
        botResponse = 'I can help you with: booking appointments, payment information, medical records, doctor information, hospital hours, and general inquiries. What would you like to know?';
      } else if (lowercaseInput.includes('thank')) {
        botResponse = 'You\'re welcome! Is there anything else I can help you with today?';
      }

      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header d-flex justify-content-between align-items-center">
        <span>🤖 HMS AI Assistant</span>
        <Button variant="link" className="text-white p-0" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex">
            <Form.Control
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <Button type="submit" variant="primary" className="ms-2" disabled={loading}>
              Send
            </Button>
          </div>
        </Form>
        
        <div className="mt-2">
          <small className="text-muted">
            Try asking about: appointments, payments, doctors, medical records, emergency, hours
          </small>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;