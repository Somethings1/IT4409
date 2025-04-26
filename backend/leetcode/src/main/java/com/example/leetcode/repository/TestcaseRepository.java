package com.example.leetcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.leetcode.domain.Problem;
import com.example.leetcode.domain.Testcase;
import java.util.List;

@Repository
public interface TestcaseRepository extends JpaRepository<Testcase, Long>, JpaSpecificationExecutor<Testcase> {
	List<Testcase> findByProblem(Problem problem);
}
