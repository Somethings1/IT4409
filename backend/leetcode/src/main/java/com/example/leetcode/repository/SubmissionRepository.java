package com.example.leetcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.leetcode.domain.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {

}
