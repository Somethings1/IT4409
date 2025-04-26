package com.example.leetcode.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.TestcaseRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TestcaseService {
	private final TestcaseRepository testcaseRepository;
	private final ProblemService problemService;

	public Testcase handleSaveTestcase(Testcase testcase) {
		if (testcase.getProblem() != null) {
			Problem problem = this.problemService.handleFetchProblemByID(testcase.getProblem().getId());
			testcase.setProblem(problem);
		}
		return this.testcaseRepository.save(testcase);
	}

	public Testcase fetchTestcaseById(long id) {
		Optional<Testcase> optional = this.testcaseRepository.findById(id);
		return optional.isPresent() ? optional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllTestcases(Specification<Testcase> specification, Pageable pageable) {
		Page<Testcase> page = this.testcaseRepository.findAll(specification, pageable);
		ResultPaginationDTO result = new ResultPaginationDTO();
		ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

		meta.setPage(page.getNumber() + 1);
		meta.setPageSize(page.getSize());
		meta.setPages(page.getTotalPages());
		meta.setTotal(page.getTotalElements());

		result.setMeta(meta);
		result.setResult(page.getContent());
		return result;
	}

	public void handleDeleteTestcase(long id) {
		this.testcaseRepository.deleteById(id);
	}

}
