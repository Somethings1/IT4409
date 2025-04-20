package com.example.leetcode.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.domain.dto.LoginDTO;
import com.example.leetcode.domain.dto.ResLoginDTO;
import com.example.leetcode.domain.response.ResCreateUserDTO;
import com.example.leetcode.service.UserService;
import com.example.leetcode.util.SecurityUtil;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final SecurityUtil securityUtil;
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {

		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				loginDTO.getUsername(), loginDTO.getPassword());

		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		String access_token = this.securityUtil.createToken(authentication);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		ResLoginDTO res = new ResLoginDTO();
		res.setAccessToken(access_token);
		return ResponseEntity.ok().body(res);

	}

	// @PostMapping("/register")
	// @ApiMessage("Register a new user")
	// public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User
	// postmanUser) throws IdInvalidException {

	// boolean isEmailExist = this.userService.isEmailExist(postmanUser.getEmail());
	// if (isEmailExist) {
	// throw new IdInvalidException("Email " + postmanUser.getEmail() + "
	// existed!!!");
	// }

	// String hashPassword = this.passwordEncoder.encode(postmanUser.getPassword());
	// postmanUser.setPassword(hashPassword);

	// User newUser = this.userService.handleCreateUser(postmanUser);

	// return
	// ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(newUser));
	// }
}
