package com.sanjeev.careeros.daily;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    Optional<JournalEntry> findByUserIdAndDate(Long userId, LocalDate date);
    List<JournalEntry> findTop7ByUserIdOrderByDateDesc(Long userId);
}
interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {
    List<CommunicationLog> findByUserIdAndDateBetween(Long userId, LocalDate from, LocalDate to);
}
interface GymSessionRepository extends JpaRepository<GymSession, Long> {
    List<GymSession> findByUserIdAndDateBetween(Long userId, LocalDate from, LocalDate to);
}
interface ScheduleTemplateRepository extends JpaRepository<ScheduleTemplate, Long> {
    Optional<ScheduleTemplate> findByUserIdAndDayOfWeek(Long userId, String dayOfWeek);
    List<ScheduleTemplate> findByUserId(Long userId);
}
