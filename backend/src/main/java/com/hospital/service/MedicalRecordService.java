package com.hospital.service;

import com.hospital.dto.MedicalRecordDto;
import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.model.Doctor;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<MedicalRecordDto> getAllMedicalRecords() {
        List<MedicalRecord> records = medicalRecordRepository.findAll();
        return records.stream().map(this::recordToDto).collect(Collectors.toList());
    }

    public List<MedicalRecordDto> getRecordsByPatient(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        return records.stream().map(this::recordToDto).collect(Collectors.toList());
    }

    public MedicalRecordDto getRecordById(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + recordId));
        return recordToDto(record);
    }

    public MedicalRecordDto createMedicalRecord(MedicalRecordDto medicalRecordDto) {
        MedicalRecord record = dtoToRecord(medicalRecordDto);
        MedicalRecord savedRecord = medicalRecordRepository.save(record);
        return recordToDto(savedRecord);
    }

    public MedicalRecordDto updateMedicalRecord(MedicalRecordDto medicalRecordDto, Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + recordId));

        record.setTitle(medicalRecordDto.getTitle());
        record.setDescription(medicalRecordDto.getDescription());
        record.setDiagnosis(medicalRecordDto.getDiagnosis());
        record.setPrescription(medicalRecordDto.getPrescription());
        record.setTestResults(medicalRecordDto.getTestResults());
        record.setFilePath(medicalRecordDto.getFilePath());
        record.setAiSummary(medicalRecordDto.getAiSummary());

        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return recordToDto(updatedRecord);
    }

    public void deleteMedicalRecord(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + recordId));
        medicalRecordRepository.delete(record);
    }

    private MedicalRecord dtoToRecord(MedicalRecordDto medicalRecordDto) {
        MedicalRecord record = new MedicalRecord();
        record.setId(medicalRecordDto.getId());
        record.setTitle(medicalRecordDto.getTitle());
        record.setDescription(medicalRecordDto.getDescription());
        record.setDiagnosis(medicalRecordDto.getDiagnosis());
        record.setPrescription(medicalRecordDto.getPrescription());
        record.setTestResults(medicalRecordDto.getTestResults());
        record.setFilePath(medicalRecordDto.getFilePath());
        record.setAiSummary(medicalRecordDto.getAiSummary());

        if (medicalRecordDto.getPatientId() != null) {
            Patient patient = patientRepository.findById(medicalRecordDto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            record.setPatient(patient);
        }

        if (medicalRecordDto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(medicalRecordDto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            record.setDoctor(doctor);
        }

        return record;
    }

    private MedicalRecordDto recordToDto(MedicalRecord record) {
        MedicalRecordDto recordDto = new MedicalRecordDto();
        recordDto.setId(record.getId());

        if (record.getPatient() != null) {
            recordDto.setPatientId(record.getPatient().getId());
            recordDto.setPatientName(record.getPatient().getUser().getFirstName() + " " + 
                                     record.getPatient().getUser().getLastName());
        }

        if (record.getDoctor() != null) {
            recordDto.setDoctorId(record.getDoctor().getId());
            recordDto.setDoctorName("Dr. " + record.getDoctor().getUser().getFirstName() + " " + 
                                   record.getDoctor().getUser().getLastName());
        }

        recordDto.setTitle(record.getTitle());
        recordDto.setDescription(record.getDescription());
        recordDto.setDiagnosis(record.getDiagnosis());
        recordDto.setPrescription(record.getPrescription());
        recordDto.setTestResults(record.getTestResults());
        recordDto.setFilePath(record.getFilePath());
        recordDto.setAiSummary(record.getAiSummary());
        recordDto.setRecordDate(record.getRecordDate());

        return recordDto;
    }
}

