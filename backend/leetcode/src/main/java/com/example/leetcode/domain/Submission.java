package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

import com.example.leetcode.util.SecurityUtil;
import com.example.leetcode.util.constant.SubmissionStatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "submissions")
@Getter
@Setter
public class Submission {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@NotBlank(message = "Code must not blank!")
	@Column(columnDefinition = "MEDIUMTEXT")
	private String code;

	@NotBlank(message = "Language must not blank!")
	private String language;

	private long rightTestcase;
	private long totalTestcase;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+7")
	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;
	private SubmissionStatusEnum status;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "problem_id")
	private Problem problem;

	@OneToMany(mappedBy = "submission", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<ExecResult> execResults;

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
