package com.example.leetcode.service.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.leetcode.domain.response.RestResponse;

@RestControllerAdvice
public class GlobalException {
	@ExceptionHandler(value = IdInvalidException.class)
	public ResponseEntity<RestResponse<Object>> handleIdException(IdInvalidException idException) {
		RestResponse<Object> res = new RestResponse<>();
		res.setStatusCode(HttpStatus.BAD_REQUEST.value());
		res.setError(idException.getMessage());
		res.setMessage("IdInvalidException");
		return ResponseEntity.badRequest().body(res);
	}
}
