package com.smartshop.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smartshop.user.security.JwtUtil;  
import com.smartshop.user.entity.User;
import com.smartshop.user.servicei.UserServicei;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserServicei service;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Email is required.");
		}
		if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Password is required.");
		}

		String cleanEmail = user.getEmail().trim().toLowerCase();
		User existing = service.findByEmail(cleanEmail);
		if (existing != null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered! Please login.");
		}

		user.setEmail(cleanEmail);
		user.setName(user.getName() != null ? user.getName().trim() : "");
		if (user.getRole() == null || user.getRole().trim().isEmpty()) {
			user.setRole("USER");
		}

		service.saveUser(user);
		return ResponseEntity.ok("User Registered Successfully!");
	}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and Password are required.");
        }

        String cleanEmail = user.getEmail().trim().toLowerCase();
        User existing = service.findByEmail(cleanEmail);

        if (existing != null && existing.getPassword() != null && existing.getPassword().equals(user.getPassword())) {
            String token = jwtUtil.generateToken(cleanEmail);
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password!");
    }

	@GetMapping
	public List<User> getAllUser() {
		return service.getAllUsers();
	}
	
	@PutMapping("/{id}")
	public User updateUser(@PathVariable long id, @RequestBody User userDetails) {
		return service.updateUser(id, userDetails);
	}

	@PutMapping("/{id}/role")
	public User updateUserRole(@PathVariable long id, @RequestBody java.util.Map<String, String> body) {
		String role = body.get("role");
		User roleUpdate = new User();
		roleUpdate.setRole(role);
		return service.updateUser(id, roleUpdate);
	}
}
