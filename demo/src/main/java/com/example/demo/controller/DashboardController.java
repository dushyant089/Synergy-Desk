package com.example.demo.controller;

import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")

public class DashboardController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public DashboardController(
            UserRepository userRepository,
            TaskRepository taskRepository) {

        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        // Total employees
        long totalEmployees =
                userRepository.count();

        // Get all tasks
        List<Task> tasks =
                taskRepository.findAll();

        // Count active tasks
        long activeTasks =
                tasks.stream()
                        .filter(task ->
                                "IN_PROGRESS".equalsIgnoreCase(
                                        task.getStatus())
                                || "PENDING".equalsIgnoreCase(
                                        task.getStatus()))
                        .count();

        // Count completed tasks
        long completedTasks =
                tasks.stream()
                        .filter(task ->
                                "COMPLETED".equalsIgnoreCase(
                                        task.getStatus()))
                        .count();

        // Dashboard statistics
        stats.put("totalEmployees", totalEmployees);
        stats.put("activeTasks", activeTasks);
        stats.put("completedTasks", completedTasks);

        // Attendance अभी बाद में database से dynamic करेंगे
        stats.put("attendancePercentage", 92);

        return stats;
    }
}
