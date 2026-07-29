package com.smartshop.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import com.smartshop.user.entity.User;
import com.smartshop.user.repository.UserRepository;
import com.smartshop.user.servicei.UserServicei;

@Service
public class UserService implements UserServicei{
	
	@Autowired
	  private UserRepository repository;

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
