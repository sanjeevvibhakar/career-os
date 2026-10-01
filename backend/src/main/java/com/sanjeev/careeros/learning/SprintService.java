package com.sanjeev.careeros.learning;
import com.sanjeev.careeros.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintService {
    private final TechSprintRepository sprintRepo;
    private final TechSprintWeekRepository weekRepo;
    private final DailyLearningLogRepository logRepo;
    
    @Transactional
    public SprintResponse createSprint(User user, SprintRequest req) {
        TechSprint s = new TechSprint(); s.setUser(user); s.setTechnology(req.technology()); s.setDescription(req.description());
        s.setStartDate(req.startDate()); s.setEndDate(req.endDate()); s.setStatus("ACTIVE"); s.setTotalWeeks(req.totalWeeks()); s.setCurrentWeek(1);
        s = sprintRepo.save(s);
        return new SprintResponse(s.getId(), s.getTechnology(), s.getDescription(), s.getStartDate(), s.getEndDate(), s.getStatus(), s.getTotalWeeks(), s.getCurrentWeek());
    }
    public List<SprintResponse> getAllSprints(User user) { return sprintRepo.findAll().stream().filter(s -> s.getUser().getId().equals(user.getId())).map(s -> new SprintResponse(s.getId(), s.getTechnology(), s.getDescription(), s.getStartDate(), s.getEndDate(), s.getStatus(), s.getTotalWeeks(), s.getCurrentWeek())).collect(Collectors.toList()); }
    public SprintResponse getCurrentSprint(User user) { return getAllSprints(user).stream().filter(s -> s.status().equals("ACTIVE")).findFirst().orElse(null); }
    @Transactional
    public SprintResponse updateSprint(Long id, SprintRequest req) {
        TechSprint s = sprintRepo.findById(id).orElseThrow();
        s.setTechnology(req.technology()); s.setDescription(req.description()); s.setStartDate(req.startDate()); s.setEndDate(req.endDate());
        s = sprintRepo.save(s);
        return new SprintResponse(s.getId(), s.getTechnology(), s.getDescription(), s.getStartDate(), s.getEndDate(), s.getStatus(), s.getTotalWeeks(), s.getCurrentWeek());
    }
    @Transactional
    public SprintWeekResponse addWeek(Long sprintId, SprintWeekRequest req) {
        TechSprint s = sprintRepo.findById(sprintId).orElseThrow();
        TechSprintWeek w = new TechSprintWeek(); w.setSprint(s); w.setWeekNumber(req.weekNumber()); w.setFocus(req.focus()); w.setGoals(req.goals());
        w = weekRepo.save(w);
        return new SprintWeekResponse(w.getId(), w.getWeekNumber(), w.getFocus(), w.getGoals(), w.getCompleted());
    }
    @Transactional
    public DailyLearningLogResponse logLearning(User user, DailyLearningLogRequest req) {
        DailyLearningLog log = new DailyLearningLog(); log.setUser(user); log.setDate(req.date()); log.setTopic(req.topic());
        log.setPlannedMinutes(req.plannedMinutes()); log.setActualMinutes(req.actualMinutes()); log.setUnderstanding(req.understanding());
        log.setNotes(req.notes()); log.setResourcesUsed(req.resourcesUsed());
        if (req.sprintId() != null) log.setSprint(sprintRepo.findById(req.sprintId()).orElse(null));
        log = logRepo.save(log);
        return new DailyLearningLogResponse(log.getId(), log.getDate(), log.getTopic(), log.getPlannedMinutes(), log.getActualMinutes(), log.getUnderstanding(), log.getNotes(), log.getResourcesUsed());
    }
    public List<DailyLearningLogResponse> getLogs(User user, LocalDate from, LocalDate to) {
        return logRepo.findAll().stream().filter(l -> l.getUser().getId().equals(user.getId()) && !l.getDate().isBefore(from) && !l.getDate().isAfter(to))
            .map(log -> new DailyLearningLogResponse(log.getId(), log.getDate(), log.getTopic(), log.getPlannedMinutes(), log.getActualMinutes(), log.getUnderstanding(), log.getNotes(), log.getResourcesUsed())).collect(Collectors.toList());
    }
}
