package com.sanjeev.careeros.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping(value = {"/", "/health"})
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Career OS Backend",
            "environment", "Production",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }
}
