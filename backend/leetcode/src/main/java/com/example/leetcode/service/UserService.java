package com.example.leetcode.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Role;
import com.example.leetcode.domain.User;
import com.example.leetcode.domain.dto.ResultPaginationDTO;
import com.example.leetcode.domain.dto.user.ResCreateUserDTO;
import com.example.leetcode.domain.dto.user.ResUpdateUserDTO;
import com.example.leetcode.domain.dto.user.ResUserDTO;
import com.example.leetcode.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final RoleService roleService;

	public User handleCreateUser(User user) {
		if (!this.userRepository.existsByEmail(user.getEmail()))
			return this.userRepository.save(user);
		else
			return null;
	}

	public void handleDeleteUser(long id) {
		this.userRepository.deleteById(id);
	}

	public User fetchUserById(long id) {
		Optional<User> userOptional = this.userRepository.findById(id);
		if (userOptional.isPresent()) {
			return userOptional.get();
		}
		return null;
	}

	public boolean isEmailExist(String email) {
		return this.userRepository.existsByEmail(email);
	}

	public ResCreateUserDTO convertToResCreateUserDTO(User user) {
		ResCreateUserDTO dto = new ResCreateUserDTO();
		ResCreateUserDTO.RoleUser role = new ResCreateUserDTO.RoleUser();
		if (user.getRole() != null) {
			role.setId(user.getRole().getId());
			role.setName(user.getRole().getName());
			dto.setRole(role);

		}
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setCreatedAt(user.getCreatedAt());
		return dto;
	}

	public ResUserDTO convertToResUserDTO(User user) {
		ResUserDTO dto = new ResUserDTO();
		ResUserDTO.RoleUser role = new ResUserDTO.RoleUser();

		if (user.getRole() != null) {
			role.setId(user.getRole().getId());
			role.setName(user.getRole().getName());
			dto.setRole(role);

		}
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setCreatedAt(user.getCreatedAt());
		dto.setUpdatedAt(user.getUpdatedAt());
		return dto;
	}

	public ResUpdateUserDTO convertToResUpdateUserDTO(User user) {
		ResUpdateUserDTO dto = new ResUpdateUserDTO();
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setUpdatedAt(user.getUpdatedAt());

		ResUpdateUserDTO.RoleUser role = new ResUpdateUserDTO.RoleUser();

		if (user.getRole() != null) {
			role.setId(user.getRole().getId());
			role.setName(user.getRole().getName());
			dto.setRole(role);

		}
		return dto;
	}

	public ResultPaginationDTO fetchAllUser(Specification<User> specification, Pageable pageable) {
		Page<User> page = this.userRepository.findAll(specification, pageable);
		ResultPaginationDTO result = new ResultPaginationDTO();
		ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

		meta.setPage(pageable.getPageNumber() + 1);
		meta.setPageSize(pageable.getPageSize());
		meta.setPages(page.getTotalPages());
		meta.setTotal(page.getTotalElements());

		result.setMeta(meta);

		List<ResUserDTO> dtos = page.getContent()
				.stream().map(user -> convertToResUserDTO(user))
				.collect(Collectors.toList());

		result.setResult(dtos);

		return result;
	}

	public User handleUpdateUser(User reqUser) {
		User currentUser = fetchUserById(reqUser.getId());

		currentUser.setName(reqUser.getName());
		if (reqUser.getRole() != null) {
			Role role = this.roleService.handleFetchRoleById(reqUser.getRole().getId());
			currentUser.setRole(role);

		}

		// update
		currentUser = this.userRepository.save(currentUser);
		return currentUser;

	}

	public User handleGetUserByUsername(String username) {
		return this.userRepository.findByEmail(username);
	}

	public void updateUserToken(String token, String email) {
		User currentUser = this.handleGetUserByUsername(email);
		if (currentUser != null) {
			currentUser.setRefreshToken(token);
			this.userRepository.save(currentUser);
		}
	}

	public User getUserByRefreshTokenAndEmail(String token, String email) {
		return this.userRepository.findByRefreshTokenAndEmail(token, email);
	}
}