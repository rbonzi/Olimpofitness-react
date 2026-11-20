package com.olimpo.reservas;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ControladorReservas {
    private final JdbcTemplate db;
    private final RestClient usuarios;

    public ControladorReservas(JdbcTemplate db, @Value("${usuarios.url}") String url) {
        this.db = db;
        this.usuarios = RestClient.create(url);
    }

    record Perfil(long id, String rol) {}

    private Perfil identificar(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Inicia sesión.");
        }
        try {
            return usuarios.get().uri("/api/usuarios/me").header("Authorization", token)
                    .retrieve().body(Perfil.class);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vuelve a iniciar sesión.");
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Usuarios no está disponible.");
        }
    }

    @GetMapping("/clases")
    public List<Map<String,Object>> clases() {
        return db.queryForList("""
            SELECT c.id, c.nombre, c.capacidad - COUNT(r.usuario_id) AS disponibles
            FROM clase c LEFT JOIN reserva r ON r.clase_id = c.id
            GROUP BY c.id, c.nombre, c.capacidad ORDER BY c.id
            """);
    }

    @GetMapping("/mis")
    public List<Map<String,Object>> misReservas(@RequestHeader(value="Authorization", required=false) String token) {
        return db.queryForList("""
            SELECT c.nombre AS clase, r.fecha AS fechaReserva FROM reserva r
            JOIN clase c ON c.id = r.clase_id WHERE r.usuario_id = ? ORDER BY r.fecha DESC, c.id
            """, identificar(token).id());
    }

    @PostMapping("/clases/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void reservar(@PathVariable int id, @RequestHeader(value="Authorization", required=false) String token) {
        Perfil socio = identificar(token);
        if ("admin".equalsIgnoreCase(socio.rol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El administrador no reserva clases.");
        }
        // Atender una reserva a la vez para el mismo horario.
        var capacidades = db.queryForList("SELECT capacidad FROM clase WHERE id = ? FOR UPDATE", Integer.class, id);
        if (capacidades.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Clase inexistente.");
        }
        int ocupados = db.queryForObject("SELECT COUNT(*) FROM reserva WHERE clase_id = ?", Integer.class, id);
        if (ocupados >= capacidades.get(0)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Se agotaron los cupos.");
        }
        try {
            db.update("INSERT INTO reserva VALUES (?, ?, CURRENT_DATE)", socio.id(), id);
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya reservaste esta clase.");
        }
    }
}
