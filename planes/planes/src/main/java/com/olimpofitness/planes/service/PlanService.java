package com.olimpofitness.planes.service;

import com.olimpofitness.planes.model.Plan;
import com.olimpofitness.planes.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    private final PlanRepository repository;

    public PlanService(PlanRepository repository) {
        this.repository = repository;
    }

    public List<Plan> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<Plan> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public Plan guardarPlan(Plan plan) {
        return repository.save(plan);
    }

    public void eliminarPlan(Long id) {
        repository.deleteById(id);
    }
}