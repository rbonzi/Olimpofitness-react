import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <div className="contenedor-imagen">
        <img 
          src="/Imagenes/ImagenPortada.jpeg" 
          alt="Portada Gimnasio Olimpo Fitness" 
          className="imagen-fondo" 
        />
        <div className="centralizador">
          <h1 className="titulo-pagina">OLIMPO FITNESS</h1>
          <h1 className="sub-titulo">CONOCE MÁS SOBRE NOSOTROS</h1>
          <Link to="/planes" className="boton-img">
            CONOCE NUESTROS PLANES
          </Link>
        </div>
      </div>
    </div>
  );
}