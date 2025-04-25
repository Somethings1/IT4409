package com.example.leetcode.service;

import org.springframework.stereotype.Service;

import com.example.leetcode.repository.ProblemRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProblemService {
	private final ProblemRepository problemRepository;
}
