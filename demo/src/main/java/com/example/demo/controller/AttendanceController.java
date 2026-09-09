package com.example.demo.controller;

import com.example.demo.entity.Attendance;
import com.example.demo.repository.AttendanceRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // GET ALL ATTENDANCE
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // GET ATTENDANCE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable Long id) {

        Optional<Attendance> attendance =
                attendanceRepository.findById(id);

        if (attendance.isPresent()) {
            return ResponseEntity.ok(attendance.get());
        }

        return ResponseEntity.notFound().build();
    }

    // ADD ATTENDANCE
    @PostMapping
    public ResponseEntity<Attendance> addAttendance(
            @RequestBody Attendance attendance) {

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return ResponseEntity.ok(savedAttendance);
    }

    // UPDATE ATTENDANCE
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendanceDetails) {

        Optional<Attendance> optionalAttendance =
                attendanceRepository.findById(id);

        if (optionalAttendance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Attendance attendance =
                optionalAttendance.get();

        attendance.setEmployeeId(
                attendanceDetails.getEmployeeId()
        );

        attendance.setEmployeeName(
                attendanceDetails.getEmployeeName()
        );

        attendance.setDate(
                attendanceDetails.getDate()
        );

        attendance.setStatus(
                attendanceDetails.getStatus()
        );

        Attendance updatedAttendance =
                attendanceRepository.save(attendance);

        return ResponseEntity.ok(updatedAttendance);
    }

    // DELETE ATTENDANCE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        if (!attendanceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        attendanceRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}