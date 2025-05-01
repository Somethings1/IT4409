package com.example.leetcode.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Permission;
import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Role;
import com.example.leetcode.domain.Tag;
import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.User;
import com.example.leetcode.repository.PermissionRepository;
import com.example.leetcode.repository.ProblemRepository;
import com.example.leetcode.repository.RoleRepository;
import com.example.leetcode.repository.TagRepository;
import com.example.leetcode.repository.TestcaseRepository;
import com.example.leetcode.repository.UserRepository;
import com.example.leetcode.util.constant.DifficultyEnum;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
	private final PermissionRepository permissionRepository;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final TagRepository tagRepository;
	private final ProblemRepository problemRepository;
	private final TestcaseRepository testcaseRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		System.out.println(">>>> INIT DATABASE:");
		long countPermissions = this.permissionRepository.count();
		long countRoles = this.roleRepository.count();
		long countUsers = this.userRepository.count();
		long countTags = this.tagRepository.count();
		long countProblems = this.problemRepository.count();
		long countTestcases = this.testcaseRepository.count();

		if (countPermissions == 0) {
			ArrayList<Permission> arr = new ArrayList<>();
			// Comment
			arr.add(new Permission("Create a comment", "/api/v1/comments", "POST", "COMMENTS"));
			arr.add(new Permission("Update a comment", "/api/v1/comments", "PUT", "COMMENTS"));
			arr.add(new Permission("Delete a comment", "/api/v1/comments/{id}", "DELETE", "COMMENTS"));
			arr.add(new Permission("Get a comment by id", "/api/v1/comments", "GET", "COMMENTS"));
			arr.add(new Permission("Get comments with pagination", "/api/v1/comments", "GET", "COMMENTS"));

			// Permission
			arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
			arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
			arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
			arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
			arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));

			// Problem
			arr.add(new Permission("Create a problem", "/api/v1/problems", "POST", "PROBLEMS"));
			arr.add(new Permission("Update a problem", "/api/v1/problems", "PUT", "PROBLEMS"));
			arr.add(new Permission("Delete a problem", "/api/v1/problems/{id}", "DELETE", "PROBLEMS"));
			arr.add(new Permission("Get a problem by id", "/api/v1/problems/{id}", "GET", "PROBLEMS"));
			arr.add(new Permission("Get problems with pagination", "/api/v1/problems", "GET", "PROBLEMS"));

			// Role
			arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
			arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
			arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
			arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
			arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));

			// Submission
			arr.add(new Permission("Create a submission", "/api/v1/submissions", "POST", "SUBMISSIONS"));
			arr.add(new Permission("Get submissions with pagination", "/api/v1/submissions", "GET", "SUBMISSIONS"));

			// Tag
			arr.add(new Permission("Create a tag", "/api/v1/tags", "POST", "TAGS"));
			arr.add(new Permission("Update a tag", "/api/v1/tags", "PUT", "TAGS"));
			arr.add(new Permission("Delete a tag", "/api/v1/tags/{id}", "DELETE", "TAGS"));
			arr.add(new Permission("Get a tag by id", "/api/v1/tags/{id}", "GET", "TAGS"));
			arr.add(new Permission("Get tags with pagination", "/api/v1/tags", "GET", "TAGS"));

			// Testcase
			arr.add(new Permission("Create a testcase", "/api/v1/testcases", "POST", "TESTCASES"));
			arr.add(new Permission("Update a testcase", "/api/v1/testcases", "PUT", "TESTCASES"));
			arr.add(new Permission("Delete a testcase", "/api/v1/testcases/{id}", "DELETE", "TESTCASES"));
			arr.add(new Permission("Get a testcase by id", "/api/v1/testcases/{id}", "GET", "TESTCASES"));
			arr.add(new Permission("Get testcases with pagination", "/api/v1/testcases", "GET", "TESTCASES"));

			// User
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

		if (countTags == 0) {
			// Tag
			ArrayList<Tag> tagList = new ArrayList<>();
			Tag tag1 = new Tag("Dynamic Programming");
			Tag tag2 = new Tag("BFS");
			Tag tag3 = new Tag("Math");
			Tag tag4 = new Tag("Graph");

			tagList.add(tag1);
			tagList.add(tag2);
			tagList.add(tag3);
			tagList.add(tag4);

			this.tagRepository.saveAll(tagList);
		}

		if (countPermissions > 0 && countRoles > 0 && countUsers > 0 && countTags > 0) {
			System.out.println(">>> SKIP INIT DATABASE");
		} else {
			System.out.println(">>> END INIT DATABASE");
		}
	}

}
