package com.example.leetcode.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Permission;
import com.example.leetcode.domain.Role;
import com.example.leetcode.domain.User;
import com.example.leetcode.repository.PermissionRepository;
import com.example.leetcode.repository.RoleRepository;
import com.example.leetcode.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
	private final PermissionRepository permissionRepository;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		System.out.println(">>>> INIT DATABASE:");
		long countPermissions = this.permissionRepository.count();
		long countRoles = this.roleRepository.count();
		long countUsers = this.userRepository.count();

		if (countPermissions == 0) {
			ArrayList<Permission> arr = new ArrayList<>();
			arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
			arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
			arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
			arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
			arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));
			arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
			arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
			arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
			arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
			arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));
			arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
			arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
			arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
			arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
			arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));
			this.permissionRepository.saveAll(arr);
		}

		if (countRoles == 0) {
			List<Permission> permissions = this.permissionRepository.findAll();
			Role adminRole = new Role();

			adminRole.setName("ADMIN");
			adminRole.setDescription("Admin thì full permissions");
			adminRole.setActive(true);
			adminRole.setPermissions(permissions);

			this.roleRepository.save(adminRole);
		}

		if (countUsers == 0) {
			User adminUser = new User();
			adminUser.setEmail("admin@gmail.com");
			adminUser.setName("I'm admin");
			adminUser.setPassword(this.passwordEncoder.encode("123456"));
			Role adminRole = this.roleRepository.findByName("ADMIN");

			if (adminRole != null) {
				adminUser.setRole(adminRole);
			}
			this.userRepository.save(adminUser);
		}

		if (countPermissions > 0 && countRoles > 0 && countUsers > 0) {
			System.out.println(">>> SKIP INIT DATABASE");
		} else {
			System.out.println(">>> END INIT DATABASE");
		}
	}

}
