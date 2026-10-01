package com.sanjeev.careeros.learning;
import org.springframework.data.jpa.repository.JpaRepository;
interface TechSprintRepository extends JpaRepository<TechSprint, Long> {}
interface TechSprintWeekRepository extends JpaRepository<TechSprintWeek, Long> {}
interface DailyLearningLogRepository extends JpaRepository<DailyLearningLog, Long> {}
