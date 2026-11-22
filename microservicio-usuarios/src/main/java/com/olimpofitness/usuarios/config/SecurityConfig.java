package com.olimpofitness.usuarios.config;

import com.olimpofitness.usuarios.repository.UsuarioRepository;
import com.olimpofitness.usuarios.security.JwtAuthenticationFilter;
import com.olimpofitness.usuarios.service.JwtService;

import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService,
            UsuarioRepository usuarioRepository) throws Exception {

        JwtAuthenticationFilter jwtFilter =
                new JwtAuthenticationFilter(
                        jwtService,
                        usuarioRepository
                );

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            
            .authorizeHttpRequests(auth -> auth

                // Permitir acceso a la documentacion Swagger
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/v3/api-docs"
                ).permitAll()

                .dispatcherTypeMatchers(
                    DispatcherType.ERROR
                ).permitAll()

                // Registro y login publicos
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/usuarios/registro",
                    "/api/usuarios/login"
                ).permitAll()

                // Perfil del usuario autenticado
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/usuarios/me"
                ).authenticated()

                // Operaciones administrativas
                .requestMatchers(
                    "/api/usuarios/admin",
                    "/api/usuarios/admin/**"
                ).hasRole("ADMIN")

                // Cualquier otra solicitud requiere autenticacion
                .anyRequest().authenticated()
            )


            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
