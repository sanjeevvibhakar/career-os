package com.sanjeev.careeros.dashboard;
import com.sanjeev.careeros.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final StreakService streakService;
    
    public DashboardResponse getDashboard(User user) {
        Map<String, String> dsa = new HashMap<>(); dsa.put("problemName", "Two Sum"); dsa.put("topicName", "Arrays & Hashing");
        Map<String, String> tech = new HashMap<>(); tech.put("sprintName", "Spring Boot Basics");
        return new DashboardResponse(user.getName(), dsa, tech, "Practice explaining REST to a non-technical friend", streakService.getStreaks(user), "Graphs", 2, "45%");
    }
}
