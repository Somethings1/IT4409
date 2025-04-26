package com.example.leetcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Tag;
import com.example.leetcode.domain.response.problem.ResCreateProblemDTO;
import com.example.leetcode.domain.response.problem.ResUpdateProblemDTO;
import com.example.leetcode.repository.ProblemRepository;
import com.example.leetcode.repository.TagRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProblemService {
	private final ProblemRepository problemRepository;
	private final TagRepository tagRepository;

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
			postmanProblem.setTags(tags);
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
}
