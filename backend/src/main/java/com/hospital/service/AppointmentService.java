package com.hospital.service;

import com.hospital.dto.AppointmentDto;
import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        Appointment appointment = dtoToAppointment(appointmentDto);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentToDto(savedAppointment);
    }

    public AppointmentDto getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));
        return appointmentToDto(appointment);
    }

    public List<AppointmentDto> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(this::appointmentToDto).collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByPatient(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream().map(this::appointmentToDto).collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream().map(this::appointmentToDto).collect(Collectors.toList());
    }

    public AppointmentDto updateAppointment(AppointmentDto appointmentDto, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));

        appointment.setAppointmentDateTime(appointmentDto.getAppointmentDateTime());
        appointment.setStatus(appointmentDto.getStatus());
        appointment.setReason(appointmentDto.getReason());
        appointment.setNotes(appointmentDto.getNotes());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return appointmentToDto(updatedAppointment);
    }

    public void deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));
        appointmentRepository.delete(appointment);
    }

    private Appointment dtoToAppointment(AppointmentDto appointmentDto) {
        Appointment appointment = new Appointment();
        appointment.setId(appointmentDto.getId());
        appointment.setAppointmentDateTime(appointmentDto.getAppointmentDateTime());
        appointment.setStatus(appointmentDto.getStatus());
        appointment.setReason(appointmentDto.getReason());
        appointment.setNotes(appointmentDto.getNotes());

        if (appointmentDto.getPatientId() != null) {
            Patient patient = patientRepository.findById(appointmentDto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            appointment.setPatient(patient);
        }

        if (appointmentDto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(appointmentDto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            appointment.setDoctor(doctor);
        }

        return appointment;
    }

    private AppointmentDto appointmentToDto(Appointment appointment) {
        AppointmentDto appointmentDto = new AppointmentDto();
        appointmentDto.setId(appointment.getId());
        appointmentDto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        appointmentDto.setStatus(appointment.getStatus());
        appointmentDto.setReason(appointment.getReason());
        appointmentDto.setNotes(appointment.getNotes());

        if (appointment.getPatient() != null) {
            appointmentDto.setPatientId(appointment.getPatient().getId());
            appointmentDto.setPatientName(appointment.getPatient().getUser().getFirstName() + " " + 
                                          appointment.getPatient().getUser().getLastName());
        }

        if (appointment.getDoctor() != null) {
            appointmentDto.setDoctorId(appointment.getDoctor().getId());
            appointmentDto.setDoctorName("Dr. " + appointment.getDoctor().getUser().getFirstName() + " " + 
                                         appointment.getDoctor().getUser().getLastName());
        }

        return appointmentDto;
    }
}