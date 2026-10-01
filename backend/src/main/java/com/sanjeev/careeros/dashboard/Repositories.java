package com.sanjeev.careeros.dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
interface WeeklyReviewRepository extends JpaRepository<WeeklyReview, Long> {}
interface StreakRepository extends JpaRepository<Streak, Long> {}
