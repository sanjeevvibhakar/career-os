package com.sanjeev.careeros.learning;
import java.time.LocalDate;
import java.util.List;
record SprintRequest(String technology, String description, LocalDate startDate, LocalDate endDate, Integer totalWeeks) {}
record SprintResponse(Long id, String technology, String description, LocalDate startDate, LocalDate endDate, String status, Integer totalWeeks, Integer currentWeek) {}
record SprintWeekRequest(Integer weekNumber, String focus, String goals) {}
record SprintWeekResponse(Long id, Integer weekNumber, String focus, String goals, Boolean completed) {}
record DailyLearningLogRequest(LocalDate date, Long sprintId, String topic, Integer plannedMinutes, Integer actualMinutes, Integer understanding, String notes, String resourcesUsed) {}
record DailyLearningLogResponse(Long id, LocalDate date, String topic, Integer plannedMinutes, Integer actualMinutes, Integer understanding, String notes, String resourcesUsed) {}
