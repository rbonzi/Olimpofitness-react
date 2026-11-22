
import React from "react";

import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import Swal from "sweetalert2";
import Checkout from "../src/pages/Checkout";

describe("Pruebas unitarias - Checkout Olimpo Fitness", () => {

  const compraEjemplo = {
    nombrePlan: "plan-mensual",
    beneficiario: "Juan Pérez",
    precio: 29990
  };

  const usuarioEjemplo = {
    nombre: "Juan Pérez",
    correo: "juan@correo.cl",
    clave: "clave123",
    plan: "Sin Plan Activo"
  };

  beforeEach(() => {
    localStorage.clear();

    // Evita ventanas reales de SweetAlert2
    spyOn(Swal, "fire").and.returnValue(
      new Promise(() => {})
    );
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  // Simular una compra seleccionada
  const prepararCompra = () => {
    localStorage.setItem(
      "posibleCompra",
      JSON.stringify(compraEjemplo)
    );
  };

  // Simular usuario registrado y autenticado
    const prepararUsuario = () => {

    const usuario = {
        nombre: "Juan Pérez",
        correo: "juan@correo.cl",
        clave: "clave123",
        plan: "Sin Plan Activo"
    };

    localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(usuario)
    );

    localStorage.setItem(
        "baseDatosOlimpo",
        JSON.stringify([{ ...usuario }])
    );
    };

  // Renderizar el Checkout con rutas simuladas
  const mostrarCheckout = () => {
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/planes"
            element={<h1>Página de Planes</h1>}
          />
          <Route
            path="/perfil"
            element={<h1>Página de Perfil</h1>}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  // PRUEBA 1
  it("Debe mostrar el título de Checkout", () => {
    mostrarCheckout();

    expect(
      screen.getByRole("heading", {
        name: "CONFIRMAR PAGO"
      })
    ).toBeTruthy();
  });

  // PRUEBA 2
  it("Debe mostrar mensaje si no hay un plan seleccionado", () => {
    mostrarCheckout();

    expect(
      screen.getByText(
        "No hay ningún plan seleccionado para procesar."
      )
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: "VER PLANES"
      })
    ).toBeTruthy();
  });

  // PRUEBA 3
  it("Debe regresar a Planes cuando no hay compra", () => {
    mostrarCheckout();

    fireEvent.click(
      screen.getByRole("button", {
        name: "VER PLANES"
      })
    );

    expect(
      screen.getByText("Página de Planes")
    ).toBeTruthy();
  });

  // PRUEBA 4
  it("Debe mostrar los detalles de la compra", async () => {
    prepararCompra();
    mostrarCheckout();

    expect(
      await screen.findByText("Juan Pérez")
    ).toBeTruthy();

    expect(
      screen.getByText("plan mensual")
    ).toBeTruthy();

    expect(
      screen.getByText("$29990")
    ).toBeTruthy();
  });

  // PRUEBA 5
  it("Debe mostrar la confirmación al proceder al pago", async () => {
    prepararCompra();
    mostrarCheckout();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "PROCEDER AL PAGO"
      })
    );

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: "¡Pago Exitoso!",
        icon: "success"
      })
    );
  });

  // PRUEBA 6
  it("Debe actualizar el plan cuando el pago se confirma", async () => {
    prepararCompra();
    prepararUsuario();

    Swal.fire.and.returnValue(
      Promise.resolve({ isConfirmed: true })
    );

    mostrarCheckout();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "PROCEDER AL PAGO"
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Página de Perfil")
      ).toBeTruthy();
    });

    const usuario = JSON.parse(
      localStorage.getItem("usuarioLogueado")
    );

    expect(usuario.plan).toBe("plan mensual");

    expect(
      localStorage.getItem("posibleCompra")
    ).toBeNull();
  });

  // PRUEBA 7
  // PRUEBA 7
    it("Debe actualizar el plan en la base de datos", async () => {

    prepararCompra();
    prepararUsuario();

    Swal.fire.and.returnValue(
        Promise.resolve({ isConfirmed: true })
    );

    mostrarCheckout();

    // Presionar el botón de pago
    fireEvent.click(
        await screen.findByRole("button", {
        name: "PROCEDER AL PAGO"
        })
    );

    // Esperar a que se complete la confirmación
    await screen.findByText("Página de Perfil");

    // Recuperar usuarios guardados
    const usuarios = JSON.parse(
        localStorage.getItem("baseDatosOlimpo")
    );

    // Validar que existe el usuario
    expect(usuarios.length).toBe(1);

    expect(usuarios[0].correo)
        .toBe("juan@correo.cl");

    // Validar que el plan fue actualizado
    expect(usuarios[0].plan)
        .toBe("plan mensual");

    });

  // PRUEBA 8
  it("Debe permitir reintentar cuando no se confirma el pago", async () => {
    prepararCompra();
    mostrarCheckout();

    Swal.fire.and.returnValue(
      Promise.resolve({ isConfirmed: false })
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: "PROCEDER AL PAGO"
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "PROCEDER AL PAGO"
        }).disabled
      ).toBeFalse();
    });

    expect(
      localStorage.getItem("posibleCompra")
    ).not.toBeNull();
  });

});
