
import React from "react";

import {
  render,
  screen,
  fireEvent,
  cleanup
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import Registro from "../src/pages/Registro";

describe("Pruebas unitarias - Registro Olimpo Fitness", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  // Función auxiliar para renderizar el formulario
  const mostrarRegistro = () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );
  };

  // Función auxiliar para ingresar datos
  const completarFormulario = (
    correo = "juan@correo.cl",
    nombre = "Juan Pérez",
    clave = "clave123",
    confirmar = "clave123"
  ) => {
    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su correo"),
      { target: { value: correo } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su nombre completo"),
      { target: { value: nombre } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su contraseña"),
      { target: { value: clave } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirme su contraseña"),
      { target: { value: confirmar } }
    );
  };

  const enviarFormulario = () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "CREAR CUENTA"
      })
    );
  };

  // PRUEBA 1
  it("Debe mostrar el formulario de registro", () => {
    mostrarRegistro();

    expect(
      screen.getByText("REGISTRAR CUENTA")
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: "CREAR CUENTA"
      })
    ).toBeTruthy();
  });

  // PRUEBA 2
  it("Debe tener los cuatro campos obligatorios", () => {
    mostrarRegistro();

    const campos = [
      "Ingrese su correo",
      "Ingrese su nombre completo",
      "Ingrese su contraseña",
      "Confirme su contraseña"
    ];

    campos.forEach((placeholder) => {
      const campo = screen.getByPlaceholderText(placeholder);
      expect(campo.required).toBeTrue();
    });
  });

  // PRUEBA 3
  it("Debe permitir ingresar los datos del usuario", () => {
    mostrarRegistro();

    completarFormulario();

    expect(
      screen.getByPlaceholderText("Ingrese su correo").value
    ).toBe("juan@correo.cl");

    expect(
      screen.getByPlaceholderText("Ingrese su nombre completo").value
    ).toBe("Juan Pérez");

    expect(
      screen.getByPlaceholderText("Ingrese su contraseña").value
    ).toBe("clave123");
  });

  // PRUEBA 4
  it("Debe rechazar contraseñas diferentes", () => {
    mostrarRegistro();

    completarFormulario(
      "juan@correo.cl",
      "Juan Pérez",
      "clave123",
      "otraClave"
    );

    enviarFormulario();

    expect(
      screen.getByText("Las contraseñas no coinciden.")
    ).toBeTruthy();

    expect(
      localStorage.getItem("baseDatosOlimpo")
    ).toBeNull();
  });

  // PRUEBA 5
  it("Debe rechazar contraseñas menores a 6 caracteres", () => {
    mostrarRegistro();

    completarFormulario(
      "juan@correo.cl",
      "Juan Pérez",
      "123",
      "123"
    );

    enviarFormulario();

    expect(
      screen.getByText(
        "La contraseña debe tener al menos 6 caracteres."
      )
    ).toBeTruthy();

    expect(
      localStorage.getItem("baseDatosOlimpo")
    ).toBeNull();
  });

  // PRUEBA 6
  it("Debe impedir registrar un correo duplicado", () => {
    const usuarioExistente = {
      nombre: "Juan Pérez",
      correo: "juan@correo.cl",
      clave: "clave123",
      plan: "Sin Plan Activo"
    };

    localStorage.setItem(
      "baseDatosOlimpo",
      JSON.stringify([usuarioExistente])
    );

    mostrarRegistro();

    completarFormulario(
      "JUAN@CORREO.CL",
      "Otro Usuario",
      "clave456",
      "clave456"
    );

    enviarFormulario();

    expect(
      screen.getByText(
        "Este correo ya está registrado. Intenta iniciar sesión."
      )
    ).toBeTruthy();

    const usuarios = JSON.parse(
      localStorage.getItem("baseDatosOlimpo")
    );

    expect(usuarios.length).toBe(1);
  });

  // PRUEBA 7
  it("Debe registrar correctamente un usuario nuevo", () => {
    mostrarRegistro();

    completarFormulario();

    enviarFormulario();

    const usuarios = JSON.parse(
      localStorage.getItem("baseDatosOlimpo")
    );

    expect(usuarios.length).toBe(1);
    expect(usuarios[0].nombre).toBe("Juan Pérez");
    expect(usuarios[0].correo).toBe("juan@correo.cl");
    expect(usuarios[0].clave).toBe("clave123");
    expect(usuarios[0].plan).toBe("Sin Plan Activo");

    expect(
      screen.getByText(
        "¡Cuenta creada con éxito! Redirigiendo..."
      )
    ).toBeTruthy();
  });

});
