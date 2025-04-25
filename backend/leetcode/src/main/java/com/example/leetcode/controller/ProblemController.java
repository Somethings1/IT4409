package com.example.leetcode.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.service.ProblemService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class ProblemController {
	private final ProblemService problemService;

	@PostMapping("/problems")
	public String postMethodName(@RequestBody String entity) {
		// TODO: process POST request

		return entity;
	}

}
