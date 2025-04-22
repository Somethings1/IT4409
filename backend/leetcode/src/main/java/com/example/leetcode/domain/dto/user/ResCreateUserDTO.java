package com.example.leetcode.domain.dto.user;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
	private long id;
	private String name;
	private String email;
	private Instant createdAt;
}
