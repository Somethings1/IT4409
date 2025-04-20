package com.example.leetcode.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
public class ResLoginDTO {
	private String accessToken;
	private UserLogin user;

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class UserLogin {
		private long id;
		private String email;
		private String name;

	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
}
