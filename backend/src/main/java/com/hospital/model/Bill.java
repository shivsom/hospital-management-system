package com.hospital.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity //Maps to database
@Table(name = "bills")
public class Bill {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne// foreign key relationship bills -> patients
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String billNumber;
    private BigDecimal consultationFee;
    private BigDecimal testFee;
    private BigDecimal medicationFee;
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING) // enum conv -> str()
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String description;

    @Column(name = "bill_date")
    private LocalDateTime billDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (billDate == null) {
            billDate = LocalDateTime.now();
        }
        if (dueDate == null) {
            dueDate = LocalDateTime.now().plusDays(30);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Bill() {}

    public Bill(Patient patient, Appointment appointment, String billNumber, BigDecimal totalAmount) {
        this.patient = patient;
        this.appointment = appointment;
        this.billNumber = billNumber;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }

    public BigDecimal getTestFee() { return testFee; }
    public void setTestFee(BigDecimal testFee) { this.testFee = testFee; }

    public BigDecimal getMedicationFee() { return medicationFee; }
    public void setMedicationFee(BigDecimal medicationFee) { this.medicationFee = medicationFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getBillDate() { return billDate; }
    public void setBillDate(LocalDateTime billDate) { this.billDate = billDate; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum PaymentStatus {
        PENDING, PAID, OVERDUE, CANCELLED
    }
}