
package com.olimpofitness.usuarios.controller;

import com.olimpofitness.usuarios.dto.LoginRequest;
import com.olimpofitness.usuarios.dto.LoginResponse;
import com.olimpofitness.usuarios.dto.RegistroRequest;
import com.olimpofitness.usuarios.dto.UsuarioResponse;
import com.olimpofitness.usuarios.model.Usuario;
import com.olimpofitness.usuarios.repository.UsuarioRepository;
import com.olimpofitness.usuarios.service.JwtService;
import com.olimpofitness.usuarios.service.UsuarioService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import com.olimpofitness.usuarios.dto.ActualizarUsuarioRequest;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

import jakarta.validation.Valid;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public UsuarioController(
            UsuarioService usuarioService,
            UsuarioRepository usuarioRepository,
            JwtService jwtService) {

        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @SecurityRequirements
    @Operation(
        summary = "Registrar un nuevo usuario",
        description = "Registra un usuario con rol CLIENTE y protege su contraseña mediante BCrypt."
    )
    
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Usuario registrado correctamente",
            content = @Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"mensaje\":\"Usuario registrado correctamente\"}"
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de registro inválidos",
            content = @Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"error\":\"La contraseña debe tener al menos 6 caracteres\"}"
                )
            )
        ),
        @ApiResponse(
            responseCode = "409",
            description = "El correo ya está registrado",
            content = @Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"error\":\"El correo ya está registrado\"}"
                )
            )
        )
    })

    @PostMapping("/registro")
    public ResponseEntity<Map<String, String>> registrar(
            @Valid @RequestBody RegistroRequest request) {

        usuarioService.registrarUsuario(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "mensaje", "Usuario registrado correctamente"
                ));
    }

    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        UsuarioResponse usuarioValidado;

        try {
            usuarioValidado = usuarioService.autenticarUsuario(request);
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Correo o contraseña incorrectos"
            );
        }

        Usuario usuario = usuarioRepository
                .findByCorreo(usuarioValidado.correo())
                .orElseThrow();

        String token = jwtService.generarToken(usuario);

        LoginResponse respuesta = new LoginResponse(
                token,
                "Bearer",
                usuarioValidado
        );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/me")
    public ResponseEntity<?> obtenerMiPerfil(
            Authentication authentication) {

        String correo = authentication.getName();

        return usuarioService.buscarPorCorreo(correo)
                .map(usuario -> ResponseEntity.ok(
                        UsuarioResponse.desdeEntidad(usuario)
                ))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {

        return ResponseEntity.ok(
                usuarioService.listarUsuariosSeguros()
        );
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<UsuarioResponse> obtenerUsuario(
            @PathVariable Long id) {

        return usuarioService.buscarUsuarioSeguro(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarUsuarioRequest request) {

        UsuarioResponse actualizado =
                usuarioService.actualizarUsuario(id, request);

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> eliminarUsuario(
            @PathVariable Long id) {

        usuarioService.eliminarUsuario(id);

        return ResponseEntity.noContent().build();
    }

}
