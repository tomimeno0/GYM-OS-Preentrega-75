import Confirmar from "../components/Confirmar";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Entrenamientos() {
  const [items, setItems] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [rutina, setRutina] = useState("");
  const [dia, setDia] = useState(1);
  const [actual, setActual] = useState(null);
  const [aviso, setAviso] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  async function cargar() {
    try {
      const r = await axios.get("/entrenamientos");
      setItems(r.data.items);
      let iniciado = null;
      for (let i = 0; i < r.data.items.length; i++) {
        if (r.data.items[i].estado === "iniciado") {
          iniciado = r.data.items[i];
          break;
        }
      }
      if (iniciado) {
        setActual({
          id: iniciado.id,
          ejercicios: iniciado.ejercicios,
          distancia_km: iniciado.distancia_km || 0,
          observaciones: iniciado.observaciones || "",
        });
      } else {
        setActual(null);
      }
      const planes = await axios.get("/rutinas");
      const rutinasActivas = [];
      for (let i = 0; i < planes.data.items.length; i++) {
        if (planes.data.items[i].estado === "activa") {
          rutinasActivas.push(planes.data.items[i]);
        }
      }
      setRutinas(rutinasActivas);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudieron cargar los entrenamientos.");
      }
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function iniciar(e) {
    e.preventDefault();
    setOcupado(true);
    setAviso("");
    try {
      await axios.post("/entrenamientos", {
        rutina_id: rutina,
        dia_semana: dia,
      });
      await cargar();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo iniciar.");
      }
    } finally {
      setOcupado(false);
    }
  }
  async function guardar(estado, confirmado = false) {
    if (estado !== "iniciado" && !confirmado) {
      setConfirmacion(estado);
      return;
    }
    setConfirmacion(null);
    setOcupado(true);
    setAviso("");
    try {
      await axios.put("/entrenamientos/" + actual.id, {
        ejercicios: actual.ejercicios,
        distancia_km: actual.distancia_km,
        observaciones: actual.observaciones,
        estado,
        confirmar: estado !== "iniciado",
      });
      await cargar();
      setAviso("Entrenamiento guardado.");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo guardar.");
      }
    } finally {
      setOcupado(false);
    }
  }
  function cambiar(indice, campo, valor) {
    const ejercicios = actual.ejercicios.slice();
    const anterior = ejercicios[indice];
    const ejercicio = {
      id: anterior.id,
      realizado: anterior.realizado,
      nombre_ejercicio: anterior.nombre_ejercicio,
      series: anterior.series,
      repeticiones: anterior.repeticiones,
      peso_utilizado_kg: anterior.peso_utilizado_kg,
    };
    ejercicio[campo] = valor;
    ejercicios[indice] = ejercicio;
    setActual({
      id: actual.id,
      ejercicios,
      distancia_km: actual.distancia_km,
      observaciones: actual.observaciones,
    });
  }
  const entrenamientosAnteriores = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].estado !== "iniciado") {
      entrenamientosAnteriores.push(items[i]);
    }
  }
  return (
    <main>
      {confirmacion && (
        <Confirmar
          texto={
            "¿Cerrar el entrenamiento como " +
            confirmacion +
            "? Después no se puede editar."
          }
          onAceptar={() => guardar(confirmacion, true)}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
      <p className="etiqueta">CONVERTÍ EL PLAN EN ACCIÓN</p>
      <h1>Entrenamientos</h1>
      {aviso && (
        <p role="status" className="aviso">
          {aviso}
        </p>
      )}
      {actual ? (
        <section className="tarjeta">
          <span className="badge">EN CURSO</span>
          <h2>Tu sesión de hoy</h2>
          <p className="muted">
            Registrá lo que realmente hiciste, no solo lo planificado.
          </p>
          {actual.ejercicios.map((e, i) => (
            <fieldset key={e.id}>
              <legend>{e.nombre_ejercicio}</legend>
              <label className="check">
                <input
                  type="checkbox"
                  checked={e.realizado}
                  onChange={(v) => cambiar(i, "realizado", v.target.checked)}
                />
                Realizado
              </label>
              <div className="grilla tres">
                {[
                  ["series", "Series", 20],
                  ["repeticiones", "Repeticiones", 200],
                  ["peso_utilizado_kg", "Peso (kg)", 600],
                ].map(([campo, titulo, max]) => (
                  <label key={campo}>
                    {titulo}
                    <input
                      type="number"
                      min={campo === "peso_utilizado_kg" ? 0 : 1}
                      max={max}
                      step={campo === "peso_utilizado_kg" ? "0.01" : "1"}
                      value={e[campo] || 0}
                      onChange={(v) =>
                        cambiar(i, campo, Number(v.target.value))
                      }
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <label>
            Distancia recorrida (km, si corresponde)
            <input
              type="number"
              min="0"
              max="1000"
              step="0.01"
              value={actual.distancia_km}
              onChange={(e) =>
                setActual({
                  id: actual.id,
                  ejercicios: actual.ejercicios,
                  observaciones: actual.observaciones,
                  distancia_km: Number(e.target.value),
                })
              }
            />
          </label>
          <label>
            Observaciones
            <textarea
              maxLength={2000}
              value={actual.observaciones}
              onChange={(e) =>
                setActual({
                  id: actual.id,
                  ejercicios: actual.ejercicios,
                  distancia_km: actual.distancia_km,
                  observaciones: e.target.value,
                })
              }
            />
          </label>
          <div className="acciones">
            {[
              ["iniciado", "Guardar avance"],
              ["completado", "Completar"],
              ["incompleto", "Cerrar incompleto"],
              ["cancelado", "Cancelar sesión"],
            ].map(([estado, titulo]) => (
              <button
                key={estado}
                disabled={ocupado}
                className={estado === "completado" ? "" : "secundario"}
                onClick={() => guardar(estado)}
              >
                {titulo}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <form onSubmit={iniciar} className="tarjeta">
          <h2>Iniciar sesión de entrenamiento</h2>
          <div className="grilla dos">
            <label>
              Rutina
              <select
                required
                value={rutina}
                onChange={(e) => setRutina(e.target.value)}
              >
                <option value="">Elegí una rutina</option>
                {rutinas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Día de la rutina
              <select
                value={dia}
                onChange={(e) => setDia(Number(e.target.value))}
              >
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((d, i) => (
                  <option key={d} value={i + 1}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button disabled={ocupado}>Comenzar entrenamiento</button>
        </form>
      )}
      <h2>Tu historial</h2>
      {!items.length && (
        <p className="vacio">Todavía no registraste entrenamientos.</p>
      )}
      {entrenamientosAnteriores.map((e) => (
        <article className="tarjeta" key={e.id}>
          <span className="badge">{e.estado}</span>
          <h3>
            {e.fecha} · {e.distancia_km || 0} km
          </h3>
          <p>{e.observaciones}</p>
          <details>
            <summary>Ver ejercicios registrados</summary>
            <ul>
              {e.ejercicios.map((x) => (
                <li key={x.id}>
                  {x.realizado ? "✓" : "—"} {x.nombre_ejercicio}: {x.series} ×{" "}
                  {x.repeticiones} · {x.peso_utilizado_kg || 0} kg
                </li>
              ))}
            </ul>
          </details>
        </article>
      ))}
    </main>
  );
}
