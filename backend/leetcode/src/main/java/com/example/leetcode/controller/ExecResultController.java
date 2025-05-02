package com.example.leetcode.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.ExecResult;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.service.ExecResultService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class ExecResultController {
	private final ExecResultService execResultService;

	@GetMapping("/results")
	@ApiMessage("Fetch all results")
	public ResponseEntity<ResultPaginationDTO> getAllExecResults(
			@Filter Specification<ExecResult> specification,
			Pageable pageable) {

		ResultPaginationDTO dto = this.execResultService.handleFetchAllExecResults(specification, pageable);
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/results/{id}")
	@ApiMessage("Fetch execResult by ID")
	public ResponseEntity<ExecResult> fetchExecResultByID(@PathVariable("id") long id)
			throws IdInvalidException {
		ExecResult execResult = this.execResultService.fetchExecResultById(id);
		if (execResult == null) {
			throw new IdInvalidException("ExecResult with ID = " + id + " does not exist");
		}
		return ResponseEntity.ok(execResult);
	}
}
