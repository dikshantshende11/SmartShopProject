package com.smartshop.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.*;
import com.smartshop.user.entity.User;
import com.smartshop.user.repository.UserRepository;
import com.smartshop.user.servicei.UserServicei;

@Service
public class UserService implements UserServicei {

	@Autowired
	private UserRepository repository;

	@PostConstruct
	public void initDefaultUsers() {
		try {
			if (repository.count() == 0) {
				User admin = new User();
				admin.setName("Admin User");
				admin.setEmail("admin@gmail.com");
				admin.setPassword("admin123");
				admin.setRole("ADMIN");
				repository.save(admin);

				User demoUser = new User();
				demoUser.setName("Demo User");
				demoUser.setEmail("user@gmail.com");
				demoUser.setPassword("user123");
				demoUser.setRole("USER");
				repository.save(demoUser);

				System.out.println("✅ Automatically seeded default admin@gmail.com and user@gmail.com accounts!");
			}
		} catch (Exception e) {
			System.err.println("User Auto-Seeding warning: " + e.getMessage());
		}
	}

	@Override
	public User saveUser(User user) {
		return repository.save(user);
	}

	@Override
	public List<User> getAllUsers() {
		return repository.findAll();
	}

	@Override
	public User findByEmail(String email) {
		return repository.findByEmail(email).orElse(null);
	}

	@Override
	public User updateUser(long id, User userDetails) {
		User existing = repository.findById(id).orElse(null);
		if (existing != null) {
			if (userDetails.getName() != null) {
				existing.setName(userDetails.getName());
			}
			if (userDetails.getEmail() != null) {
				existing.setEmail(userDetails.getEmail());
			}
			if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
				existing.setPassword(userDetails.getPassword());
			}
			if (userDetails.getRole() != null && !userDetails.getRole().isEmpty()) {
				existing.setRole(userDetails.getRole());
			}
			return repository.save(existing);
		}
		return null;
	}
}
