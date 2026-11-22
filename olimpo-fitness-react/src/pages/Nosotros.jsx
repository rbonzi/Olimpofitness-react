import React from 'react';

export default function Nosotros() {
  return (
    <div>
      {/* Sección Historia */}
      <section className="seccion-nosotros">
        <div className="franja">
          <h1 className="titulo-principal">OLIMPO FITNESS</h1>
        </div>

        <h2 className="titulo-nosotros">¿Cómo nace Olimpo Fitness?</h2>

        <p className="texto-nosotros">
          Olimpo Fitness surge con una visión centrada en el usuario: espacios que se adaptan a las necesidades reales de cada comunidad, con un fuerte enfoque en bienestar integral, vida activa, accesibilidad horaria y atención humana y cercana.
        </p>

        <p className="texto-nosotros">
          A diferencia de otros gimnasios, Olimpo Fitness apuesta por una experiencia flexible, inclusiva y cercana a la comunidad. Desde nuestro lanzamiento, hemos mantenido un crecimiento sostenido gracias a una propuesta enfocada en la calidad y el servicio.
        </p>

        <p className="texto-nosotros">
          Con instalaciones equipadas, clases dirigidas y beneficios exclusivos, Olimpo Fitness no solo ofrece un lugar para entrenar: eleva el estilo de vida de cada socio y lleva su entrenamiento al siguiente nivel.
        </p>
      </section>

      {/* Sección Misión y Visión */}
      <section className="seccion-mision-vision">
        <h2 className="titulo-vm">¿Cuál es nuestra visión?</h2>
        <p className="texto-vm">
          En Olimpo Fitness, nos convertimos en la cadena de gimnasios líder en Chile en experiencia, innovación e inclusión, siendo reconocidos por elevar el estándar del entrenamiento personalizado, accesible y centrado en las personas.
        </p>
        <p className="texto-vm">
          Queremos ser la primera opción para quienes buscan un gimnasio que se adapte a su vida real: espacios conectados con su entorno, abiertos a todas las personas y comprometidos con el bienestar físico, mental y social. Nuestro objetivo es expandir una red de gimnasios donde cada persona, sin importar su punto de partida, encuentre las condiciones para comenzar, mantenerse y avanzar en su estilo de vida activo.
        </p>

        <h2 className="titulo-vm">¿Cuál es nuestra misión?</h2>
        <p className="texto-vm">
          En Olimpo Fitness, nuestra misión es transformar la forma en que las personas viven el entrenamiento, ofreciendo espacios inclusivos, accesibles y adaptados a las necesidades reales de cada comunidad. Promovemos el bienestar integral a través de una experiencia fitness moderna, cercana, con atención personalizada, horarios flexibles y tecnología al servicio del usuario.
        </p>
        <p className="texto-vm">
          Creemos que todos pueden entrenar, sin importar su edad, condición física o nivel de experiencia. Por eso, diseñamos un entorno donde todas las personas son bienvenidas, acompañadas desde el primer paso, con el objetivo de construir una comunidad activa, diversa y motivada, donde cada persona pueda llevar su estilo de vida al siguiente nivel.
        </p>
      </section>

      {/* Banner Instagram */}
      <section className="banner-instagram">
        <a 
          href="https://www.instagram.com/olimp.ofitness?igsi=YWFha2hhNXBubDRo" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="link-instagram"
        >
          <img 
            src="/Imagenes/Logo ig.png" 
            alt="Instagram Olimpo Fitness" 
            className="icono-instagram" 
          />

          <div className="contenedor-texto-ig">
            <h3 className="titulo-ig">SÍGUENOS EN INSTAGRAM</h3>
            <span className="usuario-ig">@OLIMP.OFITNESS</span>
          </div>
        </a>
      </section>
    </div>
  );
}