package com.olimpofitness.planes.security;

import com.olimpofitness.planes.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String correo = jwtService.extraerCorreo(token);
            String rol = jwtService.extraerRol(token); // Ej: "ADMIN"

            if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String rolConPrefijo = rol != null && rol.startsWith("ROLE_") ? rol : "ROLE_" + rol;

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                correo,
                                null,
                                List.of(new SimpleGrantedAuthority(rolConPrefijo))
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Si el token es inválido o expiró, no autentica y Spring Security devolverá 403 en rutas protegidas
        }

        filterChain.doFilter(request, response);
    }
}