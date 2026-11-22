package com.olimpofitness.usuarios.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        String esquema = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("OlimpoFitness - API de Usuarios")
                        .version("1.0")
                        .description(
                            "Microservicio de usuarios de OlimpoFitness. " +
                            "Incluye registro, autenticacion JWT y CRUD administrativo."
                        )
                )
                .components(new Components()
                        .addSecuritySchemes(
                                esquema,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                )
                .addSecurityItem(
                        new SecurityRequirement().addList(esquema)
                );
    }
}
