package com.sanjeev.careeros.dsa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

interface DsaTopicRepository extends JpaRepository<DsaTopic, Long> {}
interface DsaProblemRepository extends JpaRepository<DsaProblem, Long> { 
    List<DsaProblem> findByTopicId(Long topicId); 
    long countByTopicId(Long topicId);
}
interface DsaAttemptRepository extends JpaRepository<DsaAttempt, Long> { 
    List<DsaAttempt> findByProblemIdAndUserId(Long problemId, Long userId); 
    List<DsaAttempt> findByUserId(Long userId);
    long countByUserId(Long userId);
}
interface DsaRevisionRepository extends JpaRepository<DsaRevision, Long> { 
    List<DsaRevision> findByAttemptUserIdAndStatus(Long userId, String status); 
    List<DsaRevision> findByAttemptUserIdAndStatusAndScheduledDateLessThanEqual(Long userId, String status, LocalDate date);
    List<DsaRevision> findByAttemptId(Long attemptId);
}
