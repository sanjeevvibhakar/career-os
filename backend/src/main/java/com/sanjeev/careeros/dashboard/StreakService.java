package com.sanjeev.careeros.dashboard;
import com.sanjeev.careeros.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StreakService {
    private final StreakRepository streakRepo;
    
    @Transactional
    public void updateStreak(User user, String type) {
        Streak s = streakRepo.findAll().stream().filter(st -> st.getUser().getId().equals(user.getId()) && st.getType().equals(type)).findFirst().orElse(new Streak());
        if (s.getId() == null) { s.setUser(user); s.setType(type); s.setCurrentCount(1); s.setBestCount(1); s.setLastActivityDate(LocalDate.now()); }
        else {
            LocalDate today = LocalDate.now();
            if (s.getLastActivityDate().isEqual(today.minusDays(1))) { s.setCurrentCount(s.getCurrentCount() + 1); if (s.getCurrentCount() > s.getBestCount()) s.setBestCount(s.getCurrentCount()); }
            else if (s.getLastActivityDate().isBefore(today.minusDays(1))) { s.setCurrentCount(1); }
            s.setLastActivityDate(today);
        }
        streakRepo.save(s);
    }
    
    public Map<String, StreakResponse> getStreaks(User user) {
        Map<String, StreakResponse> map = new HashMap<>();
        streakRepo.findAll().stream().filter(st -> st.getUser().getId().equals(user.getId())).forEach(st -> map.put(st.getType(), new StreakResponse(st.getType(), st.getCurrentCount(), st.getBestCount())));
        return map;
    }
}
