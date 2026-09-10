package com.example.demo.controller;

import com.example.demo.entity.Attendance;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")

public class ReportsController {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public ReportsController(
            AttendanceRepository attendanceRepository,
            UserRepository userRepository) {

        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/attendance")
    public Map<String, Object> getAttendanceReport() {

        List<Attendance> attendance =
                attendanceRepository.findAll();

        long present = attendance.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()))
                .count();

        long absent = attendance.stream()
                .filter(a -> "ABSENT".equalsIgnoreCase(a.getStatus()))
                .count();

        long totalAttendance =
                attendance.size();

        double attendanceRate =
                totalAttendance > 0
                        ? Math.round(
                            (present * 100.0 / totalAttendance) * 100
                        ) / 100.0
                        : 0;

        Map<String, Object> report =
                new HashMap<>();

        report.put(
                "totalEmployees",
                userRepository.count()
        );

        report.put(
                "totalAttendance",
                totalAttendance
        );

        report.put(
                "present",
                present
        );

        report.put(
                "absent",
                absent
        );

        report.put(
                "attendanceRate",
                attendanceRate
        );

        report.put(
                "records",
                attendance
        );

        return report;
    }
}
