package com.smartshop.user.servicei;

import java.util.*;

import com.smartshop.user.entity.User;

public interface UserServicei {

	User saveUser(User user);

	List<User> getAllUsers();

	User findByEmail(String email);

	User updateUser(long id, User userDetails);
	
	
	

}
