package com.example.leetcode.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.service.UserService;
import com.example.leetcode.service.error.IdInvalidException;

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

	@PostMapping("/users")
	public ResponseEntity<User> createNewUser(@RequestBody User postManUser) {
		String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
		postManUser.setPassword(hashPassword);
		User newUser = this.userService.handleCreateUser(postManUser);
		return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
		if (id >= 1500) {
			throw new IdInvalidException("Id isn't bigger than 1500");
		}
		this.userService.handleDeleteUserByID(id);
		return ResponseEntity.ok("Delete user");
		// return ResponseEntity.status(HttpStatus.OK).body("Delete user");
	}

	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserByID(@PathVariable("id") long id) {
		User user = this.userService.fetchUserByID(id);
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = this.userService.fetchAllUsers();
		return ResponseEntity.status(HttpStatus.OK).body(users);
	}

	@PutMapping("/users")
	public ResponseEntity<User> updateUser(@RequestBody User postManUser) {
		User user = this.userService.handleUpdateUser(postManUser);
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

}
