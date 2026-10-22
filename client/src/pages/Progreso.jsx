import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
export default function Progreso({ usuario }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get("/progreso")
      .then((r) => setDatos(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "No se pudo cargar el resumen."),
      );
  }, []);
  return (
    <main>
      <p className="etiqueta">TU PRÓXIMO PASO</p>
      <h1>
        Hola, {usuario.nombre} <span className="acento">↗</span>
      </h1>
      <p className="muted">La constancia se construye de a un entrenamiento.</p>
      {error && (
        <p role="alert" className="aviso error">
          {error}
        </p>
      )}
      {!datos && !error && <p>Cargando tu resumen…</p>}
      {datos && (
        <>
          <div className="grilla tres">
            {[
              ["Entrenamientos completos", datos.entrenamientos_completados],
              ["Rutinas activas", datos.rutinas],
              ["Dietas activas", datos.dietas],
            ].map(([titulo, valor]) => (
              <div className="tarjeta estadistica" key={titulo}>
                <small>{titulo}</small>
                <strong>{valor}</strong>
              </div>
            ))}
          </div>
          <div className="grilla dos">
            <section className="tarjeta">
              <h2>Tu evolución</h2>
              {datos.mediciones.length ? (
                <div className="grafico">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={datos.mediciones.map((m) => ({
                        fecha: new Date(m.fecha_medicion).toLocaleDateString(
                          "es-AR",
                          { timeZone: usuario.zona_horaria },
                        ),
                        peso: m.peso_kg,
                      }))}
                    >
                      <CartesianGrid stroke="#30363e" />
                      <XAxis dataKey="fecha" stroke="#a5adb9" />
                      <YAxis domain={["auto", "auto"]} stroke="#a5adb9" />
                      <Tooltip
                        contentStyle={{
                          background: "#171c23",
                          border: "1px solid #414956",
                        }}
                      />
                      <Line
                        dataKey="peso"
                        name="Peso (kg)"
                        stroke="#cefa69"
                        strokeWidth={3}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="vacio">
                  <p>Tu primer registro es el punto de partida.</p>
                  <Link className="boton" to="/medidas">
                    Registrar medidas
                  </Link>
                </div>
              )}
            </section>
            <section className="tarjeta">
              <h2>Objetivos</h2>
              {datos.objetivos.length ? (
                datos.objetivos.map((o) => (
                  <article key={o.id} className="objetivo">
                    <span className="badge">{o.estado}</span>
                    <h3>{o.nombre}</h3>
                    <p>
                      {o.valor_actual ?? "Sin medición"} / {o.valor_objetivo}{" "}
                      {o.unidad}
                    </p>
                    <progress
                      value={o.porcentaje}
                      max="100"
                      aria-label={"Progreso de " + o.nombre}
                    />
                    <small>
                      {o.porcentaje}% del recorrido desde el valor inicial.
                      Marcar completado es una decisión manual.
                    </small>
                  </article>
                ))
              ) : (
                <div className="vacio">
                  <p>Elegí una meta concreta para orientar tu plan.</p>
                  <Link to="/objetivos">Definir objetivo ↗</Link>
                </div>
              )}
            </section>
          </div>
          <section className="tarjeta">
            <h2>Hacé lugar para tu siguiente paso.</h2>
            <div className="acciones">
              <Link className="boton" to="/entrenamientos">
                Registrar entrenamiento
              </Link>
              <Link className="boton secundario" to="/asistente">
                Consultar al asistente ✦
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
