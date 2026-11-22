package com.olimpofitness.planes.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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

    public String generateToken(String username) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + 3600000);

        return Jwts.builder()
                .setSubject(username)
                .claim("rol", "ADMIN")
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(clave, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validarToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(clave)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extraerCorreo(String token) {
        return validarToken(token).getSubject();
    }

    public String extraerRol(String token) {
        return validarToken(token).get("rol", String.class);
    }
}