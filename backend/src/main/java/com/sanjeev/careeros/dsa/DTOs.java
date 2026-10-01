package com.sanjeev.careeros.dsa;
import java.util.List;
record DsaTopicResponse(Long id, String name, String description, String icon, String color, int totalProblems, int solvedProblems, int averageConfidence) {}
record DsaProblemResponse(Long id, String name, String difficulty, String source, String sourceUrl, String pattern, String topicName, int attemptCount, String lastAttemptDate, int confidence, String nextRevisionDate) {}
record DsaAttemptRequest(Integer timeTakenMin, Boolean solvedIndependently, String approach, String mistake, String complexityTime, String complexitySpace, String lesson, Integer confidence) {}
record DsaAttemptResponse(Long id, Integer attemptNumber, Integer timeTakenMin, Boolean solvedIndependently, String approach, String mistake, String complexityTime, String complexitySpace, String lesson, Integer confidence, String attemptedAt) {}
record DsaRevisionResponse(Long id, String problemName, String topicName, Integer revisionNumber, String scheduledDate, String completedDate, Integer timeTakenMin, Integer confidence, String status) {}
record DsaStatsResponse(int totalSolved, int totalProblems, int easyCount, int mediumCount, int hardCount, int streakDays, List<TopicMasteryResponse> topicMastery) {}
record TopicMasteryResponse(String topicName, int solved, int total, double averageConfidence, double percentage) {}
record DsaProblemDetailResponse(Long id, String name, String difficulty, String source, String sourceUrl, String pattern, String topicName, String notes, List<DsaAttemptResponse> attempts, List<DsaRevisionResponse> revisions) {}
record DsaRevisionCompleteRequest(Integer timeTakenMin, Integer confidence) {}
