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

import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.service.TestcaseService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class TestcaseController {
	private final TestcaseService testcaseService;

	@PostMapping("/testcases")
	@ApiMessage("Create a new testcase")
	public ResponseEntity<Testcase> createNewTestcase(@Valid @RequestBody Testcase postmanTestcase)
			throws IdInvalidException {
		Testcase testcase = this.testcaseService.handleSaveTestcase(postmanTestcase);

		return ResponseEntity.status(HttpStatus.CREATED).body(testcase);
	}

	@PutMapping("/testcases")
	@ApiMessage("Update a testcase")
	public ResponseEntity<Testcase> updateTestcase(@Valid @RequestBody Testcase postmanTestcase)
			throws IdInvalidException {
		Testcase testcase = this.testcaseService.fetchTestcaseById(postmanTestcase.getId());
		if (testcase == null) {
			throw new IdInvalidException("Testcase with ID = " + postmanTestcase.getId() + " does not exist!");
		}

		testcase.setInput(postmanTestcase.getInput());
		testcase.setOutput(postmanTestcase.getOutput());
		testcase.setActive(postmanTestcase.isActive());
		testcase.setProblem(postmanTestcase.getProblem());
		this.testcaseService.handleSaveTestcase(testcase);
		return ResponseEntity.ok(testcase);
	}

	@GetMapping("/testcases")
	@ApiMessage("Fetch all testcases")
	public ResponseEntity<ResultPaginationDTO> getAllTestcases(
			@Filter Specification<Testcase> specification,
			Pageable pageable) {

		ResultPaginationDTO dto = this.testcaseService.handleFetchAllTestcases(specification, pageable);
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping("/testcases/{id}")
	@ApiMessage("Delete a testcase")
	public ResponseEntity<Void> deleteTestcase(@PathVariable("id") long id)
			throws IdInvalidException {
		Testcase testcase = this.testcaseService.fetchTestcaseById(id);
		if (testcase == null) {
			throw new IdInvalidException("Testcase with ID = " + id + " does not exist!");
		}
		this.testcaseService.handleDeleteTestcase(id);
		return ResponseEntity.ok(null);
	}
}
