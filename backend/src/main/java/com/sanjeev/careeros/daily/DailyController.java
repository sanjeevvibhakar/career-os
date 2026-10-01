package com.sanjeev.careeros.daily;
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
public class DailyController {
    private final DailyService service;
    private User getCurrentUser() { return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); }

    @PostMapping("/journal") public ResponseEntity<ApiResponse<JournalEntryResponse>> saveJournal(@RequestBody JournalEntryRequest req) { return ResponseEntity.ok(ApiResponse.success(service.saveJournal(getCurrentUser(), req))); }
    @GetMapping("/journal") public ResponseEntity<ApiResponse<JournalEntryResponse>> getJournal(@RequestParam LocalDate date) { return ResponseEntity.ok(ApiResponse.success(service.getJournal(getCurrentUser().getId(), date))); }
    @GetMapping("/journal/recent") public ResponseEntity<ApiResponse<List<JournalEntryResponse>>> getRecentJournal(@RequestParam(defaultValue = "7") int limit) { return ResponseEntity.ok(ApiResponse.success(service.getRecentJournals(getCurrentUser().getId(), limit))); }

    @PostMapping("/communication") public ResponseEntity<ApiResponse<CommunicationLogResponse>> logComm(@RequestBody CommunicationLogRequest req) { return ResponseEntity.ok(ApiResponse.success(service.logComm(getCurrentUser(), req))); }
    @GetMapping("/communication") public ResponseEntity<ApiResponse<List<CommunicationLogResponse>>> getComms(@RequestParam LocalDate from, @RequestParam LocalDate to) { return ResponseEntity.ok(ApiResponse.success(service.getComms(getCurrentUser().getId(), from, to))); }

    @PostMapping("/gym") public ResponseEntity<ApiResponse<GymSessionResponse>> logGym(@RequestBody GymSessionRequest req) { return ResponseEntity.ok(ApiResponse.success(service.logGym(getCurrentUser(), req))); }
    @GetMapping("/gym") public ResponseEntity<ApiResponse<List<GymSessionResponse>>> getGyms(@RequestParam LocalDate from, @RequestParam LocalDate to) { return ResponseEntity.ok(ApiResponse.success(service.getGymSessions(getCurrentUser().getId(), from, to))); }

    @GetMapping("/schedule") public ResponseEntity<ApiResponse<List<ScheduleTemplateResponse>>> getSchedule() { return ResponseEntity.ok(ApiResponse.success(service.getSchedule(getCurrentUser().getId()))); }
    @PutMapping("/schedule/{dayOfWeek}") public ResponseEntity<ApiResponse<ScheduleTemplateResponse>> updateSchedule(@PathVariable String dayOfWeek, @RequestBody ScheduleTemplateRequest req) { return ResponseEntity.ok(ApiResponse.success(service.updateSchedule(getCurrentUser(), dayOfWeek, req))); }
}
