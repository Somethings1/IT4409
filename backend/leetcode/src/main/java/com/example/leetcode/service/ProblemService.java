package com.example.leetcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Comment;
import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.Tag;
import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.domain.response.problem.ResCreateProblemDTO;
import com.example.leetcode.domain.response.problem.ResUpdateProblemDTO;
import com.example.leetcode.repository.CommentRepository;
import com.example.leetcode.repository.ProblemRepository;
import com.example.leetcode.repository.SubmissionRepository;
import com.example.leetcode.repository.TagRepository;
import com.example.leetcode.repository.TestcaseRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProblemService {
	private final ProblemRepository problemRepository;
	private final TagRepository tagRepository;
	private final CommentRepository commentRepository;
	private final TestcaseRepository testcaseRepository;
	private final SubmissionRepository submissionRepository;

	public ResCreateProblemDTO handleCreateProblem(Problem postmanProblem) {
		if (postmanProblem.getTags() != null) {
			List<Long> ids = postmanProblem.getTags()
					.stream().map(tag -> tag.getId())
					.toList();
			List<Tag> tags = this.tagRepository.findByIdIn(ids);
			postmanProblem.setTags(tags);
		}
		Problem problem = this.problemRepository.save(postmanProblem);
		ResCreateProblemDTO createProblemDTO = convertToResCreateProblemDTO(problem);
		return createProblemDTO;
	}

	public ResCreateProblemDTO convertToResCreateProblemDTO(Problem problem) {
		return new ResCreateProblemDTO(
				problem.getId(),
				problem.getTitle(),
				problem.getDescription(),
				problem.getDifficulty(),
				problem.getCreatedAt(),
				problem.getCreatedBy());
	}

	public ResUpdateProblemDTO handleUpdateProblem(Problem postmanProblem) {
		Optional<Problem> problemOptional = this.problemRepository.findById(postmanProblem.getId());
		if (problemOptional.isEmpty()) {
			return null;
		}
		Problem updatedProblem = problemOptional.get();
		if (postmanProblem.getTags() != null) {
			List<Long> ids = postmanProblem.getTags()
					.stream().map(tag -> tag.getId())
					.toList();
			List<Tag> tags = this.tagRepository.findByIdIn(ids);
			updatedProblem.setTags(tags);
		}
		updatedProblem.setTitle(postmanProblem.getTitle());
		updatedProblem.setDescription(postmanProblem.getDescription());
		updatedProblem.setDifficulty(postmanProblem.getDifficulty());
		this.problemRepository.save(updatedProblem);
		return this.converToResUpdateProblemDTO(updatedProblem);
	}

	public ResUpdateProblemDTO converToResUpdateProblemDTO(Problem problem) {
		return new ResUpdateProblemDTO(
				problem.getId(),
				problem.getTitle(),
				problem.getDescription(),
				problem.getDifficulty(),
				problem.getTags(),
				problem.getUpdatedAt(),
				problem.getUpdatedBy());
	}

	public Problem handleFetchProblemByID(long id) {
		Optional<Problem> optional = this.problemRepository.findById(id);
		return optional.isPresent() ? optional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllProblems(Specification<Problem> specification, Pageable pageable) {
		Page<Problem> page = this.problemRepository.findAll(specification, pageable);
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

	public void handleDeleteProblem(long id) {
		Problem problem = handleFetchProblemByID(id);
		List<Comment> comments = this.commentRepository.findByProblem(problem);
		this.commentRepository.deleteAll(comments);

		List<Testcase> testcases = this.testcaseRepository.findByProblem(problem);
		this.testcaseRepository.deleteAll(testcases);

		List<Submission> submissions = this.submissionRepository.findByProblem(problem);
		this.submissionRepository.deleteAll(submissions);

		this.problemRepository.delete(problem);

	}
}
