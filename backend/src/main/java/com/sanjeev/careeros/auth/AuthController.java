package com.sanjeev.careeros.auth;
import com.sanjeev.careeros.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(req)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(req)));
    }
}
