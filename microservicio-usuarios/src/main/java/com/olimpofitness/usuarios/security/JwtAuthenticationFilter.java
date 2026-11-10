package com.olimpofitness.usuarios.security;

import com.olimpofitness.usuarios.service.JwtService;
import com.olimpofitness.usuarios.model.Usuario;
import com.olimpofitness.usuarios.repository.UsuarioRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

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
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository) {

        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {
                Claims claims = jwtService.validarToken(token);
                String correo = claims.getSubject();

                Usuario usuario = usuarioRepository
                        .findByCorreo(correo)
                        .orElse(null);

                if (usuario != null) {

                    var autoridad = new SimpleGrantedAuthority(
                            "ROLE_" + usuario.getRol()
                    );

                    var autenticacion =
                            new UsernamePasswordAuthenticationToken(
                                    usuario.getCorreo(),
                                    null,
                                    List.of(autoridad)
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(autenticacion);
                }

            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
