package com.sanjeev.careeros.daily;
import java.time.LocalDate;
import java.util.List;
record JournalEntryRequest(LocalDate date, String whatBuilt, String whatLearned, String whatConfused, String bugEncountered, String revisitTopic, String mood, Integer energyLevel) {}
record JournalEntryResponse(Long id, LocalDate date, String whatBuilt, String whatLearned, String whatConfused, String bugEncountered, String revisitTopic, String mood, Integer energyLevel) {}
record CommunicationLogRequest(LocalDate date, String type, String topic, Integer durationMinutes, String notes, Integer rating) {}
record CommunicationLogResponse(Long id, LocalDate date, String type, String topic, Integer durationMinutes, String notes, Integer rating) {}
record GymSessionRequest(LocalDate date, String type, Boolean completed, Integer durationMinutes, String notes) {}
record GymSessionResponse(Long id, LocalDate date, String type, Boolean completed, Integer durationMinutes, String notes) {}
record ScheduleTemplateRequest(String blocks, Boolean active) {}
record ScheduleTemplateResponse(Long id, String dayOfWeek, String blocks, Boolean active) {}
