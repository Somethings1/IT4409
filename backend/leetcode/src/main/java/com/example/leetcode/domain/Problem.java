package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

import com.example.leetcode.util.constant.DifficultyEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class Problem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@NotBlank(message = "Title must not blank!")
	private String title;

	@Column(columnDefinition = "MEDIUMTEXT")
	@NotBlank(message = "Description must not blank!")
	private String description;

	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;
	private DifficultyEnum difficulty;

	@ManyToMany(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = { "problems" })
	@JoinTable(name = "problem_tag", joinColumns = @JoinColumn(name = "problems_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
	private List<Tag> tags;

	@OneToMany(mappedBy = "problem", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Testcase> testcases;

	@OneToMany(mappedBy = "problem", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Submission> submissions;

	@OneToMany(mappedBy = "problem", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Comment> comments;
}
