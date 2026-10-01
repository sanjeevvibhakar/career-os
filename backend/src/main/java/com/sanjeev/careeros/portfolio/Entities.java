package com.sanjeev.careeros.portfolio;
import com.sanjeev.careeros.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "profile")
public class Profile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "user_id") private User user;
    private String title;
    @Column(columnDefinition = "TEXT") private String bio;
    private String avatarUrl;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String location;
    private String currentFocus;
}

@Data @Entity @Table(name = "project")
class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String title;
    private String slug;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "TEXT") private String architectureNotes;
    @Column(columnDefinition = "TEXT") private String longDescription;
    @Column(columnDefinition = "JSON") private String techStack;
    private String githubUrl;
    private String liveUrl;
    private String imageUrl;
    @Column(columnDefinition = "TEXT") private String challenges;
    @Column(columnDefinition = "TEXT") private String results;
    private Integer orderIndex;
    private Boolean featured;
    private Boolean visible;
    private LocalDateTime createdAt = LocalDateTime.now();
}

@Data @Entity @Table(name = "skill")
class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String name;
    private String category;
    private Integer proficiency;
    private Integer evidenceCount;
    private Integer orderIndex;
    private Boolean visible;
}

@Data @Entity @Table(name = "experience")
class Experience {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String company;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "JSON") private String technologies;
    private Integer orderIndex;
    private Boolean visible;
}

@Data @Entity @Table(name = "achievement")
class Achievement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    private String title;
    @Column(columnDefinition = "TEXT") private String description;
    private LocalDate achievedDate;
    private String category;
    private Integer orderIndex;
    private Boolean visible;
}
