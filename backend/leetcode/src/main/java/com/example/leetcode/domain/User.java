package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String name;

	@NotBlank(message = "Email isn't blank'")
	private String email;

	@NotBlank(message = "Password isn't blank'")
	private String password;
	private int age;

	private String address;

	@Column(columnDefinition = "MEDIUMTEXT")
	private String refreshToken;
	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;

	@ManyToOne
	@JoinColumn(name = "role_id")
	private Role role;

	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Submission> submissions;

	// @PrePersist
	// public void handleBeforeCreate() {
	// this.createdAt = Instant.now();
	// this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ?
	// SecurityUtil.getCurrentUserLogin().get() : "";
	// }

	// @PreUpdate
	// public void handleBeforeUpdate() {
	// this.updatedAt = Instant.now();
	// this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ?
	// SecurityUtil.getCurrentUserLogin().get() : "";

	// }
}
