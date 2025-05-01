package com.example.leetcode.service;

import org.springframework.stereotype.Service;

import com.example.leetcode.domain.ExecResult;
import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.repository.ExecResultRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ExecResultService {
	private final ExecResultRepository execResultRepository;

	public ExecResult handleSaveExecResult(String input, boolean status, Problem problem, Submission submission) {
		return this.execResultRepository.save(new ExecResult(input, status, problem, submission));
	}
}
