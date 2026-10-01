package com.sanjeev.careeros.portfolio;
import com.sanjeev.careeros.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicPortfolioController {
    private final ProfileRepository profileRepo;
    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final ExperienceRepository experienceRepo;
    private final AchievementRepository achievementRepo;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        Profile p = profileRepo.findAll().stream().findFirst().orElse(null);
        if (p == null) {
            return ResponseEntity.ok(ApiResponse.success(new ProfileResponse(0L, "Software Engineer", 
                "Software Engineer focused on Java, Spring Boot, distributed systems and modern web applications.",
                null, null, "https://github.com/sanjeev", "https://linkedin.com/in/sanjeev",
                "India", "Building Career OS")));
        }
        return ResponseEntity.ok(ApiResponse.success(new ProfileResponse(p.getId(), p.getTitle(), p.getBio(),
            p.getAvatarUrl(), p.getResumeUrl(), p.getGithubUrl(), p.getLinkedinUrl(),
            p.getLocation(), p.getCurrentFocus())));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects() {
        // Return first user's visible projects, or empty list
        List<Project> projects = projectRepo.findAll().stream()
            .filter(p -> p.getVisible() != null && p.getVisible())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(projects.stream().map(p ->
            new ProjectResponse(p.getId(), p.getTitle(), p.getSlug(), p.getDescription(),
                p.getLongDescription(), p.getArchitectureNotes(), p.getTechStack(),
                p.getGithubUrl(), p.getLiveUrl(), p.getImageUrl(),
                p.getChallenges(), p.getResults(), p.getFeatured())
        ).collect(Collectors.toList())));
    }

    @GetMapping("/projects/{slug}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(@PathVariable String slug) {
        Project p = projectRepo.findBySlug(slug).orElseThrow(() -> 
            new com.sanjeev.careeros.common.ResourceNotFoundException("Project not found"));
        return ResponseEntity.ok(ApiResponse.success(new ProjectResponse(p.getId(), p.getTitle(),
            p.getSlug(), p.getDescription(), p.getLongDescription(), p.getArchitectureNotes(),
            p.getTechStack(), p.getGithubUrl(), p.getLiveUrl(), p.getImageUrl(),
            p.getChallenges(), p.getResults(), p.getFeatured())));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getSkills() {
        List<Skill> skills = skillRepo.findAll().stream()
            .filter(s -> s.getVisible() != null && s.getVisible())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(skills.stream().map(s ->
            new SkillResponse(s.getId(), s.getName(), s.getCategory(), s.getProficiency(), s.getEvidenceCount())
        ).collect(Collectors.toList())));
    }

    @GetMapping("/experiences")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getExperiences() {
        List<Experience> exps = experienceRepo.findAll().stream()
            .filter(e -> e.getVisible() != null && e.getVisible())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(exps.stream().map(e ->
            new ExperienceResponse(e.getId(), e.getCompany(), e.getRole(),
                e.getStartDate() != null ? e.getStartDate().toString() : null,
                e.getEndDate() != null ? e.getEndDate().toString() : null,
                e.getDescription(), e.getTechnologies())
        ).collect(Collectors.toList())));
    }

    @GetMapping("/achievements")
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getAchievements() {
        List<Achievement> achievements = achievementRepo.findAll().stream()
            .filter(a -> a.getVisible() != null && a.getVisible())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(achievements.stream().map(a ->
            new AchievementResponse(a.getId(), a.getTitle(), a.getDescription(),
                a.getAchievedDate() != null ? a.getAchievedDate().toString() : null,
                a.getCategory())
        ).collect(Collectors.toList())));
    }
}
