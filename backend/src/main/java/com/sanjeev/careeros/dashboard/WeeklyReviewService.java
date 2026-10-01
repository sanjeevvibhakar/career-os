package com.sanjeev.careeros.dashboard;
import com.sanjeev.careeros.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyReviewService {
    private final WeeklyReviewRepository repo;
    
    @Transactional
    public WeeklyReviewResponse create(User user, WeeklyReviewRequest req) {
        WeeklyReview r = new WeeklyReview(); r.setUser(user); r.setWeekStartDate(req.weekStartDate());
        r.setDsaProblemsSolved(req.dsaProblemsSolved()); r.setDsaAccuracy(req.dsaAccuracy());
        r.setTechHours(req.techHours()); r.setProjectHours(req.projectHours()); r.setGymSessions(req.gymSessions());
        r.setSleepAvg(req.sleepAvg()); r.setBiggestWin(req.biggestWin()); r.setBiggestStruggle(req.biggestStruggle());
        r.setNextWeekFocus(req.nextWeekFocus()); r.setNextWeekDsaTheme(req.nextWeekDsaTheme()); r.setNextWeekTechTheme(req.nextWeekTechTheme()); r.setNotes(req.notes());
        r = repo.save(r);
        return new WeeklyReviewResponse(r.getId(), r.getWeekStartDate(), r.getDsaProblemsSolved(), r.getDsaAccuracy(), r.getTechHours(), r.getProjectHours(), r.getGymSessions(), r.getSleepAvg(), r.getBiggestWin(), r.getBiggestStruggle(), r.getNextWeekFocus(), r.getNextWeekDsaTheme(), r.getNextWeekTechTheme(), r.getNotes());
    }
    public WeeklyReviewResponse getLatest(User user) {
        return repo.findAll().stream().filter(r -> r.getUser().getId().equals(user.getId())).max((a, b) -> a.getWeekStartDate().compareTo(b.getWeekStartDate()))
            .map(r -> new WeeklyReviewResponse(r.getId(), r.getWeekStartDate(), r.getDsaProblemsSolved(), r.getDsaAccuracy(), r.getTechHours(), r.getProjectHours(), r.getGymSessions(), r.getSleepAvg(), r.getBiggestWin(), r.getBiggestStruggle(), r.getNextWeekFocus(), r.getNextWeekDsaTheme(), r.getNextWeekTechTheme(), r.getNotes())).orElse(null);
    }
}
