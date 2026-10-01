package com.sanjeev.careeros.dashboard;
import com.sanjeev.careeros.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "weekly_review")
class WeeklyReview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private LocalDate weekStartDate; private Integer dsaProblemsSolved; private Double dsaAccuracy;
    private Double techHours; private Double projectHours; private Integer gymSessions; private Double sleepAvg;
    private String biggestWin; private String biggestStruggle; private String nextWeekFocus;
    private String nextWeekDsaTheme; private String nextWeekTechTheme; private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
}

@Data @Entity @Table(name = "streak")
class Streak {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String type; private Integer currentCount; private Integer bestCount; private LocalDate lastActivityDate;
}
