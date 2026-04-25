package com.hospital.controller;

import com.hospital.dto.PatientDto;
import com.hospital.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/")
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        List<PatientDto> patients = patientService.getAllPatients();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDto> getPatient(@PathVariable Long patientId) {
        PatientDto patient = patientService.getPatientById(patientId);
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    @PutMapping("/{patientId}") // PUT Request
    public ResponseEntity<PatientDto> updatePatient(@RequestBody PatientDto patientDto, 
                                                    @PathVariable Long patientId) {
        PatientDto updatedPatient = patientService.updatePatient(patientDto, patientId);
        return new ResponseEntity<>(updatedPatient, HttpStatus.OK);
    }
}

