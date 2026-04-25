package com.hospital.controller;

import com.hospital.dto.DoctorDto;
import com.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // makes this web api
@RequestMapping("/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        List<DoctorDto> doctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<DoctorDto>> getActiveDoctors() {
        List<DoctorDto> doctors = doctorService.getActiveDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> getDoctor(@PathVariable Long doctorId) {
        DoctorDto doctor = doctorService.getDoctorById(doctorId);
        return new ResponseEntity<>(doctor, HttpStatus.OK);
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> updateDoctor(@RequestBody DoctorDto doctorDto, 
                                                   @PathVariable Long doctorId) {
        DoctorDto updatedDoctor = doctorService.updateDoctor(doctorDto, doctorId);
        return new ResponseEntity<>(updatedDoctor, HttpStatus.OK);
    }
}

