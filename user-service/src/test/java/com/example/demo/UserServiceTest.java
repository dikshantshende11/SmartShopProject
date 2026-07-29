package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.smartshop.user.entity.User;
import com.smartshop.user.repository.UserRepository;
import com.smartshop.user.service.UserService;

public class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveUser() {

        User user = new User();

        when(repository.save(user))
                .thenReturn(user);

        User savedUser = service.saveUser(user);

        assertEquals(user, savedUser);
    }

    @Test
    void testGetAllUsers() {

        User user1 = new User();
        User user2 = new User();

        List<User> users = Arrays.asList(user1, user2);

        when(repository.findAll()).thenReturn(users);

        List<User> result = service.getAllUsers();

        assertEquals(2, result.size());
    }
}