package com.example.leetcode.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.response.problem.ResCreateProblemDTO;
import com.example.leetcode.domain.response.problem.ResUpdateProblemDTO;
import com.example.leetcode.service.ProblemService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class ProblemController {
	private final ProblemService problemService;

	@PostMapping("/problems")
	public ResponseEntity<ResCreateProblemDTO> createProblem(@Valid @RequestBody Problem postmanProblem) {
		ResCreateProblemDTO createProblemDTO = this.problemService.handleCreateProblem(postmanProblem);
		return ResponseEntity.status(HttpStatus.CREATED).body(createProblemDTO);

	}

	@PutMapping("/problems")
	@ApiMessage("Update a problem")
	public ResponseEntity<ResUpdateProblemDTO> updateProblem(@Valid @RequestBody Problem postmanProblem)
			throws IdInvalidException {
		ResUpdateProblemDTO updateProblemDTO = this.problemService.handleUpdateProblem(postmanProblem);
		if (updateProblemDTO == null) {
			throw new IdInvalidException("Problem with ID = " + postmanProblem.getId() + " does not exist");
		}
		return ResponseEntity.ok(updateProblemDTO);
	}

}
