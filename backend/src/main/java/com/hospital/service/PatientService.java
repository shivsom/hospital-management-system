package com.hospital.service;

import com.hospital.dto.PatientDto;
import com.hospital.model.Patient;
import com.hospital.model.User;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PatientDto> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(this::patientToDto).collect(Collectors.toList());
    }

    public PatientDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        return patientToDto(patient);
    }

    public PatientDto updatePatient(PatientDto patientDto, Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        if (patient.getUser() != null) {
            User user = patient.getUser();
            user.setFirstName(patientDto.getFirstName());
            user.setLastName(patientDto.getLastName());
            user.setPhoneNumber(patientDto.getPhoneNumber());
            user.setAddress(patientDto.getAddress());
            userRepository.save(user);
        }

        patient.setDateOfBirth(patientDto.getDateOfBirth());
        patient.setGender(patientDto.getGender());
        patient.setBloodGroup(patientDto.getBloodGroup());
        patient.setEmergencyContactName(patientDto.getEmergencyContactName());
        patient.setEmergencyContactNumber(patientDto.getEmergencyContactNumber());
        patient.setAllergies(patientDto.getAllergies());
        patient.setMedicalHistory(patientDto.getMedicalHistory());

        Patient updatedPatient = patientRepository.save(patient);
        return patientToDto(updatedPatient);
    }

    private PatientDto patientToDto(Patient patient) {
        PatientDto patientDto = new PatientDto();
        patientDto.setId(patient.getId());

        if (patient.getUser() != null) {
            patientDto.setUserId(patient.getUser().getId());
            patientDto.setFirstName(patient.getUser().getFirstName());
            patientDto.setLastName(patient.getUser().getLastName());
            patientDto.setEmail(patient.getUser().getEmail());
            patientDto.setPhoneNumber(patient.getUser().getPhoneNumber());
            patientDto.setAddress(patient.getUser().getAddress());
        }

        patientDto.setDateOfBirth(patient.getDateOfBirth());
        patientDto.setGender(patient.getGender());
        patientDto.setBloodGroup(patient.getBloodGroup());
        patientDto.setEmergencyContactName(patient.getEmergencyContactName());
        patientDto.setEmergencyContactNumber(patient.getEmergencyContactNumber());
        patientDto.setAllergies(patient.getAllergies());
        patientDto.setMedicalHistory(patient.getMedicalHistory());

        return patientDto;
    }
}

