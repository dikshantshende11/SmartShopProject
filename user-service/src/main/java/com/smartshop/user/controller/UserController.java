package com.smartshop.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public String register(@RequestBody User user) {
	    service.saveUser(user);
	    return "User Registered Successfully!";
	}

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = service.findByEmail(user.getEmail());
        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getEmail());
        }
        return "Invalid credentials!";
    }
	@GetMapping
	public List<User>getAllUser(){
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
