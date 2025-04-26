package com.example.leetcode.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Comment;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.CommentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;

	public Comment handleSaveComment(Comment postmanComment) {
		return this.commentRepository.save(postmanComment);
	}

	public Comment fetchCommentById(long id) {
		Optional<Comment> optional = this.commentRepository.findById(id);
		return optional.isPresent() ? optional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllComments(Specification<Comment> specification, Pageable pageable) {
		Page<Comment> page = this.commentRepository.findAll(specification, pageable);
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

	public void handleDeleteComment(long id) {
		this.commentRepository.deleteById(id);
	}

}
