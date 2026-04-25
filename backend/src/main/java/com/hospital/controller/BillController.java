package com.hospital.controller;

import com.hospital.dto.BillDto;
import com.hospital.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // makes this web api
@RequestMapping("/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping("/")
    public ResponseEntity<List<BillDto>> getAllBills() {
        List<BillDto> bills = billService.getAllBills();
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<BillDto>> getBillsByPatient(@PathVariable Long patientId) {
        List<BillDto> bills = billService.getBillsByPatient(patientId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    @GetMapping("/{billId}")
    public ResponseEntity<BillDto> getBill(@PathVariable Long billId) {
        BillDto bill = billService.getBillById(billId);
        return new ResponseEntity<>(bill, HttpStatus.OK);
    }

    @PutMapping("/{billId}")
    public ResponseEntity<BillDto> updateBill(@RequestBody BillDto billDto, 
                                              @PathVariable Long billId) {
        BillDto updatedBill = billService.updateBill(billDto, billId);
        return new ResponseEntity<>(updatedBill, HttpStatus.OK);
    }

    @DeleteMapping("/{billId}")
    public ResponseEntity<?> deleteBill(@PathVariable Long billId) {
        billService.deleteBill(billId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

