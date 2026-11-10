
package com.olimpofitness.usuarios.service;

import com.olimpofitness.usuarios.dto.RegistroRequest;
import com.olimpofitness.usuarios.dto.UsuarioResponse;
import com.olimpofitness.usuarios.model.Usuario;
import com.olimpofitness.usuarios.repository.UsuarioRepository;
import com.olimpofitness.usuarios.dto.ActualizarUsuarioRequest;
import com.olimpofitness.usuarios.dto.LoginRequest;
import org.springframework.security.authentication.BadCredentialsException;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    public void registrarUsuario(RegistroRequest request) {

        String correo = request.correo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException(
                "El correo ya está registrado"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.nombre().trim());
        usuario.setCorreo(correo);

        usuario.setContrasena(
            passwordEncoder.encode(request.contrasena())
        );

        usuario.setRol("CLIENTE");

        usuarioRepository.save(usuario);
    }

    public List<UsuarioResponse> listarUsuariosSeguros() {

        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponse::desdeEntidad)
                .toList();
    }

    public Optional<UsuarioResponse> buscarUsuarioSeguro(Long id) {

        return usuarioRepository.findById(id)
                .map(UsuarioResponse::desdeEntidad);
    }

    public UsuarioResponse actualizarUsuario(
            Long id,
            ActualizarUsuarioRequest request) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El usuario no existe"
                ));

        String correo = request.correo().trim().toLowerCase();

        if (!usuario.getCorreo().equals(correo)
                && usuarioRepository.existsByCorreo(correo)) {

            throw new IllegalArgumentException(
                    "El correo ya está registrado"
            );
        }

        usuario.setNombre(request.nombre().trim());
        usuario.setCorreo(correo);

        Usuario actualizado = usuarioRepository.save(usuario);

        return UsuarioResponse.desdeEntidad(actualizado);
    }

    public void eliminarUsuario(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El usuario no existe"
                ));

        usuarioRepository.delete(usuario);
    }

    public UsuarioResponse autenticarUsuario(LoginRequest request) {

        String correo = request.correo().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new BadCredentialsException(
                        "Correo o contraseña incorrectos"
                ));

        if (!passwordEncoder.matches(
                request.contrasena(),
                usuario.getContrasena())) {

            throw new BadCredentialsException(
                    "Correo o contraseña incorrectos"
            );
        }

        return UsuarioResponse.desdeEntidad(usuario);
    }

}
