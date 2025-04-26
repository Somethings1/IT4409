package com.example.leetcode.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.User;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.SubmissionRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SubmissionService {
	private final SubmissionRepository submissionRepository;
	private final UserService userService;
	private final ProblemService problemService;

	public Submission handleSaveSubmission(Submission postmanSubmission) {
		if (postmanSubmission.getUser() != null) {
			User user = this.userService.fetchUserById(postmanSubmission.getUser().getId());
			postmanSubmission.setUser(user);
		}

		if (postmanSubmission.getProblem() != null) {
			Problem problem = this.problemService.handleFetchProblemByID(postmanSubmission.getProblem().getId());
			postmanSubmission.setProblem(problem);
		}
		return this.submissionRepository.save(postmanSubmission);
	}

	public Submission fetchSubmissionById(long id) {
		Optional<Submission> optional = this.submissionRepository.findById(id);
		return optional.isPresent() ? optional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllSubmissions(Specification<Submission> specification, Pageable pageable) {
		Page<Submission> page = this.submissionRepository.findAll(specification, pageable);
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

}
