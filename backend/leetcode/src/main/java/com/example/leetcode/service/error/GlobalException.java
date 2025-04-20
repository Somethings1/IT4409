package com.example.leetcode.service.error;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public ResponseEntity<RestResponse<Object>> handleUsernameException(
			MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		final List<FieldError> fieldErrors = result.getFieldErrors();

		RestResponse<Object> res = new RestResponse<>();
		res.setStatusCode(HttpStatus.BAD_REQUEST.value());
		res.setError(ex.getBody().getDetail());

		List<String> errors = fieldErrors.stream().map(f -> f.getDefaultMessage()).collect(Collectors.toList());
		res.setMessage(errors.size() > 1 ? errors : errors.get(0));
		return ResponseEntity.badRequest().body(res);
	}
}
