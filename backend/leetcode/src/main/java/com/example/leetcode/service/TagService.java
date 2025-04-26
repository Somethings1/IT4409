package com.example.leetcode.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.leetcode.domain.Tag;
import com.example.leetcode.domain.response.ResultPaginationDTO;
import com.example.leetcode.repository.TagRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TagService {
	private final TagRepository tagRepository;

	public boolean isTagExisted(Tag tag) {
		return this.tagRepository.existsByName(tag.getName());
	}

	public Tag handleSaveTag(Tag postmanTag) {
		return this.tagRepository.save(postmanTag);
	}

	public Tag fetchTagById(long id) {
		Optional<Tag> tagOptional = this.tagRepository.findById(id);
		return tagOptional.isPresent() ? tagOptional.get() : null;
	}

	public ResultPaginationDTO handleFetchAllTags(Specification<Tag> specification, Pageable pageable) {
		Page<Tag> page = this.tagRepository.findAll(specification, pageable);
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

	public void handleDeleteTag(long id) {
		Tag tag = fetchTagById(id);
		tag.getProblems().forEach(problem -> problem.getTags().remove(tag));
		this.tagRepository.delete(tag);
	}
}
