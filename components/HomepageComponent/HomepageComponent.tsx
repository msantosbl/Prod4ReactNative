import React from 'react';
import './HomepageComponent.css';

export const HomePageComponent = () => {

  // Método para desplazarse hacia abajo 1000px
  const scrollToPlayers = () => {
    window.scrollBy(0, 1000);
  };

  // Método para explorar el equipo (simulación de desplazamiento hacia abajo)
  const exploreTeam = () => {
    window.scrollBy(0, 1000);
  };

  return (
      <div className="hero-container" id="hero-section">
        {/* Logo del equipo */}
        <div className="logo">
          <img src="assets/logo.png" alt="Logo de Frontcraft BC" title="Frontcraft Basketball Club" />
        </div>

        {/* Texto principal */}
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Frontcraft BC</h1>
          <p className="hero-subtitle">Where Passion Meets Excellence on the Court</p>

          {/* Botón de llamada a la acción (Call to Action) */}
          <button className="hero-cta" onClick={exploreTeam}>Explore our Team</button>
        </div>

        {/* Flecha hacia abajo */}
        <div className="arrow" onClick={scrollToPlayers} title="Scroll Down">
          <img src="assets/flecha-abajo.png" alt="Scroll down to explore" />
        </div>

        {/* Redes sociales del equipo */}
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" title="Follow us on Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" title="Follow us on Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" title="Follow us on Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
  );
};

