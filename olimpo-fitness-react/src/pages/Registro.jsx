
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../services/usuariosApi';

export default function Registro() {
  const navigate = useNavigate();

  // Estados del formulario
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [clave1, setClave1] = useState('');
  const [clave2, setClave2] = useState('');

  // Estados de respuesta
  const [mensaje, setMensaje] = useState('');
  const [esExito, setEsExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleRegistrarCuenta = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setMensaje('');
    setEsExito(false);

    // Validar contraseñas
    if (clave1 !== clave2) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    if (clave1.length < 6) {
      setMensaje(
        'La contraseña debe tener al menos 6 caracteres.'
      );
      return;
    }

    setCargando(true);

    try {
      // Enviar datos a Spring Boot
      const respuesta = await usuariosApi.registrar(
        nombre.trim(),
        correo.trim(),
        clave1
      );

      // Registro exitoso
      setEsExito(true);
      setMensaje(
        respuesta?.mensaje ||
        '¡Cuenta creada correctamente! Redirigiendo...'
      );

      // Redirigir a Login
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      setEsExito(false);
      setMensaje(
        error.message ||
        'No se pudo registrar el usuario.'
      );

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor-login">
      <div className="cuadro-login">
        <h2>REGISTRAR CUENTA</h2>

        <form onSubmit={handleRegistrarCuenta}>
          <input
            type="email"
            className="campo-texto"
            placeholder="Ingrese su correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="text"
            className="campo-texto"
            placeholder="Ingrese su nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Ingrese su contraseña"
            value={clave1}
            onChange={(e) => setClave1(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Confirme su contraseña"
            value={clave2}
            onChange={(e) => setClave2(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <button
            type="submit"
            className="boton-entrar"
            disabled={cargando}
          >
            {cargando
              ? 'REGISTRANDO...'
              : 'CREAR CUENTA'}
          </button>

          {mensaje && (
            <p
              className="texto-registro"
              style={{
                color: esExito ? '#129b3a' : '#ff4d4d',
                marginTop: '10px',
                fontWeight: 'bold',
              }}
            >
              {mensaje}
            </p>
          )}

          <p className="texto-registro">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="btn-crear">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
