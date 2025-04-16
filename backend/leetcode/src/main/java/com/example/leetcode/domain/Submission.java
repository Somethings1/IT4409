package com.example.leetcode.domain;

import java.time.Instant;

import com.example.leetcode.util.constant.SubmissionStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

	private double execTime;
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

}
