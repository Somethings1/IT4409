package com.example.leetcode.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.ExecResult;
import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Submission;
import com.example.leetcode.domain.Testcase;
import com.example.leetcode.domain.User;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.ExecResultRepository;
import com.example.leetcode.repository.SubmissionRepository;
import com.example.leetcode.util.constant.SubmissionStatusEnum;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SubmissionService {
	private final SubmissionRepository submissionRepository;
	private final UserService userService;
	private final ProblemService problemService;
	private final ExecResultRepository execResultRepository;

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
		String baseDir = "./";
		List<ExecResult> execResults = new ArrayList<>();
		for (Testcase testcase : testcases) {

			String inputData = testcase.getInput();
			String fileName = getFileName(language);
			String compileCommand = getCompileCommand(language, fileName);
			String runCommand = getRunCommand(language, fileName);

			if (fileName == null || runCommand == null) {
				execResults.add(new ExecResult(inputData, false, postmanSubmission.getProblem(),
						null));
				continue;
			}

			String filePath = baseDir + fileName;
			writeToFile(filePath, code);

			if (language.equals("C++") && compileCommand != null && !executeCommand(compileCommand)) {
				execResults.add(new ExecResult(inputData, false, postmanSubmission.getProblem(),
						null));
				continue;
			}

			String output = executeProgram(runCommand, inputData);
			if (output == null || !output.equals(testcase.getOutput() + "\n")) {
				execResults.add(new ExecResult(inputData, false, postmanSubmission.getProblem(),
						null));
				continue;
			}

			right++;
			execResults.add(new ExecResult(inputData, true, postmanSubmission.getProblem(), null));

		}
		postmanSubmission.setRightTestcase(right);
		postmanSubmission.setTotalTestcase(testcases.size());
		if (right == testcases.size()) {
			postmanSubmission.setStatus(SubmissionStatusEnum.ACCEPTED);
		} else if (right == 0) {
			postmanSubmission.setStatus(SubmissionStatusEnum.FAILED);
		} else {
			postmanSubmission.setStatus(SubmissionStatusEnum.PARTIAL);
		}
		Submission submission = this.submissionRepository.save(postmanSubmission);
		execResults.forEach(execResult -> execResult.setSubmission(submission));
		this.execResultRepository.saveAll(execResults);
		return postmanSubmission;
	}

	private String getFileName(String language) {
		switch (language) {
			case "C":
			case "C++":
				return "program.cpp";
			case "Java":
				return "program.java";
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
		Process process = Runtime.getRuntime().exec(command.split(" "));
		process.waitFor();
		return process.exitValue() == 0;
	}

	private String executeProgram(String command, String input) throws IOException, InterruptedException {
		Process process = Runtime.getRuntime().exec(command.split(" "));
		try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
			writer.write(input);
			writer.flush();
			writer.close();
			String output = "", line;
			while ((line = reader.readLine()) != null) {
				output = output + line + "\n";
			}

			process.waitFor();
			return output;
		}
	}

}
