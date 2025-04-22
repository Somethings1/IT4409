package com.example.leetcode.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.User;
import com.example.leetcode.domain.dto.LoginDTO;
import com.example.leetcode.domain.dto.ResLoginDTO;
import com.example.leetcode.domain.dto.user.ResCreateUserDTO;
import com.example.leetcode.service.UserService;
import com.example.leetcode.util.SecurityUtil;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")

public class AuthController {
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final SecurityUtil securityUtil;
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;

	@Value("${hoanglong.jwt.refresh-token-validity-in-seconds}")
	private long refreshTokenExpiration;

	/**
	 * @param authenticationManagerBuilder
	 * @param securityUtil
	 * @param userService
	 * @param passwordEncoder
	 */
	public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil,
			UserService userService, PasswordEncoder passwordEncoder) {
		this.authenticationManagerBuilder = authenticationManagerBuilder;
		this.securityUtil = securityUtil;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/login")
	public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {

		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				loginDTO.getUsername(), loginDTO.getPassword());

		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		ResLoginDTO res = new ResLoginDTO();
		User currentUserDB = this.userService.handleGetUserByUsername(loginDTO.getUsername());
		if (currentUserDB != null) {

			ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
					currentUserDB.getId(),
					currentUserDB.getEmail(),
					currentUserDB.getName());

			res.setUser(userLogin);
		}
		String access_token = this.securityUtil.createAccessToken(authentication, res.getUser());

		res.setAccessToken(access_token);
		String refresh_token = this.securityUtil.createRefreshToken(loginDTO.getUsername(), res);
		this.userService.updateUserToker(refresh_token, loginDTO.getUsername());
		ResponseCookie responseCookie = ResponseCookie
				.from("refresh_token1", refresh_token)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(refreshTokenExpiration)
				.build();

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, responseCookie.toString())
				.body(res);

	}

	@GetMapping("/account")
	@ApiMessage("Fetch account")
	public ResponseEntity<ResLoginDTO.UserLogin> getAccount() {
		String email = SecurityUtil.getCurrentUserLogin().isPresent()
				? SecurityUtil.getCurrentUserLogin().get()
				: "";

		User currentUserDB = this.userService.handleGetUserByUsername(email);

		ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
		if (currentUserDB != null) {
			userLogin.setId(currentUserDB.getId());
			userLogin.setEmail(currentUserDB.getEmail());
			userLogin.setName(currentUserDB.getName());
		}
		return ResponseEntity.ok().body(userLogin);
	}

}
