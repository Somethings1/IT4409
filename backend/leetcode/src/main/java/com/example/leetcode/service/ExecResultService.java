package com.example.leetcode.service;

import org.springframework.stereotype.Service;

import com.example.leetcode.domain.ExecResult;
import com.example.leetcode.repository.ExecResultRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ExecResultService {
	private final ExecResultRepository execResultRepository;

	public ExecResult handleSaveExecResult() {
	}
}
