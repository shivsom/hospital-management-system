package com.hospital.service;

import com.hospital.dto.DoctorDto;
import com.hospital.model.Doctor;
import com.hospital.model.User;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DoctorDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream().map(this::doctorToDto).collect(Collectors.toList());
    }

    public List<DoctorDto> getActiveDoctors() {
        List<Doctor> doctors = doctorRepository.findActiveDoctors();
        return doctors.stream().map(this::doctorToDto).collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return doctorToDto(doctor);
    }

    public DoctorDto updateDoctor(DoctorDto doctorDto, Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        if (doctor.getUser() != null) {
            User user = doctor.getUser();
            user.setFirstName(doctorDto.getFirstName());
            user.setLastName(doctorDto.getLastName());
            user.setPhoneNumber(doctorDto.getPhoneNumber());
            user.setAddress(doctorDto.getAddress());
            userRepository.save(user);
        }

        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setLicenseNumber(doctorDto.getLicenseNumber());
        doctor.setExperienceYears(doctorDto.getExperienceYears());
        doctor.setQualification(doctorDto.getQualification());
        doctor.setDepartment(doctorDto.getDepartment());
        doctor.setStatus(doctorDto.getStatus());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return doctorToDto(updatedDoctor);
    }

    private DoctorDto doctorToDto(Doctor doctor) {
        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setId(doctor.getId());

        if (doctor.getUser() != null) {
            doctorDto.setUserId(doctor.getUser().getId());
            doctorDto.setFirstName(doctor.getUser().getFirstName());
            doctorDto.setLastName(doctor.getUser().getLastName());
            doctorDto.setEmail(doctor.getUser().getEmail());
            doctorDto.setPhoneNumber(doctor.getUser().getPhoneNumber());
            doctorDto.setAddress(doctor.getUser().getAddress());
        }

        doctorDto.setSpecialization(doctor.getSpecialization());
        doctorDto.setLicenseNumber(doctor.getLicenseNumber());
        doctorDto.setExperienceYears(doctor.getExperienceYears());
        doctorDto.setQualification(doctor.getQualification());
        doctorDto.setDepartment(doctor.getDepartment());
        doctorDto.setStatus(doctor.getStatus());

        return doctorDto;
    }
}

