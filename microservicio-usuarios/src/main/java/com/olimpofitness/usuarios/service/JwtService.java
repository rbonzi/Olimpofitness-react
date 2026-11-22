package com.olimpofitness.usuarios.service;

import com.olimpofitness.usuarios.model.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey clave;

    public JwtService(@Value("${app.jwt.secret}") String secreto) {
        byte[] bytes = Decoders.BASE64.decode(secreto);
        this.clave = Keys.hmacShaKeyFor(bytes);
    }

    public String generarToken(Usuario usuario) {

        Date ahora = new Date();
        Date expiracion = new Date(
                ahora.getTime() + 3600000
        );

        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("rol", usuario.getRol())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(clave, Jwts.SIG.HS256)
                .compact();
    }

    public Claims validarToken(String token) {

        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
