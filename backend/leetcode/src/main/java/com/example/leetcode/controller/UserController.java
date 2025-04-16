package com.example.leetcode.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.domain.response.ResCreateUserDTO;
import com.example.leetcode.service.UserService;
import com.example.leetcode.util.annotation.ApiMessage;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
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
	@ApiMessage("Create a new user")
	public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User postManUser) {
		// TODO: process POST request

		return entity;
	}

}
