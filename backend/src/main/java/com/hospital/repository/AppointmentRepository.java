package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId); // automatically converts to SQL Qquery
    List<Appointment> findByDoctorId(Long doctorId);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDateTime BETWEEN :startTime AND :endTime") // @query for custom query
    List<Appointment> findByDoctorIdAndAppointmentDateTimeBetween(
            @Param("doctorId") Long doctorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime >= :startDate ORDER BY a.appointmentDateTime")
    List<Appointment> findUpcomingAppointments(@Param("startDate") LocalDateTime startDate);
}