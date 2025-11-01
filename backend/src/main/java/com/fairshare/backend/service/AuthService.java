package com.fairshare.backend.service;

import com.fairshare.backend.config.JwtUtil;
import com.fairshare.backend.model.User;
import com.fairshare.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        String hashedPassword = encoder.encode(password);
        User user = new User(name, email, hashedPassword, "USER");
        return userRepository.save(user);
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("Invalid email or password");
        User user = userOpt.get();
        if (!encoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        return jwtUtil.generateToken(email);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
