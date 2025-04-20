package com.example.leetcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.leetcode.domain.User;
import com.example.leetcode.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
	private final UserRepository userRepository;

	public User handleCreateUser(User user) {
		return this.userRepository.save(user);
	}

	public void handleDeleteUserByID(long id) {
		this.userRepository.deleteById(id);
	}

	public User fetchUserByID(long id) {
		Optional<User> userOptional = this.userRepository.findById(id);
		if (userOptional.isPresent()) {
			return userOptional.get();
		}
		return null;
	}

	public List<User> fetchAllUsers() {
		return this.userRepository.findAll();
	}

	public User handleUpdateUser(User user) {
		User currentUser = this.fetchUserByID(user.getId());
		if (currentUser != null) {
			currentUser.setEmail(user.getEmail());
			currentUser.setName(user.getName());
			currentUser.setPassword(user.getPassword());
			currentUser = this.userRepository.save(currentUser);
		}
		return currentUser;
	}

	public User handleGetUserByEmail(String email) {
		return this.userRepository.findByEmail(email);
	}
}
