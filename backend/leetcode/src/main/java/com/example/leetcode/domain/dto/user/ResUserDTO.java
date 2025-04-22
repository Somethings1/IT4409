package com.example.leetcode.domain.dto.user;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResUserDTO {
	private long id;
	private String name;
	private String email;
	private Instant createdAt;
	private Instant updatedAt;

}
