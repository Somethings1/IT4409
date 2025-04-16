package com.example.leetcode.domain.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
	private long id;
	private String name;
	private String email;
	private String password;
	private Instant createdAt;
	private RoleUser role;

	@Getter
	@Setter
	public static class RoleUser {
		private long id;
		private String name;
	}
}
