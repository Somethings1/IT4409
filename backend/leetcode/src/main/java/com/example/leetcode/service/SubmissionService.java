package com.example.leetcode.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.User;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.SubmissionRepository;
import com.example.leetcode.util.constant.SubmissionStatusEnum;

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

	public Submission handleImplementCode(Submission postmanSubmission) {
		List<Testcase> testcases = postmanSubmission.getProblem().getTestcases();
		for (Testcase testcase : testcases) {

			try {
				String code = postmanSubmission.getCode();
				String language = postmanSubmission.getLanguage();
				String inputData = testcase.getInput();

				String fileName = "";
				String compileCommand = null;
				String runCommand = "";

				switch (postmanSubmission.getLanguage()) {
					case "C":
					case "C++":
						fileName = "program.cpp";
						compileCommand = "g++ program.cpp -o program";
						runCommand = "./program";
						break;
					case "Java":
						fileName = "Program.java";
						compileCommand = "javac Program.java";
						runCommand = "java Program";
						break;
					case "Python":
						fileName = "program.py";
						runCommand = "python3 program.py";
						break;
					case "Javascript":
						fileName = "program.js";
						runCommand = "node program.js";
						break;
					default:
						System.out.println("Unsupported language: " + language);
						continue;
				}

				FileWriter writer = new FileWriter(fileName);
				writer.write(code);
				writer.close();

				if (compileCommand != null) {
					Process compileProcess = Runtime.getRuntime().exec(compileCommand.split(""));
					compileProcess.waitFor();
					if (compileProcess.exitValue() != 0) {
						System.out.println("Compilation failed:");
						BufferedReader errorReader = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
						String line;
						while ((line = errorReader.readLine()) != null) {
							System.out.println(line);
						}
						continue;
					}
				}

				Process runProcess = Runtime.getRuntime().exec(runCommand.split(""));

				BufferedWriter processInput = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()));
				processInput.write(inputData);
				processInput.flush();
				processInput.close();

				long startTime = System.nanoTime();

				BufferedReader outputReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
				String line;
				while ((line = outputReader.readLine()) != null) {
					System.out.println(line);
				}

				BufferedReader errorReader = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()));
				while ((line = errorReader.readLine()) != null) {
					System.err.println(line);
				}

				runProcess.waitFor();

				long endTime = System.nanoTime();

				long executionTimeNano = endTime - startTime;
				double executionTimeMillis = executionTimeNano / 1_000_000.0;

				System.out.printf("Execution Time: %.3f ms\n", executionTimeMillis);
			} catch (IOException | InterruptedException e) {
				e.printStackTrace();
			}

		}
	}

}
