package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tags")
@Getter
@Setter
public class Tag {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@NotBlank(message = "Name must not blank!")
	private String name;

	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;

	@ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Problem> problems;
}
