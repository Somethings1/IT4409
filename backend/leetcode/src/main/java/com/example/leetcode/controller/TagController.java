package com.example.leetcode.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.leetcode.domain.Tag;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.service.TagService;
import com.example.leetcode.util.annotation.ApiMessage;
import com.example.leetcode.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

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

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class TagController {
	private final TagService tagService;

	@PostMapping("/tags")
	@ApiMessage("Create a new tag")
	public ResponseEntity<Tag> createNewTag(@Valid @RequestBody Tag postmanTag)
			throws IdInvalidException {
		if (this.tagService.isTagExisted(postmanTag)) {
			throw new IdInvalidException("Tag named " + postmanTag.getName() + " existed!");
		}
		Tag tag = this.tagService.handleSaveTag(postmanTag);

		return ResponseEntity.status(HttpStatus.CREATED).body(tag);
	}

	@PutMapping("/tags")
	@ApiMessage("Update a tag")
	public ResponseEntity<Tag> updateTag(@Valid @RequestBody Tag postmanTag)
			throws IdInvalidException {
		if (this.tagService.isTagExisted(postmanTag)) {
			throw new IdInvalidException("Tag named " + postmanTag.getName() + " existed!");
		}
		Tag tag = this.tagService.fetchTagById(postmanTag.getId());
		if (tag == null) {
			throw new IdInvalidException("Tag with ID = " + postmanTag.getId() + " does not exist!");
		}

		tag.setName(postmanTag.getName());
		this.tagService.handleSaveTag(tag);
		return ResponseEntity.ok(tag);
	}

	@GetMapping("/tags")
	@ApiMessage("Fetch all tags")
	public ResponseEntity<ResultPaginationDTO> getAllTags(
			@Filter Specification<Tag> specification,
			Pageable pageable) {

		ResultPaginationDTO dto = this.tagService.handleFetchAllTags(specification, pageable);
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping("/tags/{id}")
	@ApiMessage("Delete a tag")
	public ResponseEntity<Void> deleteTag(@PathVariable("id") long id)
			throws IdInvalidException {
		Tag tag = this.tagService.fetchTagById(id);
		if (tag == null) {
			throw new IdInvalidException("Tag with ID = " + id + " does not exist!");
		}
		this.tagService.handleDeleteTag(id);
		return ResponseEntity.ok(null);
	}

}
