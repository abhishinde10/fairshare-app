package com.fairshare.backend.controller;

import com.fairshare.backend.model.User;
import com.fairshare.backend.service.AuthService;
import com.fairshare.backend.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil; // ✅ Inject JwtUtil

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> data) {
        String name = data.get("name");
        String email = data.get("email");
        String password = data.get("password");
        return authService.register(name, email, password);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        String token = authService.login(email, password);
        return Map.of("token", token);
    }

    // ✅ Fixed: Use injected jwtUtil instead of static call
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String tokenHeader) {
        try {
            String token = tokenHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token); // ✅ instance method
            Optional<User> userOpt = authService.getUserByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }
}
