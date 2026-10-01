package com.sanjeev.careeros.learning;
import com.sanjeev.careeros.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "tech_sprint")
class TechSprint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String technology; private String description; private LocalDate startDate; private LocalDate endDate;
    private String status; private Integer totalWeeks; private Integer currentWeek;
}

@Data @Entity @Table(name = "tech_sprint_week")
class TechSprintWeek {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "sprint_id") private TechSprint sprint;
    private Integer weekNumber; private String focus; private String goals; private Boolean completed = false;
}

@Data @Entity @Table(name = "daily_learning_log")
class DailyLearningLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    @ManyToOne @JoinColumn(name = "sprint_id") private TechSprint sprint;
    private LocalDate date; private String topic; private Integer plannedMinutes; private Integer actualMinutes;
    private Integer understanding; private String notes; private String resourcesUsed; private LocalDateTime createdAt = LocalDateTime.now();
}
