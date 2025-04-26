package com.example.leetcode.domain;

import java.time.Instant;
import java.util.List;

import com.example.leetcode.util.SecurityUtil;
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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
public class Permission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@NotBlank(message = "Name must not blank!")
	private String name;

	@NotBlank(message = "API Path must not blank!")
	private String apiPath;

	@NotBlank(message = "Method must not blank!")
	private String method;

	@NotBlank(message = "Module must not blank!")
	private String module;

	private Instant createdAt;
	private Instant updatedAt;
	private String createdBy;
	private String updatedBy;

	@ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Role> roles;

	/**
	 * @param name
	 * @param apiPath
	 * @param method
	 * @param module
	 */
	public Permission(@NotBlank(message = "Name must not blank!") String name,
			@NotBlank(message = "API Path must not blank!") String apiPath,
			@NotBlank(message = "Method must not blank!") String method,
			@NotBlank(message = "Module must not blank!") String module) {
		this.name = name;
		this.apiPath = apiPath;
		this.method = method;
		this.module = module;
	}

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
