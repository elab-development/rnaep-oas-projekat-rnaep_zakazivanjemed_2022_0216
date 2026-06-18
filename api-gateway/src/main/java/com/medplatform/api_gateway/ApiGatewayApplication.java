package com.medplatform.api_gateway;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import java.io.IOException;

@SpringBootApplication
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	@Order(Ordered.HIGHEST_PRECEDENCE)
	public Filter corsFilter() {
		return new Filter() {
			@Override
			public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
					throws IOException, ServletException {
				HttpServletResponse response = (HttpServletResponse) res;
				HttpServletRequest request = (HttpServletRequest) req;

				response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
				response.setHeader("Access-Control-Allow-Credentials", "true");
				response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
				response.setHeader("Access-Control-Allow-Headers", "*");
				response.setHeader("Access-Control-Max-Age", "3600");

				if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
					response.setStatus(HttpServletResponse.SC_OK);
				} else {
					chain.doFilter(req, res);
				}
			}
		};
	}
}