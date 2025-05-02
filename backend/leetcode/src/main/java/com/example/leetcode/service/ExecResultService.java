package com.example.leetcode.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.ExecResult;
import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.ExecResultRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ExecResultService {
	private final ExecResultRepository execResultRepository;

	public ExecResult handleSaveExecResult(String input, boolean status, Problem problem, Submission submission) {
		return this.execResultRepository.save(new ExecResult(input, status, problem, submission));
	}

	public ExecResult fetchExecResultById(long id) {
		Optional<ExecResult> optional = this.execResultRepository.findById(id);
		return optional.isPresent() ? optional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllExecResults(Specification<ExecResult> specification, Pageable pageable) {
		Page<ExecResult> page = this.execResultRepository.findAll(specification, pageable);
		ResultPaginationDTO dto = new ResultPaginationDTO();
		ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

		meta.setPage(page.getNumber() + 1);
		meta.setPageSize(page.getSize());
		meta.setPages(page.getTotalPages());
		meta.setTotal(page.getTotalElements());

		dto.setMeta(meta);
		dto.setResult(page.getContent());
		return dto;
	}
}
