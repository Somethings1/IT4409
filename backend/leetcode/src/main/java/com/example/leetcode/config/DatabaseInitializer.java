package com.example.leetcode.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.User;
import com.example.leetcode.repository.UserRepository;
import com.example.leetcode.util.constant.RoleEnum;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		System.out.println(">>>> INIT DATABASE:");
		long countUsers = this.userRepository.count();
		if (countUsers == 0) {
			User adminUser = new User();
			adminUser.setEmail("admin@gmail.com");
			adminUser.setName("I'm super admin");
			adminUser.setPassword(this.passwordEncoder.encode("123456"));
			adminUser.setRole(RoleEnum.ADMIN);
			this.userRepository.save(adminUser);
		}

		if (countUsers > 0) {
			System.out.println(">>> SKIP INIT DATABASE");
		} else {
			System.out.println(">>> END INIT DATABASE");
		}
	}

}
