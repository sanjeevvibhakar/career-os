package com.sanjeev.careeros.dsa;
import com.sanjeev.careeros.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "dsa_topic")
class DsaTopic {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; private Integer orderIndex; private String description; private String icon; private String color;
}

@Data @Entity @Table(name = "dsa_problem")
class DsaProblem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "topic_id") private DsaTopic topic;
    private String name; private String difficulty; private String source; private String sourceUrl;
    private String pattern; private String striverStep; private String neetcodeCategory; private String notes;
}

@Data @Entity @Table(name = "dsa_attempt")
class DsaAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "problem_id") private DsaProblem problem;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private Integer attemptNumber; private Integer timeTakenMin; private Boolean solvedIndependently;
    private String approach; private String mistake; private String complexityTime; private String complexitySpace;
    private String lesson; private Integer confidence; private LocalDateTime attemptedAt = LocalDateTime.now();
}

@Data @Entity @Table(name = "dsa_revision")
class DsaRevision {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "attempt_id") private DsaAttempt attempt;
    private Integer revisionNumber; private LocalDate scheduledDate; private LocalDate completedDate;
    private Integer timeTakenMin; private Integer confidence; private String status;
}
