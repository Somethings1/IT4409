package com.example.leetcode.domain.response.problem;

import java.time.Instant;

import com.example.leetcode.util.constant.DifficultyEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResCreateProblemDTO {
	private long id;
	private String title;
	private String description;
	private DifficultyEnum difficulty;
	private Instant createdAt;
	private String createdBy;

}
