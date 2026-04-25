package com.hospital.controller;

import com.hospital.dto.MedicalRecordDto;
import com.hospital.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping("/")
    public ResponseEntity<List<MedicalRecordDto>> getAllMedicalRecords() {
        List<MedicalRecordDto> records = medicalRecordService.getAllMedicalRecords();
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordDto>> getRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecordDto> records = medicalRecordService.getRecordsByPatient(patientId);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecordDto> getRecord(@PathVariable Long recordId) {
        MedicalRecordDto record = medicalRecordService.getRecordById(recordId);
        return new ResponseEntity<>(record, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(@RequestBody MedicalRecordDto medicalRecordDto) {
        MedicalRecordDto createdRecord = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return new ResponseEntity<>(createdRecord, HttpStatus.CREATED);
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecordDto> updateMedicalRecord(@RequestBody MedicalRecordDto medicalRecordDto,
                                                               @PathVariable Long recordId) {
        MedicalRecordDto updatedRecord = medicalRecordService.updateMedicalRecord(medicalRecordDto, recordId);
        return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable Long recordId) {
        medicalRecordService.deleteMedicalRecord(recordId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

