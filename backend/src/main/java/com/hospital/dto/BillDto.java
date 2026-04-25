package com.hospital.dto;

import com.hospital.model.Bill;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BillDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private String billNumber;
    private BigDecimal consultationFee;
    private BigDecimal testFee;
    private BigDecimal medicationFee;
    private BigDecimal totalAmount;
    private Bill.PaymentStatus paymentStatus;
    private String description;
    private LocalDateTime billDate;
    private LocalDateTime dueDate;

    public BillDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

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

    public Bill.PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Bill.PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getBillDate() { return billDate; }
    public void setBillDate(LocalDateTime billDate) { this.billDate = billDate; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}

