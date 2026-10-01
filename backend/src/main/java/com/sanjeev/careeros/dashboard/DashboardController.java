package com.sanjeev.careeros.dashboard;
import com.sanjeev.careeros.auth.User;
import com.sanjeev.careeros.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    private final StreakService streakService;
    private final WeeklyReviewService reviewService;
    
    private User getCurrentUser() { return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); }

    @GetMapping("/dashboard/today") public ResponseEntity<ApiResponse<DashboardResponse>> getToday() { return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard(getCurrentUser()))); }
    @GetMapping("/dashboard/streaks") public ResponseEntity<ApiResponse<java.util.Map<String, StreakResponse>>> getStreaks() { return ResponseEntity.ok(ApiResponse.success(streakService.getStreaks(getCurrentUser()))); }
    
    @PostMapping("/reviews/weekly") public ResponseEntity<ApiResponse<WeeklyReviewResponse>> createReview(@RequestBody WeeklyReviewRequest req) { return ResponseEntity.ok(ApiResponse.success(reviewService.create(getCurrentUser(), req))); }
    @GetMapping("/reviews/weekly/latest") public ResponseEntity<ApiResponse<WeeklyReviewResponse>> getLatestReview() { return ResponseEntity.ok(ApiResponse.success(reviewService.getLatest(getCurrentUser()))); }
}
