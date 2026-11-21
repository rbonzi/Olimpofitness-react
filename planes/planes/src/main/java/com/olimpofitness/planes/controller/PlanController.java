package com.olimpofitness.planes.controller;

import com.olimpofitness.planes.model.Plan;
import com.olimpofitness.planes.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes")
@Tag(name = "Planes", description = "API para gestionar los planes del gimnasio")
public class PlanController {

    private final PlanService service;

    public PlanController(PlanService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los planes")
    public List<Plan> listar() {
        return service.obtenerTodos();
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo plan")
    public Plan crear(@RequestBody Plan plan) {
        return service.guardarPlan(plan);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un plan por su ID")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarPlan(id);
        return ResponseEntity.noContent().build();
    }
}