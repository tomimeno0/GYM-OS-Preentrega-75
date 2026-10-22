export default function Confirmar({ texto, onAceptar, onCancelar }) {
  function teclado(e) {
    if (e.key === "Escape") {
      onCancelar();
    }
    if (e.key === "Tab") {
      const botones = e.currentTarget.querySelectorAll("button");
      if (e.shiftKey && document.activeElement === botones[0]) {
        e.preventDefault();
        botones[1].focus();
      } else if (!e.shiftKey && document.activeElement === botones[1]) {
        e.preventDefault();
        botones[0].focus();
      }
    }
  }
  return (
    <div className="fondo-confirmacion">
      <section
        className="tarjeta confirmacion"
        role="alertdialog"
        onKeyDown={teclado}
        aria-modal="true"
        aria-labelledby="titulo-confirmacion"
        aria-describedby="texto-confirmacion"
      >
        <h2 id="titulo-confirmacion">Confirmar acción</h2>
        <p id="texto-confirmacion">{texto}</p>
        <div className="acciones">
          <button
            type="button"
            autoFocus
            className="secundario"
            onClick={onCancelar}
          >
            Volver sin cambios
          </button>
          <button type="button" onClick={onAceptar}>
            Sí, confirmar
          </button>
        </div>
      </section>
    </div>
  );
}
