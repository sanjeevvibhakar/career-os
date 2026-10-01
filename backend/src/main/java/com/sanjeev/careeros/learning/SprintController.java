package com.sanjeev.careeros.learning;
import com.sanjeev.careeros.auth.User;
import com.sanjeev.careeros.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService service;
    private User getCurrentUser() { return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); }

    @GetMapping("/sprints/current") public ResponseEntity<ApiResponse<SprintResponse>> getCurrent() { return ResponseEntity.ok(ApiResponse.success(service.getCurrentSprint(getCurrentUser()))); }
    @GetMapping("/sprints") public ResponseEntity<ApiResponse<List<SprintResponse>>> getAll() { return ResponseEntity.ok(ApiResponse.success(service.getAllSprints(getCurrentUser()))); }
    @PostMapping("/sprints") public ResponseEntity<ApiResponse<SprintResponse>> create(@RequestBody SprintRequest req) { return ResponseEntity.ok(ApiResponse.success(service.createSprint(getCurrentUser(), req))); }
    @PutMapping("/sprints/{id}") public ResponseEntity<ApiResponse<SprintResponse>> update(@PathVariable Long id, @RequestBody SprintRequest req) { return ResponseEntity.ok(ApiResponse.success(service.updateSprint(id, req))); }
    @PostMapping("/sprints/{id}/weeks") public ResponseEntity<ApiResponse<SprintWeekResponse>> addWeek(@PathVariable Long id, @RequestBody SprintWeekRequest req) { return ResponseEntity.ok(ApiResponse.success(service.addWeek(id, req))); }
    @PostMapping("/learning/logs") public ResponseEntity<ApiResponse<DailyLearningLogResponse>> log(@RequestBody DailyLearningLogRequest req) { return ResponseEntity.ok(ApiResponse.success(service.logLearning(getCurrentUser(), req))); }
    @GetMapping("/learning/logs") public ResponseEntity<ApiResponse<List<DailyLearningLogResponse>>> getLogs(@RequestParam LocalDate from, @RequestParam LocalDate to) { return ResponseEntity.ok(ApiResponse.success(service.getLogs(getCurrentUser(), from, to))); }
}
