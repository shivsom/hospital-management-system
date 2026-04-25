package com.hospital.controller;

import com.hospital.dto.AppointmentDto;
import com.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/")
    public ResponseEntity<AppointmentDto> createAppointment(@RequestBody AppointmentDto appointmentDto) {
        AppointmentDto createdAppointment = appointmentService.createAppointment(appointmentDto);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentDto> getAppointment(@PathVariable Long appointmentId) {
        AppointmentDto appointment = appointmentService.getAppointmentById(appointmentId);
        return new ResponseEntity<>(appointment, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        List<AppointmentDto> appointments = appointmentService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByPatient(patientId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentDto> updateAppointment(@RequestBody AppointmentDto appointmentDto, 
                                                           @PathVariable Long appointmentId) {
        AppointmentDto updatedAppointment = appointmentService.updateAppointment(appointmentDto, appointmentId);
        return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}