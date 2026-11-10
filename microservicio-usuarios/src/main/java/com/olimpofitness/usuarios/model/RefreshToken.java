package com.olimpofitness.usuarios.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Instant expiracion;

    @Column(nullable = false)
    private boolean revocado = false;

    public RefreshToken() {
    }

    public Long getId() {
        return id;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Instant getExpiracion() {
        return expiracion;
    }

    public void setExpiracion(Instant expiracion) {
        this.expiracion = expiracion;
    }

    public boolean isRevocado() {
        return revocado;
    }

    public void setRevocado(boolean revocado) {
        this.revocado = revocado;
    }
}
