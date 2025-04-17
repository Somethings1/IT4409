package com.example.leetcode.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.example.leetcode.domain.response.RestResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();
	private final ObjectMapper mapper;

	/**
	 * @param mapper
	 */
	public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
		this.mapper = mapper;
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException {
		this.delegate.commence(request, response, authException);
		response.setContentType("application/json;charset=UTF-8");

		RestResponse<Object> res = new RestResponse<>();
		res.setStatusCode(HttpStatus.UNAUTHORIZED.value());
		res.setError((authException.getCause().getMessage()));
		res.setMessage("Invalid Token (Expired, ...)");

		mapper.writeValue(response.getWriter(), res);
	}

}