package com.example.leetcode.domain;

import java.time.Instant;

import com.example.leetcode.util.SecurityUtil;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "exec_results")
@Getter
@Setter
public class ExecResult {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@NotBlank(message = "Input must not blank!")
	private String input;

	@NotBlank(message = "Output must not blank!")
	private String output;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+7")
	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;

	/**
	 * @param input
	 * @param output
	 * @param problem
	 * @param submission
	 */
	public ExecResult(@NotBlank(message = "Input must not blank!") String input,
			@NotBlank(message = "Output must not blank!") String output, Problem problem, Submission submission) {
		this.input = input;
		this.output = output;
		this.problem = problem;
		this.submission = submission;
	}

	@ManyToOne
	@JoinColumn(name = "problem_id")
	private Problem problem;

	@ManyToOne
	@JoinColumn(name = "submission_id")
	private Submission submission;

	@PrePersist
	public void handleBeforeCreate() {
		this.createdAt = Instant.now();
		this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
	}

	@PreUpdate
	public void handleBeforeUpdate() {
		this.updatedAt = Instant.now();
		this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";

	}
}
