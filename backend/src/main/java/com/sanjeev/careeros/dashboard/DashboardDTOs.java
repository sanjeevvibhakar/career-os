package com.sanjeev.careeros.dashboard;
import java.time.LocalDate;
import java.util.Map;
record DashboardResponse(String userName, Map<String, String> todaysDsa, Map<String, String> todaysTech, String todaysComm, Map<String, StreakResponse> streaks, String currentBottleneck, int dueRevisions, String weeklyProof) {}
record StreakResponse(String type, int currentCount, int bestCount) {}
record WeeklyReviewRequest(LocalDate weekStartDate, int dsaProblemsSolved, double dsaAccuracy, double techHours, double projectHours, int gymSessions, double sleepAvg, String biggestWin, String biggestStruggle, String nextWeekFocus, String nextWeekDsaTheme, String nextWeekTechTheme, String notes) {}
record WeeklyReviewResponse(Long id, LocalDate weekStartDate, int dsaProblemsSolved, double dsaAccuracy, double techHours, double projectHours, int gymSessions, double sleepAvg, String biggestWin, String biggestStruggle, String nextWeekFocus, String nextWeekDsaTheme, String nextWeekTechTheme, String notes) {}
