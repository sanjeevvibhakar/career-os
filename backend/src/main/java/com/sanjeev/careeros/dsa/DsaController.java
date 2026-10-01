package com.sanjeev.careeros.dsa;
import com.sanjeev.careeros.auth.User;
import com.sanjeev.careeros.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dsa")
@RequiredArgsConstructor
public class DsaController {
    private final DsaService dsaService;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/topics")
    public ResponseEntity<ApiResponse<List<DsaTopicResponse>>> getTopics() {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getTopics(getCurrentUser().getId())));
    }
    @GetMapping("/topics/{id}/problems")
    public ResponseEntity<ApiResponse<List<DsaProblemResponse>>> getTopicProblems(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getTopicProblems(id, getCurrentUser().getId())));
    }
    @GetMapping("/problems/{id}")
    public ResponseEntity<ApiResponse<DsaProblemDetailResponse>> getProblem(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getProblemDetail(id, getCurrentUser().getId())));
    }
    @PostMapping("/problems/{id}/attempts")
    public ResponseEntity<ApiResponse<DsaAttemptResponse>> logAttempt(@PathVariable Long id, @RequestBody DsaAttemptRequest req) {
        return ResponseEntity.ok(ApiResponse.success(dsaService.logAttempt(id, getCurrentUser(), req)));
    }
    @GetMapping("/revisions/due")
    public ResponseEntity<ApiResponse<List<DsaRevisionResponse>>> getDueRevisions() {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getDueRevisions(getCurrentUser().getId())));
    }
    @PutMapping("/revisions/{id}")
    public ResponseEntity<ApiResponse<DsaRevisionResponse>> completeRevision(@PathVariable Long id, @RequestBody DsaRevisionCompleteRequest req) {
        return ResponseEntity.ok(ApiResponse.success(dsaService.completeRevision(id, req)));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DsaStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getStats(getCurrentUser().getId())));
    }
    @GetMapping("/heatmap")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getHeatmap(@RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(dsaService.getHeatmap(getCurrentUser().getId(), year)));
    }
}
