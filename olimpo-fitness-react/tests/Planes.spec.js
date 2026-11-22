
import React from "react";

import {
  render,
  screen,
  fireEvent,
  cleanup,
  within
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import Planes from "../src/pages/Planes";

describe("Pruebas unitarias - Planes Olimpo Fitness", () => {

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  // Renderizar el componente con rutas de prueba
  const mostrarPlanes = () => {
    render(
      <MemoryRouter initialEntries={["/planes"]}>
        <Routes>
          <Route path="/planes" element={<Planes />} />
          <Route
            path="/login"
            element={<h1>Página de Login</h1>}
          />
          <Route
            path="/checkout"
            element={<h1>Página de Checkout</h1>}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  // Obtener la tarjeta de un plan
  const obtenerTarjeta = (nombrePlan) => {
    const titulo = screen.getByText(nombrePlan);
    return titulo.closest(".tarjeta-plan");
  };

  // Simular un usuario autenticado
  const iniciarSesion = (nombre = "Juan Pérez") => {
    localStorage.setItem("sesionOlimpo", "true");

    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify({ nombre })
    );
  };

  // PRUEBA 1
  it("Debe mostrar el título de la página", () => {
    mostrarPlanes();

    expect(
      screen.getByRole("heading", {
        name: "PLANES OLIMPO"
      })
    ).toBeTruthy();
  });

  // PRUEBA 2
  it("Debe mostrar los cinco planes disponibles", () => {
    mostrarPlanes();

    const planes = [
      "CLASE SOLA",
      "PLAN MENSUAL",
      "PLAN TRIMESTRAL",
      "PLAN SEMESTRAL",
      "PLAN ANUAL"
    ];

    planes.forEach((plan) => {
      expect(
        screen.getByRole("heading", {
          name: plan
        })
      ).toBeTruthy();
    });
  });

  // PRUEBA 3
  it("Debe mostrar correctamente los precios", () => {
    mostrarPlanes();

    const precios = [
      "$5.000",
      "$29.990",
      "$75.000",
      "$138.000",
      "$240.000"
    ];

    const elementosPrecio = document.querySelectorAll(
      ".precio-plan"
    );

    expect(elementosPrecio.length).toBe(5);

    precios.forEach((precio, indice) => {
      expect(
        elementosPrecio[indice].textContent
      ).toContain(precio);
    });
  });

  // PRUEBA 4
  it("Debe mostrar cinco botones para elegir planes", () => {
    mostrarPlanes();

    const botones = screen.getAllByRole("button", {
      name: "ELEGIR PLAN"
    });

    expect(botones.length).toBe(5);
  });

  // PRUEBA 5
  it("Debe enviar al Login si no hay sesión activa", () => {
    mostrarPlanes();

    const tarjeta = obtenerTarjeta("PLAN MENSUAL");

    fireEvent.click(
      within(tarjeta).getByRole("button", {
        name: "ELEGIR PLAN"
      })
    );

    expect(
      screen.getByText("Página de Login")
    ).toBeTruthy();

    expect(
      localStorage.getItem("posibleCompra")
    ).toBeNull();
  });

  // PRUEBA 6
  it("Debe guardar la compra del plan mensual", () => {
    iniciarSesion();
    mostrarPlanes();

    const tarjeta = obtenerTarjeta("PLAN MENSUAL");

    fireEvent.click(
      within(tarjeta).getByRole("button", {
        name: "ELEGIR PLAN"
      })
    );

    const compra = JSON.parse(
      localStorage.getItem("posibleCompra")
    );

    expect(compra.nombrePlan).toBe("plan-mensual");
    expect(compra.beneficiario).toBe("Juan Pérez");
    expect(compra.precio).toBe(29990);

    expect(
      screen.getByText("Página de Checkout")
    ).toBeTruthy();
  });

  // PRUEBA 7
  it("Debe guardar correctamente el plan anual", () => {
    iniciarSesion();
    mostrarPlanes();

    const tarjeta = obtenerTarjeta("PLAN ANUAL");

    fireEvent.click(
      within(tarjeta).getByRole("button", {
        name: "ELEGIR PLAN"
      })
    );

    const compra = JSON.parse(
      localStorage.getItem("posibleCompra")
    );

    expect(compra.nombrePlan).toBe("plan-anual");
    expect(compra.precio).toBe(240000);

    expect(
      screen.getByText("Página de Checkout")
    ).toBeTruthy();
  });

  // PRUEBA 8
  it("Debe usar beneficiario predeterminado sin nombre", () => {
    iniciarSesion("");
    mostrarPlanes();

    const tarjeta = obtenerTarjeta("CLASE SOLA");

    fireEvent.click(
      within(tarjeta).getByRole("button", {
        name: "ELEGIR PLAN"
      })
    );

    const compra = JSON.parse(
      localStorage.getItem("posibleCompra")
    );

    expect(compra.beneficiario)
      .toBe("Usuario Olimpo");

    expect(compra.nombrePlan)
      .toBe("plan-diario");

    expect(compra.precio)
      .toBe(5000);
  });

});
