package com.example.leetcode.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.domain.dto.ResultPaginationDTO;
import com.example.leetcode.domain.dto.user.ResCreateUserDTO;
import com.example.leetcode.domain.dto.user.ResUpdateUserDTO;
import com.example.leetcode.domain.dto.user.ResUserDTO;
import com.example.leetcode.service.UserService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

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

	public UserController(UserService userService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/users")
	@ApiMessage("Create a new user")
	public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User postManUser)
			throws IdInvalidException {

		boolean isEmailExist = this.userService.isEmailExist(postManUser.getEmail());
		if (isEmailExist) {
			throw new IdInvalidException("Email " + postManUser.getEmail() + " was existed!!!");
		}

		String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
		postManUser.setPassword(hashPassword);
		User newUser = this.userService.handleCreateUser(postManUser);

		return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(newUser));
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) {
		this.userService.handleDeleteUser(id);
		return ResponseEntity.ok(null);
		// return ResponseEntity.status(HttpStatus.OK).body("ericUser");
	}

	// fetch user by id
	@GetMapping("/users/{id}")
	@ApiMessage("Delete an user")
	public ResponseEntity<ResUserDTO> getUserById(@PathVariable("id") long id) {
		User fetchUser = this.userService.fetchUserById(id);

		return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResUserDTO(fetchUser));
	}

	// fetch all users
	@GetMapping("/users")
	@ApiMessage("Fetch all users")
	public ResponseEntity<ResultPaginationDTO> getAllUser(
			@Filter Specification<User> specification,
			Pageable pageable) {
		return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser(specification, pageable));

	}

	@PutMapping("/users")
	@ApiMessage("Update an user")
	public ResponseEntity<ResUpdateUserDTO> updateUser(@RequestBody User postmanUser) {
		User user = this.userService.handleUpdateUser(postmanUser);

		return ResponseEntity.ok(this.userService.convertToResUpdateUserDTO(user));
	}

}
