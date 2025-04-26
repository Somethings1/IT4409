package com.example.leetcode.domain.request;

import jakarta.validation.constraints.NotBlank;

public class ReqLoginDTO {
	@NotBlank(message = "Username must not blank")
	private String username;

	@NotBlank(message = "Password must not blank")
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
