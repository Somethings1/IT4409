package com.example.leetcode.controller;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.service.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1")
public class UserController {
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;

	/**
	 * @param userService
	 * @param passwordEncoder
	 */
	public UserController(UserService userService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/user")
	public User createNewUser(@RequestBody User postManUser) {

		User newUser = this.userService.handleCreateUser(postManUser);
		return newUser;
	}

	@DeleteMapping("/user/{id}")
	public String deleteUser(@PathVariable("id") long id) {
		this.userService.handleDeleteUserByID(id);
		return "Delete user";
	}

	@GetMapping("/user/{id}")
	public User getUserByID(@PathVariable("id") long id) {
		User user = this.userService.fetchUserByID(id);
		return user;
	}

	@GetMapping("/user")
	public List<User> getAllUsers() {
		List<User> users = this.userService.fetchAllUsers();
		return users;
	}

	@PutMapping("/user")
	public User updateUser(@RequestBody User postManUser) {

		return this.userService.handleUpdateUser(postManUser);
	}

}
