package com.example.leetcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.leetcode.domain.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long>, JpaSpecificationExecutor<Problem> {

}
