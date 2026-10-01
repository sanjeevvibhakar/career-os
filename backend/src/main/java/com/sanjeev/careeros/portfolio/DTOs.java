package com.sanjeev.careeros.portfolio;
import java.util.List;

record ProfileResponse(Long id, String title, String bio, String avatarUrl, String resumeUrl,
                        String githubUrl, String linkedinUrl, String location, String currentFocus) {}

record ProjectResponse(Long id, String title, String slug, String description, String longDescription,
                        String architectureNotes, String techStack, String githubUrl, String liveUrl,
                        String imageUrl, String challenges, String results, Boolean featured) {}

record SkillResponse(Long id, String name, String category, Integer proficiency, Integer evidenceCount) {}

record ExperienceResponse(Long id, String company, String role, String startDate, String endDate,
                           String description, String technologies) {}

record AchievementResponse(Long id, String title, String description, String achievedDate, String category) {}
