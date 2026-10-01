package com.sanjeev.careeros.daily;
import com.sanjeev.careeros.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "journal_entry")
class JournalEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private LocalDate date; private String whatBuilt; private String whatLearned; private String whatConfused;
    private String bugEncountered; private String revisitTopic; private String mood; private Integer energyLevel;
    private LocalDateTime createdAt = LocalDateTime.now();
}

@Data @Entity @Table(name = "communication_log")
class CommunicationLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private LocalDate date; private String type; private String topic; private Integer durationMinutes;
    private String notes; private Integer rating; private LocalDateTime createdAt = LocalDateTime.now();
}

@Data @Entity @Table(name = "gym_session")
class GymSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private LocalDate date; private String type; private Boolean completed; private Integer durationMinutes; private String notes;
}

@Data @Entity @Table(name = "schedule_template")
class ScheduleTemplate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String dayOfWeek; private String blocks; private Boolean active = true;
}
