package com.sanjeev.careeros.portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserId(Long userId);
}

interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserIdAndVisibleTrueOrderByOrderIndexAsc(Long userId);
    List<Project> findByUserIdOrderByOrderIndexAsc(Long userId);
    Optional<Project> findBySlug(String slug);
}

interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserIdAndVisibleTrueOrderByOrderIndexAsc(Long userId);
    List<Skill> findByUserIdOrderByOrderIndexAsc(Long userId);
}

interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByUserIdAndVisibleTrueOrderByOrderIndexAsc(Long userId);
    List<Experience> findByUserIdOrderByOrderIndexAsc(Long userId);
}

interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserIdAndVisibleTrueOrderByOrderIndexAsc(Long userId);
    List<Achievement> findByUserIdOrderByOrderIndexAsc(Long userId);
}
