package com.hospital.service;

import com.hospital.dto.BillDto;
import com.hospital.model.Bill;
import com.hospital.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public List<BillDto> getAllBills() {
        List<Bill> bills = billRepository.findAll();
        return bills.stream().map(this::billToDto).collect(Collectors.toList());
    }

    public List<BillDto> getBillsByPatient(Long patientId) {
        List<Bill> bills = billRepository.findByPatientId(patientId);
        return bills.stream().map(this::billToDto).collect(Collectors.toList());
    }

    public BillDto getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));
        return billToDto(bill);
    }

    public BillDto updateBill(BillDto billDto, Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));

        bill.setConsultationFee(billDto.getConsultationFee());
        bill.setTestFee(billDto.getTestFee());
        bill.setMedicationFee(billDto.getMedicationFee());
        bill.setTotalAmount(billDto.getTotalAmount());
        bill.setPaymentStatus(billDto.getPaymentStatus());
        bill.setDescription(billDto.getDescription());
        bill.setDueDate(billDto.getDueDate());

        Bill updatedBill = billRepository.save(bill);
        return billToDto(updatedBill);
    }

    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));
        billRepository.delete(bill);
    }

    private BillDto billToDto(Bill bill) {
        BillDto billDto = new BillDto();
        billDto.setId(bill.getId());

        if (bill.getPatient() != null) {
            billDto.setPatientId(bill.getPatient().getId());
            billDto.setPatientName(bill.getPatient().getUser().getFirstName() + " " + 
                                   bill.getPatient().getUser().getLastName());
        }

        if (bill.getAppointment() != null) {
            billDto.setAppointmentId(bill.getAppointment().getId());
        }

        billDto.setBillNumber(bill.getBillNumber());
        billDto.setConsultationFee(bill.getConsultationFee());
        billDto.setTestFee(bill.getTestFee());
        billDto.setMedicationFee(bill.getMedicationFee());
        billDto.setTotalAmount(bill.getTotalAmount());
        billDto.setPaymentStatus(bill.getPaymentStatus());
        billDto.setDescription(bill.getDescription());
        billDto.setBillDate(bill.getBillDate());
        billDto.setDueDate(bill.getDueDate());

        return billDto;
    }
}

