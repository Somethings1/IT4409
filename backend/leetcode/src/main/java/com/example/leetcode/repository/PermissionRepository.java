package com.example.leetcode.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.leetcode.domain.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
	boolean existsByNameAndApiPathAndMethodAndModule(String name, String apiPath, String method, String module);

	List<Permission> findByIdIn(List<Long> id);

}
