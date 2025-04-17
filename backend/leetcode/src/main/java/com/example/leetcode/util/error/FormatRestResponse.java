package com.example.leetcode.util.error;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.example.leetcode.domain.response.RestResponse;

import jakarta.servlet.http.HttpServletResponse;

@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

	@Override
	public boolean supports(MethodParameter returnType, Class converterType) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@Nullable
	public Object beforeBodyWrite(
			@Nullable Object body,
			MethodParameter returnType,
			MediaType selectedContentType,
			Class selectedConverterType,
			ServerHttpRequest request,
			ServerHttpResponse response) {

		HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
		int status = servletResponse.getStatus();
		RestResponse<Object> res = new RestResponse<>();
		res.setStatusCode(status);

		if (body instanceof String) {
			return body;
		}

		if (status >= 400) {
			// case error
			return body;
		} else {
			// case success
			res.setData(body);
			res.setMessage("CALL API SUCCESS");
		}
		return res;
	}

}
