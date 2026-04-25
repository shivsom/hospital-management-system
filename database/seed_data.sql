-- Sample data for HMS database
USE hdm;

-- Insert sample users (passwords are hashed version of the plaintext mentioned in comments)
INSERT INTO users (first_name, last_name, email, password, phone_number, address, role) VALUES
-- Admin user (password: admin123)
('Soham', 'Patil', 'soham@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543210', '123 Hospital Lane, Mumbai, Maharashtra', 'ADMIN'),

-- Doctor users (password: doctor123)
('Dr. Priya', 'Sharma', 'priya.sharma@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543211', '456 Medical Tower, Delhi, Delhi', 'DOCTOR'),
('Dr. Rajesh', 'Kumar', 'rajesh.kumar@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543212', '789 Health Plaza, Bangalore, Karnataka', 'DOCTOR'),
('Dr. Ananya', 'Reddy', 'ananya.reddy@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543213', '321 Care Street, Hyderabad, Telangana', 'DOCTOR'),

-- Patient users (password: patient123)
('Arjun', 'Singh', 'arjun.singh@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543214', '101 MG Road, Mumbai, Maharashtra', 'PATIENT'),
('Kavya', 'Patel', 'kavya.patel@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543215', '202 Connaught Place, Delhi, Delhi', 'PATIENT'),
('Rahul', 'Mehta', 'rahul.mehta@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543216', '303 Brigade Road, Bangalore, Karnataka', 'PATIENT'),
('Demo', 'Patient', 'patient@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543217', '999 Demo Colony, Pune, Maharashtra', 'PATIENT');

-- Insert doctors data
INSERT INTO doctors (user_id, specialization, license_number, experience_years, qualification, department, status) VALUES
(2, 'Cardiology', 'MD12345', 15, 'MD, PhD in Cardiology', 'Heart Center', 'ACTIVE'),
(3, 'Neurology', 'MD12346', 12, 'MD, MS in Neurology', 'Neuroscience Department', 'ACTIVE'),
(4, 'Pediatrics', 'MD12347', 8, 'MD in Pediatrics', 'Children\'s Wing', 'ACTIVE');

-- Insert patients data
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_number) VALUES
(5, '1985-05-15', 'MALE', 'O_POSITIVE', 'Ravi Singh', '+919876543220'),
(6, '1990-08-22', 'FEMALE', 'A_POSITIVE', 'Anjali Patel', '+919876543221'),
(7, '1978-12-03', 'MALE', 'B_POSITIVE', 'Kiran Mehta', '+919876543222'),
(8, '1995-03-10', 'MALE', 'AB_POSITIVE', 'Demo Contact', '+919876543223');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date_time, status, reason) VALUES
(1, 1, '2024-01-15 10:00:00', 'SCHEDULED', 'Regular cardiac checkup'),
(2, 2, '2024-01-15 14:30:00', 'COMPLETED', 'Neurological consultation'),
(3, 3, '2024-01-16 09:00:00', 'SCHEDULED', 'Pediatric consultation'),
(4, 1, '2024-01-17 11:00:00', 'SCHEDULED', 'Heart health screening');

-- Insert sample medical records
INSERT INTO medical_records (patient_id, doctor_id, title, description, diagnosis, prescription, test_results) VALUES
(1, 1, 'Annual Physical Examination', 'Complete physical examination with blood work and imaging studies. Patient presents with no acute complaints.', 'Healthy adult, no significant findings', 'Continue current medications, return in 6 months', 'Blood pressure: 120/80, Cholesterol: Normal, CBC: Normal'),
(2, 2, 'Neurological Assessment', 'Patient presented with headaches and dizziness. Neurological examination performed.', 'Tension headaches, likely stress-related', 'Pain management medication, stress reduction techniques', 'CT scan: Normal, Blood work: Normal'),
(3, 3, 'Pediatric Consultation', 'Routine pediatric checkup for growth and development assessment.', 'Normal growth and development', 'Continue current vaccination schedule', 'Height: 95th percentile, Weight: 90th percentile');

-- Insert sample bills
INSERT INTO bills (patient_id, appointment_id, bill_number, consultation_fee, test_fee, medication_fee, total_amount, payment_status, due_date) VALUES
(1, 1, 'BILL-2024-001', 150.00, 75.00, 45.00, 270.00, 'PAID', '2024-02-15'),
(2, 2, 'BILL-2024-002', 200.00, 120.00, 0.00, 320.00, 'PENDING', '2024-02-15'),
(3, 3, 'BILL-2024-003', 150.00, 85.00, 30.00, 265.00, 'PENDING', '2024-02-16'),
(4, 4, 'BILL-2024-004', 150.00, 100.00, 25.00, 275.00, 'PENDING', '2024-02-17');