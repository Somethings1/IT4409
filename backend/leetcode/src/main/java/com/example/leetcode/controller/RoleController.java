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

import com.example.leetcode.domain.Role;
import com.example.leetcode.domain.dto.ResultPaginationDTO;
import com.example.leetcode.service.RoleService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class RoleController {
	private final RoleService roleService;

	@PostMapping("/roles")
	@ApiMessage("Create a new role")
	public ResponseEntity<Role> createNewRole(@Valid @RequestBody Role postmanRole) throws IdInvalidException {
		if (this.roleService.IsRoleNameExisted(postmanRole)) {
			throw new IdInvalidException("Role with name = " + postmanRole.getName() + " existed!");
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.handleCreateRole(postmanRole));

	}

	@PutMapping("/roles")
	@ApiMessage("Update a role")
	public ResponseEntity<Role> updateRole(@Valid @RequestBody Role postmanRole) throws IdInvalidException {
		if (!this.roleService.IsRoleIdExisted(postmanRole.getId())) {
			throw new IdInvalidException("Role with ID = " + postmanRole.getId() + " does not exist!");
		}

		Role updatedRole = this.roleService.handleUpdateRole(postmanRole);

		return ResponseEntity.ok(updatedRole);
	}

	@GetMapping("/roles")
	@ApiMessage("Fetch all roles")
	public ResponseEntity<ResultPaginationDTO> fetchAllRoles(
			@Filter Specification<Role> specification,
			Pageable pageable) {

		return ResponseEntity.ok(this.roleService.handleFetchAllRoles(specification, pageable));
	}

	@DeleteMapping("/roles/{id}")
	@ApiMessage("Delete a role")
	public ResponseEntity<Void> deleteRole(@PathVariable("id") long id) throws IdInvalidException {
		if (!this.roleService.IsRoleIdExisted(id)) {
			throw new IdInvalidException("Role with ID = " + id + " does not exist!");
		}
		this.roleService.handleDeleteRole(id);
		return ResponseEntity.ok(null);
	}

	@GetMapping("/roles/{id}")
	public ResponseEntity<Role> fetchRoleById(@PathVariable("id") long id) throws IdInvalidException {
		Role role = this.roleService.handleFetchRoleById(id);
		if (role == null) {
			throw new IdInvalidException("Role with ID = " + id + " does not exist!");
		}
		return ResponseEntity.ok(role);
	}

}
