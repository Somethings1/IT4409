package com.example.leetcode.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Permission;
import com.example.leetcode.domain.dto.ResultPaginationDTO;
import com.example.leetcode.service.PermissionService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class PermissionController {
	private final PermissionService permissionService;

	@PostMapping("/permissions")
	@ApiMessage("Create a new permission")
	public ResponseEntity<Permission> createPermission(@Valid @RequestBody Permission postmanPermission)
			throws IdInvalidException {
		if (this.permissionService.checkExistPermission(postmanPermission)) {
			throw new IdInvalidException("This permission has already existed!");
		}
		Permission permission = this.permissionService.handleSavePermission(postmanPermission);
		return ResponseEntity.status(HttpStatus.CREATED).body(permission);
	}

	@PutMapping("/permissions")
	@ApiMessage("Update a permission")
	public ResponseEntity<Permission> updatePermission(@Valid @RequestBody Permission postmanPermission)
			throws IdInvalidException {
		Permission updatedPermission = this.permissionService.handleFetchPermissionById(postmanPermission.getId());
		if (updatedPermission == null) {
			throw new IdInvalidException("Permission with ID = " + postmanPermission.getId() + " does not exist!");
		}
		if (this.permissionService.checkExistPermission(postmanPermission)) {
			throw new IdInvalidException("This permission has already existed!");
		}
		updatedPermission.setName(postmanPermission.getName());
		updatedPermission.setApiPath(postmanPermission.getApiPath());
		updatedPermission.setMethod(postmanPermission.getMethod());
		updatedPermission.setModule(postmanPermission.getModule());
		updatedPermission = this.permissionService.handleSavePermission(updatedPermission);

		return ResponseEntity.ok(updatedPermission);
	}

	@GetMapping("/permissions")
	@ApiMessage("Fetch all permissions")
	public ResponseEntity<ResultPaginationDTO> fetchAllPermissions(
			@Filter Specification<Permission> specification,
			Pageable pageable) {
		ResultPaginationDTO paginationDTO = this.permissionService.handleFetchAllPermissions(specification, pageable);

		return ResponseEntity.ok(paginationDTO);
	}

	@DeleteMapping("/permissions/{id}")
	@ApiMessage("Delete a permission")
	public ResponseEntity<Void> deletePermission(@PathVariable("id") long id) throws IdInvalidException {
		Permission permission = this.permissionService.handleFetchPermissionById(id);
		if (permission == null) {
			throw new IdInvalidException("Permission with ID = " + id + " does not exist!");
		}
		this.permissionService.handleDeletePermission(permission);
		return ResponseEntity.ok(null);
	}

}
