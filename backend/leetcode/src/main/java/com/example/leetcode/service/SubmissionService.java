package com.example.leetcode.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

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

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SubmissionService {
	private final SubmissionRepository submissionRepository;
	private final UserService userService;
	private final ProblemService problemService;
	private final ExecResultService execResultService;

	public Submission handleSaveSubmission(Submission postmanSubmission) throws IOException, InterruptedException {
		if (postmanSubmission.getUser() != null) {
			User user = this.userService.fetchUserById(postmanSubmission.getUser().getId());
			postmanSubmission.setUser(user);
		}

		if (postmanSubmission.getProblem() != null) {
			Problem problem = this.problemService.handleFetchProblemByID(postmanSubmission.getProblem().getId());
			postmanSubmission.setProblem(problem);
		}
		postmanSubmission = this.handleImplementCode(postmanSubmission);
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

	public Submission handleImplementCode(Submission postmanSubmission) throws IOException, InterruptedException {
		List<Testcase> testcases = postmanSubmission.getProblem().getTestcases();
		String code = postmanSubmission.getCode();
		String language = postmanSubmission.getLanguage();

		long right = 0;
		String baseDir = "./implement/";
		for (Testcase testcase : testcases) {

			String inputData = testcase.getInput();
			String fileName = getFileName(language);
			String compileCommand = getCompileCommand(language, fileName);
			String runCommand = getRunCommand(language, fileName);

			if (fileName == null || runCommand == null) {
				this.execResultService.handleSaveExecResult(inputData, false, postmanSubmission.getProblem(),
						postmanSubmission);
				continue;
			}

			String filePath = baseDir + fileName;
			writeToFile(filePath, code);

			if (compileCommand != null && !executeCommand(compileCommand)) {
				this.execResultService.handleSaveExecResult(inputData, false, postmanSubmission.getProblem(),
						postmanSubmission);
				continue;
			}

			String output = executeProgram(runCommand, inputData);
			if (output == null || !output.equals(testcase.getOutput())) {
				this.execResultService.handleSaveExecResult(inputData, false, postmanSubmission.getProblem(),
						postmanSubmission);
				continue;
			}

			right++;
			this.execResultService.handleSaveExecResult(inputData, true, postmanSubmission.getProblem(), postmanSubmission);

		}
		postmanSubmission.setRightTestcase(right);
		postmanSubmission.setTotalTestcase(testcases.size());
		return postmanSubmission;
	}

	private String getFileName(String language) {
		switch (language) {
			case "C":
			case "C++":
				return "program.cpp";
			case "Java":
				return "Program.java";
			case "Python":
				return "program.py";
			case "Javascript":
				return "program.js";
			default:
				return null;
		}
	}

	private String getCompileCommand(String language, String fileName) {
		switch (language) {
			case "C":
			case "C++":
				return "g++ " + fileName + " -o program";
			case "Java":
				return "javac " + fileName;
			default:
				return null;
		}
	}

	private String getRunCommand(String language, String fileName) {
		switch (language) {
			case "C":
			case "C++":
				return "./program";
			case "Java":
				return "java Program";
			case "Python":
				return "python3 " + fileName;
			case "Javascript":
				return "node " + fileName;
			default:
				return null;
		}
	}

	private void writeToFile(String filePath, String content) throws IOException {
		try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
			writer.write(content);
		}
	}

	private boolean executeCommand(String command) throws IOException, InterruptedException {
		Process process = new ProcessBuilder(command.split(" ")).start();
		process.waitFor();
		return process.exitValue() == 0;
	}

	private String executeProgram(String command, String input) throws IOException, InterruptedException {
		Process process = new ProcessBuilder(command.split(" ")).start();
		try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
			writer.write(input);
			writer.flush();
			process.waitFor();
			return reader.lines().collect(Collectors.joining());
		}
	}

}
