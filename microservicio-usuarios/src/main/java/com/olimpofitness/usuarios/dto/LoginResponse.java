package com.olimpofitness.usuarios.dto;

public record LoginResponse(
    String token,
    String tipo,
    UsuarioResponse usuario
) {}
