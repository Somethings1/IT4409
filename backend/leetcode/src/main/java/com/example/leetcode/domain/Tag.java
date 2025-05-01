package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

import com.example.leetcode.util.SecurityUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

	/**
	 * @param name
	 */
	public Tag(@NotBlank(message = "Name must not blank!") String name) {
		this.name = name;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+7")
	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;

	@ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Problem> problems;

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
