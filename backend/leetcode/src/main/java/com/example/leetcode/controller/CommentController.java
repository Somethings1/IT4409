package com.example.leetcode.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Comment;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.service.CommentService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class CommentController {
	private final CommentService commentService;

	@PostMapping("/comments")
	@ApiMessage("Create a new comment")
	public ResponseEntity<Comment> createNewComment(@Valid @RequestBody Comment postmanComment)
			throws IdInvalidException {
		Comment comment = this.commentService.handleSaveComment(postmanComment);

		return ResponseEntity.status(HttpStatus.CREATED).body(comment);
	}

	@PutMapping("/comments")
	@ApiMessage("Update a comment")
	public ResponseEntity<Comment> updateComment(@Valid @RequestBody Comment postmanComment)
			throws IdInvalidException {
		Comment comment = this.commentService.fetchCommentById(postmanComment.getId());
		if (comment == null) {
			throw new IdInvalidException("Comment with ID = " + postmanComment.getId() + " does not exist!");
		}

		comment.setContent(postmanComment.getContent());
		this.commentService.handleSaveComment(comment);
		return ResponseEntity.ok(comment);
	}

	@GetMapping("/comments")
	@ApiMessage("Fetch all comments")
	public ResponseEntity<ResultPaginationDTO> getAllComments(
			@Filter Specification<Comment> specification,
			Pageable pageable) {

		ResultPaginationDTO dto = this.commentService.handleFetchAllComments(specification, pageable);
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping("/comments/{id}")
	@ApiMessage("Delete a comment")
	public ResponseEntity<Void> deleteComment(@PathVariable("id") long id)
			throws IdInvalidException {
		Comment comment = this.commentService.fetchCommentById(id);
		if (comment == null) {
			throw new IdInvalidException("Comment with ID = " + id + " does not exist!");
		}
		this.commentService.handleDeleteComment(id);
		return ResponseEntity.ok(null);
	}
}
