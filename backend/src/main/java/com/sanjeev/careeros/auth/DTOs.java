package com.sanjeev.careeros.auth;
record LoginRequest(String email, String password) {}
record RegisterRequest(String email, String password, String name) {}
record AuthResponse(String token, String refreshToken, String name, String email) {}
record UserResponse(Long id, String name, String email, Role role) {}
