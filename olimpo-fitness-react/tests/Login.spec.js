import React from "react";

import {
  render,
  screen,
  fireEvent,
  cleanup
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import Login from "../src/pages/Login";

describe("Pruebas unitarias - Login Olimpo Fitness", () => {

    beforeEach(() => {
    localStorage.clear();

    spyOn(Swal, "fire").and.returnValue(
        new Promise(() => {})
    );
    });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  // PRUEBA 1
  it("Debe mostrar el formulario de inicio de sesión", () => {

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByText("INICIAR SESIÓN", {
        selector: "h2"
      })
    ).toBeTruthy();

  });

  // PRUEBA 2
  it("Debe tener campos obligatorios", () => {

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const correo = screen.getByPlaceholderText(
      "Ingrese su correo"
    );

    const clave = screen.getByPlaceholderText(
      "Ingrese su contraseña"
    );

    expect(correo.required).toBeTrue();
    expect(clave.required).toBeTrue();

  });

  // PRUEBA 3
  it("Debe permitir ingresar correo y contraseña", () => {

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const correo = screen.getByPlaceholderText(
      "Ingrese su correo"
    );

    const clave = screen.getByPlaceholderText(
      "Ingrese su contraseña"
    );

    fireEvent.change(correo, {
      target: { value: "usuario@correo.cl" }
    });

    fireEvent.change(clave, {
      target: { value: "clave123" }
    });

    expect(correo.value).toBe("usuario@correo.cl");
    expect(clave.value).toBe("clave123");

  });

  // PRUEBA 4
  it("Debe mostrar un error con credenciales incorrectas", () => {

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su correo"),
      {
        target: { value: "incorrecto@correo.cl" }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su contraseña"),
      {
        target: { value: "claveincorrecta" }
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "INICIAR SESIÓN"
      })
    );

    expect(Swal.fire).toHaveBeenCalled();

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: "Error de Autenticación",
        icon: "error"
      })
    );

    expect(localStorage.getItem("sesionOlimpo"))
      .toBeNull();

  });

    it("Debe iniciar sesión correctamente como administrador", () => {

    render(
        <MemoryRouter>
        <Login />
        </MemoryRouter>
    );

    // Ingresar correo del administrador
    fireEvent.change(
        screen.getByPlaceholderText("Ingrese su correo"),
        {
        target: { value: "admin@olimpo.cl" }
        }
    );

    // Ingresar contraseña del administrador
    fireEvent.change(
        screen.getByPlaceholderText("Ingrese su contraseña"),
        {
        target: { value: "admin123" }
        }
    );

    // Presionar el botón de inicio de sesión
    fireEvent.click(
        screen.getByRole("button", {
        name: "INICIAR SESIÓN"
        })
    );

    // Comprobar que la sesión quedó activa
    expect(localStorage.getItem("sesionOlimpo"))
        .toBe("true");

    // Recuperar los datos almacenados
    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogueado")
    );

    // Verificar los datos del administrador
    expect(usuario.nombre)
        .toBe("Administrador Principal");

    expect(usuario.correo)
        .toBe("admin@olimpo.cl");

    expect(usuario.rol)
        .toBe("admin");

    // Verificar el mensaje de bienvenida
    expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
        title: "¡Bienvenido, Administrador!",
        icon: "success"
        })
    );

    });
    // PRUEBA 6
    it("Debe iniciar sesión correctamente con un usuario registrado", () => {

    // Crear un unsuario de prueba
    const usuarioRegistrado = {
        nombre: "Juan Pérez",
        correo: "juan@correo.cl",
        clave: "clave123",
        rol: "usuario",
        plan: "Mensual"
    };

    // Simular que el usuario está registrado
    localStorage.setItem(
        "baseDatosOlimpo",
        JSON.stringify([usuarioRegistrado])
    );

    // Renderizar el Login
    render(
        <MemoryRouter>
        <Login />
        </MemoryRouter>
    );

    // Ingresar correo
    fireEvent.change(
        screen.getByPlaceholderText("Ingrese su correo"),
        {
        target: { value: "juan@correo.cl" }
        }
    );

    // Ingresar contraseña
    fireEvent.change(
        screen.getByPlaceholderText("Ingrese su contraseña"),
        {
        target: { value: "clave123" }
        }
    );

    // Presionar el botón
    fireEvent.click(
        screen.getByRole("button", {
        name: "INICIAR SESIÓN"
        })
    );

    // Verificar que la sesión esté activa
    expect(
        localStorage.getItem("sesionOlimpo")
    ).toBe("true");

    // Obtener los datos del usuario
    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogueado")
    );

    // Verificar que se guardó el usuario correcto
    expect(usuario.nombre).toBe("Juan Pérez");

    expect(usuario.correo).toBe("juan@correo.cl");

    expect(usuario.rol).toBe("usuario");

    expect(usuario.plan).toBe("Mensual");

    // Verificar el mensaje de bienvenida
    expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
        title: "¡Bienvenido/a, Juan Pérez!",
        icon: "success"
        })
    );

    });

});