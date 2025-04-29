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
		for (Testcase testcase : testcases) {

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
					fileName = "program.java";
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
					this.execResultService.handleSaveExecResult(inputData, "Unsupported language: " + language,
							postmanSubmission.getProblem(), postmanSubmission);
					continue;
			}

			FileWriter writer = new FileWriter("./implement/" + fileName);
			writer.write(code);
			writer.close();

			if (compileCommand != null) {
				Process compileProcess = Runtime.getRuntime().exec(compileCommand.split(""));
				compileProcess.waitFor();
				if (compileProcess.exitValue() != 0) {

					BufferedReader errorReader = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
					String line;
					String error = errorReader.lines().collect(Collectors.joining());
					this.execResultService.handleSaveExecResult(inputData, error, postmanSubmission.getProblem(),
							postmanSubmission);
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

			String output = outputReader.lines().collect(Collectors.joining());

			BufferedReader errorReader = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()));
			String error = errorReader.lines().collect(Collectors.joining());

			runProcess.waitFor();
			right++;
			this.execResultService.handleSaveExecResult(inputData, output + System.lineSeparator() + error,
					postmanSubmission.getProblem(), postmanSubmission);

		}
		postmanSubmission.setRight(right);
		postmanSubmission.setTotal(postmanSubmission.getProblem().getTestcases().size());
		return postmanSubmission;
	}

}
