import React from 'react';
import { Link } from 'react-router-dom';

export default function Faq() {
  return (
    <div>
      <h1 className="titulo-pagina">OLIMPO FITNESS</h1>
      <h1 className="sub-titulo">PREGUNTAS FRECUENTES</h1>

      <div className="contenedor-faq">
        {/* Pregunta 1 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">1.- ¿A qué hora están abiertos nuestros gimnasios?</h3>
          <p className="texto-respuesta">
            Lunes a Viernes de 6:00 am. a 11:00 pm.
            <br />
            Sábados, Domingos y Festivos de 9:00am a 6:00pm
          </p>
        </div>

        {/* Pregunta 2 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">2.- ¿Qué cosas incluye mi plan?</h3>
          <p className="texto-respuesta">
            Todos nuestros planes incluyen acceso multisede Y acceso gratis a todas nuestras clases.
            <br />
            <Link to="/planes" style={{ color: '#e9c009', fontWeight: 'bold' }}>
              REVISA TODOS LOS BENEFICIOS EN PLANES
            </Link>
          </p>
        </div>

        {/* Pregunta 3 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">3.- ¿Tienen entrenadores en sala que me enseñen a usar las máquinas?</h3>
          <p className="texto-respuesta">
            Sí, disponemos de instructores de planta que te orientarán sobre el uso correcto del equipamiento y te asignarán una rutina básica.
          </p>
        </div>

        {/* Pregunta 4 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">4.- ¿Cómo me inscribo a las clases grupales (Spinning, Yoga, Zumba)?</h3>
          <p className="texto-respuesta">
            Puedes reservar tu cupo desde nuestra página web o directamente en la recepción hasta 24 horas antes de la clase.
          </p>
        </div>

        {/* Pregunta 5 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">5.- ¿A partir de qué edad se puede ingresar al gimnasio?</h3>
          <p className="texto-respuesta">
            El ingreso está permitido a partir de los 14 años, requiriendo una autorización firmada por sus padres o tutores legales para menores de 18.
          </p>
        </div>

        {/* Pregunta 6 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">6.- ¿Cuáles son las formas de pago aceptadas?</h3>
          <p className="texto-respuesta">
            Aceptamos tarjetas de débito, crédito, transferencias bancarias y pago en efectivo directamente en la recepción.
          </p>
        </div>

        {/* Pregunta 7 */}
        <div className="faq-item">
          <h3 className="subsubtitulo">7.- ¿Qué pasa si olvido o pierdo alguna pertenencia en el gimnasio?</h3>
          <p className="texto-respuesta">
            Todos los objetos encontrados se guardan en Recepción. Puedes consultar directamente con el personal para recuperarlos presentando una descripción del artículo.
          </p>
        </div>
      </div>
    </div>
  );
}