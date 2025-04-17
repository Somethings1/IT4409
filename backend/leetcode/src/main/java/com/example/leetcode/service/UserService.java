package com.example.leetcode.service;

import org.springframework.stereotype.Service;

import com.example.leetcode.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
	private final UserRepository userRepository;

	public boolean isEmailExist(String email) {
		return this.userRepository.existsByEmail(email);
	}
}
