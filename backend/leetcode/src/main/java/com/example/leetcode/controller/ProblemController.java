package com.example.leetcode.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.domain.response.problem.ResCreateProblemDTO;
import com.example.leetcode.domain.response.problem.ResUpdateProblemDTO;
import com.example.leetcode.service.ProblemService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

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

	@GetMapping("/problems/{id}")
	@ApiMessage("Fetch problem by ID")
	public ResponseEntity<Problem> fetchProblemByID(@PathVariable("id") long id)
			throws IdInvalidException {
		Problem problem = this.problemService.handleFetchProblemByID(id);
		if (problem == null) {
			throw new IdInvalidException("Problem with ID = " + id + " does not exist");
		}
		return ResponseEntity.ok(problem);
	}

	@GetMapping("/problems")
	@ApiMessage("Fetch all problems")
	public ResponseEntity<ResultPaginationDTO> fetchAllProblems(
			@Filter Specification<Problem> specification,
			Pageable pageable) {
		ResultPaginationDTO dto = this.problemService.handleFetchAllProblems(specification, pageable);
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping("/problems/{id}")
	@ApiMessage("Delete a problem")
	public ResponseEntity<Void> deleteProblem(@PathVariable("id") long id)
			throws IdInvalidException {
		Problem problem = this.problemService.handleFetchProblemByID(id);
		if (problem == null) {
			throw new IdInvalidException("Problem with ID = " + id + " does not exist");
		}
		this.problemService.handleDeleteProblem(id);
		return ResponseEntity.ok(null);

	}

}
