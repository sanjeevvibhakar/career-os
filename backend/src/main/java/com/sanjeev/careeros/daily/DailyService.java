package com.sanjeev.careeros.daily;
import com.sanjeev.careeros.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyService {
    private final JournalEntryRepository journalRepo;
    private final CommunicationLogRepository commRepo;
    private final GymSessionRepository gymRepo;
    private final ScheduleTemplateRepository scheduleRepo;

    @Transactional
    public JournalEntryResponse saveJournal(User user, JournalEntryRequest req) {
        JournalEntry entry = journalRepo.findByUserIdAndDate(user.getId(), req.date()).orElse(new JournalEntry());
        entry.setUser(user); entry.setDate(req.date()); entry.setWhatBuilt(req.whatBuilt());
        entry.setWhatLearned(req.whatLearned()); entry.setWhatConfused(req.whatConfused());
        entry.setBugEncountered(req.bugEncountered()); entry.setRevisitTopic(req.revisitTopic());
        entry.setMood(req.mood()); entry.setEnergyLevel(req.energyLevel());
        entry = journalRepo.save(entry);
        return new JournalEntryResponse(entry.getId(), entry.getDate(), entry.getWhatBuilt(), entry.getWhatLearned(), entry.getWhatConfused(), entry.getBugEncountered(), entry.getRevisitTopic(), entry.getMood(), entry.getEnergyLevel());
    }
    public JournalEntryResponse getJournal(Long userId, LocalDate date) {
        return journalRepo.findByUserIdAndDate(userId, date).map(entry -> new JournalEntryResponse(entry.getId(), entry.getDate(), entry.getWhatBuilt(), entry.getWhatLearned(), entry.getWhatConfused(), entry.getBugEncountered(), entry.getRevisitTopic(), entry.getMood(), entry.getEnergyLevel())).orElse(null);
    }
    public List<JournalEntryResponse> getRecentJournals(Long userId, int limit) {
        return journalRepo.findTop7ByUserIdOrderByDateDesc(userId).stream().map(entry -> new JournalEntryResponse(entry.getId(), entry.getDate(), entry.getWhatBuilt(), entry.getWhatLearned(), entry.getWhatConfused(), entry.getBugEncountered(), entry.getRevisitTopic(), entry.getMood(), entry.getEnergyLevel())).collect(Collectors.toList());
    }

    @Transactional
    public CommunicationLogResponse logComm(User user, CommunicationLogRequest req) {
        CommunicationLog log = new CommunicationLog();
        log.setUser(user); log.setDate(req.date()); log.setType(req.type()); log.setTopic(req.topic());
        log.setDurationMinutes(req.durationMinutes()); log.setNotes(req.notes()); log.setRating(req.rating());
        log = commRepo.save(log);
        return new CommunicationLogResponse(log.getId(), log.getDate(), log.getType(), log.getTopic(), log.getDurationMinutes(), log.getNotes(), log.getRating());
    }
    public List<CommunicationLogResponse> getComms(Long userId, LocalDate from, LocalDate to) {
        return commRepo.findByUserIdAndDateBetween(userId, from, to).stream().map(log -> new CommunicationLogResponse(log.getId(), log.getDate(), log.getType(), log.getTopic(), log.getDurationMinutes(), log.getNotes(), log.getRating())).collect(Collectors.toList());
    }

    @Transactional
    public GymSessionResponse logGym(User user, GymSessionRequest req) {
        GymSession s = new GymSession(); s.setUser(user); s.setDate(req.date()); s.setType(req.type()); s.setCompleted(req.completed()); s.setDurationMinutes(req.durationMinutes()); s.setNotes(req.notes());
        s = gymRepo.save(s);
        return new GymSessionResponse(s.getId(), s.getDate(), s.getType(), s.getCompleted(), s.getDurationMinutes(), s.getNotes());
    }
    public List<GymSessionResponse> getGymSessions(Long userId, LocalDate from, LocalDate to) {
        return gymRepo.findByUserIdAndDateBetween(userId, from, to).stream().map(s -> new GymSessionResponse(s.getId(), s.getDate(), s.getType(), s.getCompleted(), s.getDurationMinutes(), s.getNotes())).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleTemplateResponse updateSchedule(User user, String day, ScheduleTemplateRequest req) {
        ScheduleTemplate st = scheduleRepo.findByUserIdAndDayOfWeek(user.getId(), day).orElse(new ScheduleTemplate());
        st.setUser(user); st.setDayOfWeek(day); st.setBlocks(req.blocks()); st.setActive(req.active());
        st = scheduleRepo.save(st);
        return new ScheduleTemplateResponse(st.getId(), st.getDayOfWeek(), st.getBlocks(), st.getActive());
    }
    public List<ScheduleTemplateResponse> getSchedule(Long userId) {
        return scheduleRepo.findByUserId(userId).stream().map(st -> new ScheduleTemplateResponse(st.getId(), st.getDayOfWeek(), st.getBlocks(), st.getActive())).collect(Collectors.toList());
    }
}
