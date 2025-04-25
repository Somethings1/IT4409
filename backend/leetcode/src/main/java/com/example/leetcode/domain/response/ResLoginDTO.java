package com.example.leetcode.domain.response;

import com.example.leetcode.domain.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
	@JsonProperty("access_token")
	private String accessToken;
	private UserLogin user;

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class UserLogin {
		private long id;
		private String email;
		private String name;
		private Role role;

	}

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class UserGetAccount {
		private UserLogin user;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class UserInsideToken {
		private long id;
		private String email;
		private String name;
	}
}
