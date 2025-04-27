package com.example.leetcode.controller;

import java.io.IOException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.service.SubmissionService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class SubmissionController {
	private final SubmissionService submissionService;

	@PostMapping("/submissions")
	@ApiMessage("Create a new submission")
	public ResponseEntity<Submission> createNewSubmission(@Valid @RequestBody Submission postmanSubmission)
			throws IOException, InterruptedException {
		Submission submission = this.submissionService.handleSaveSubmission(postmanSubmission);
		return ResponseEntity.status(HttpStatus.CREATED).body(submission);
	}

	@GetMapping("/submissions")
	@ApiMessage("Fetch all submissions")
	public ResponseEntity<ResultPaginationDTO> getAllSubmissions(
			@Filter Specification<Submission> specification,
			Pageable pageable) {

		ResultPaginationDTO dto = this.submissionService.handleFetchAllSubmissions(specification, pageable);
		return ResponseEntity.ok(dto);
	}

}
