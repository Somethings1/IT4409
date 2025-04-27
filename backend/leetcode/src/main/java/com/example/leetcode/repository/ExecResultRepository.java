package com.example.leetcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.leetcode.domain.ExecResult;

@Repository
public interface ExecResultRepository extends JpaRepository<ExecResult, Long>, JpaSpecificationExecutor<ExecResult> {

}
