package com.sanjeev.careeros.dsa;
import com.sanjeev.careeros.auth.User;
import com.sanjeev.careeros.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DsaService {
    private final DsaTopicRepository topicRepo;
    private final DsaProblemRepository problemRepo;
    private final DsaAttemptRepository attemptRepo;
    private final DsaRevisionRepository revisionRepo;

    public List<DsaTopicResponse> getTopics(Long userId) {
        return topicRepo.findAll().stream().map(t -> {
            long total = problemRepo.countByTopicId(t.getId());
            return new DsaTopicResponse(t.getId(), t.getName(), t.getDescription(), t.getIcon(), t.getColor(), (int)total, 0, 0);
        }).collect(Collectors.toList());
    }

    public List<DsaProblemResponse> getTopicProblems(Long topicId, Long userId) {
        return problemRepo.findByTopicId(topicId).stream().map(p -> 
            new DsaProblemResponse(p.getId(), p.getName(), p.getDifficulty(), p.getSource(), p.getSourceUrl(), p.getPattern(), p.getTopic().getName(), 0, null, 0, null)
        ).collect(Collectors.toList());
    }

    public DsaProblemDetailResponse getProblemDetail(Long problemId, Long userId) {
        DsaProblem p = problemRepo.findById(problemId).orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
        List<DsaAttempt> attempts = attemptRepo.findByProblemIdAndUserId(problemId, userId);
        List<DsaAttemptResponse> attemptResponses = attempts.stream().map(a -> new DsaAttemptResponse(a.getId(), a.getAttemptNumber(), a.getTimeTakenMin(), a.getSolvedIndependently(), a.getApproach(), a.getMistake(), a.getComplexityTime(), a.getComplexitySpace(), a.getLesson(), a.getConfidence(), a.getAttemptedAt().toString())).collect(Collectors.toList());
        List<DsaRevisionResponse> revisionResponses = new ArrayList<>();
        for (DsaAttempt a : attempts) {
            revisionRepo.findByAttemptId(a.getId()).forEach(r -> revisionResponses.add(new DsaRevisionResponse(r.getId(), p.getName(), p.getTopic().getName(), r.getRevisionNumber(), r.getScheduledDate().toString(), r.getCompletedDate() != null ? r.getCompletedDate().toString() : null, r.getTimeTakenMin(), r.getConfidence(), r.getStatus())));
        }
        return new DsaProblemDetailResponse(p.getId(), p.getName(), p.getDifficulty(), p.getSource(), p.getSourceUrl(), p.getPattern(), p.getTopic().getName(), p.getNotes(), attemptResponses, revisionResponses);
    }

    @Transactional
    public DsaAttemptResponse logAttempt(Long problemId, User user, DsaAttemptRequest req) {
        DsaProblem problem = problemRepo.findById(problemId).orElseThrow();
        List<DsaAttempt> existing = attemptRepo.findByProblemIdAndUserId(problemId, user.getId());
        DsaAttempt attempt = new DsaAttempt();
        attempt.setProblem(problem); attempt.setUser(user);
        attempt.setAttemptNumber(existing.size() + 1); attempt.setTimeTakenMin(req.timeTakenMin());
        attempt.setSolvedIndependently(req.solvedIndependently()); attempt.setApproach(req.approach());
        attempt.setMistake(req.mistake()); attempt.setComplexityTime(req.complexityTime());
        attempt.setComplexitySpace(req.complexitySpace()); attempt.setLesson(req.lesson());
        attempt.setConfidence(req.confidence());
        attempt = attemptRepo.save(attempt);
        
        int[] intervals = {1, 3, 7, 21, 60};
        for (int i = 0; i < intervals.length; i++) {
            DsaRevision rev = new DsaRevision();
            rev.setAttempt(attempt); rev.setRevisionNumber(i + 1);
            rev.setScheduledDate(LocalDate.now().plusDays(intervals[i]));
            rev.setStatus("PENDING");
            revisionRepo.save(rev);
        }
        return new DsaAttemptResponse(attempt.getId(), attempt.getAttemptNumber(), attempt.getTimeTakenMin(), attempt.getSolvedIndependently(), attempt.getApproach(), attempt.getMistake(), attempt.getComplexityTime(), attempt.getComplexitySpace(), attempt.getLesson(), attempt.getConfidence(), attempt.getAttemptedAt().toString());
    }

    public List<DsaRevisionResponse> getDueRevisions(Long userId) {
        return revisionRepo.findByAttemptUserIdAndStatusAndScheduledDateLessThanEqual(userId, "PENDING", LocalDate.now())
            .stream().map(r -> new DsaRevisionResponse(r.getId(), r.getAttempt().getProblem().getName(), r.getAttempt().getProblem().getTopic().getName(), r.getRevisionNumber(), r.getScheduledDate().toString(), r.getCompletedDate() != null ? r.getCompletedDate().toString() : null, r.getTimeTakenMin(), r.getConfidence(), r.getStatus()))
            .collect(Collectors.toList());
    }

    @Transactional
    public DsaRevisionResponse completeRevision(Long revisionId, DsaRevisionCompleteRequest req) {
        DsaRevision rev = revisionRepo.findById(revisionId).orElseThrow();
        rev.setStatus("COMPLETED"); rev.setCompletedDate(LocalDate.now());
        rev.setTimeTakenMin(req.timeTakenMin()); rev.setConfidence(req.confidence());
        rev = revisionRepo.save(rev);
        return new DsaRevisionResponse(rev.getId(), rev.getAttempt().getProblem().getName(), rev.getAttempt().getProblem().getTopic().getName(), rev.getRevisionNumber(), rev.getScheduledDate().toString(), rev.getCompletedDate().toString(), rev.getTimeTakenMin(), rev.getConfidence(), rev.getStatus());
    }

    public DsaStatsResponse getStats(Long userId) {
        long totalSolved = attemptRepo.countByUserId(userId);
        long totalProblems = problemRepo.count();
        return new DsaStatsResponse((int)totalSolved, (int)totalProblems, 0, 0, 0, 0, new ArrayList<>());
    }
    
    public Map<String, Integer> getHeatmap(Long userId, int year) {
        return new HashMap<>();
    }
}
