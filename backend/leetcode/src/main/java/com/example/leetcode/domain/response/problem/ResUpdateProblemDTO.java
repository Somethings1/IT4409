package com.example.leetcode.domain.response.problem;

import java.time.Instant;
import java.util.List;

import com.example.leetcode.domain.Tag;
import com.example.leetcode.util.constant.DifficultyEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResUpdateProblemDTO {
	private long id;
	private String title;
	private String description;
	private DifficultyEnum difficulty;
	private List<Tag> tags;
	private Instant updatedAt;
	private String updatedBy;
}
