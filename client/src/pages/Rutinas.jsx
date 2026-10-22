import Confirmar from "../components/Confirmar";
import { useEffect, useState } from "react";
import axios from "axios";
const ejercicioNuevo = () => ({
  nombre_ejercicio: "",
  ejercicio_id: null,
  dia_semana: 1,
  series: 3,
  repeticiones: 10,
  peso_sugerido_kg: 0,
  descanso_segundos: 90,
  observaciones: "",
});
export default function Rutinas() {
  const [items, setItems] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [datos, setDatos] = useState({
    nombre: "",
    descripcion: "",
    objetivo_id: "",
    ejercicios: [ejercicioNuevo()],
  });
  const [busqueda, setBusqueda] = useState("");
  const [catalogo, setCatalogo] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [aviso, setAviso] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  async function cargar() {
    try {
      const r = await axios.get("/rutinas");
      setItems(r.data.items);
      const o = await axios.get("/objetivos");
      setObjetivos(o.data.items);
    } catch (e) {
      setAviso(
        e.response?.data?.message || "No se pudieron cargar las rutinas.",
      );
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function buscar(e, p = 1) {
    e?.preventDefault();
    try {
      const r = await axios.get("/ejercicios", {
        params: { buscar: busqueda, pagina: p },
      });
      setCatalogo(r.data);
      setPagina(p);
    } catch (error) {
      setAviso(
        error.response?.data?.message || "No se pudo consultar el catálogo.",
      );
    }
  }
  function agregarFicha(ficha) {
    setDatos({
      ...datos,
      ejercicios: [
        ...datos.ejercicios,
        {
          ...ejercicioNuevo(),
          ejercicio_id: ficha.id,
          nombre_ejercicio: ficha.name,
        },
      ],
    });
    setAviso(
      "Ejercicio agregado al editor. Completá sus datos y guardá la rutina.",
    );
  }
  function cambiarEjercicio(indice, campo, valor) {
    setDatos({
      ...datos,
      ejercicios: datos.ejercicios.map((e, i) =>
        i === indice ? { ...e, [campo]: valor } : e,
      ),
    });
  }
  function editar(r) {
    setEditando(r.id);
    setDatos({
      nombre: r.nombre,
      descripcion: r.descripcion || "",
      objetivo_id: r.objetivo_id || "",
      ejercicios: r.ejercicios.map((e) => ({
        ...e,
        peso_sugerido_kg: e.peso_sugerido_kg || 0,
        descanso_segundos: e.descanso_segundos ?? 90,
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function limpiar() {
    setEditando(null);
    setDatos({
      nombre: "",
      descripcion: "",
      objetivo_id: "",
      ejercicios: [ejercicioNuevo()],
    });
  }
  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    setAviso("");
    const cuerpo = {
      ...datos,
      ejercicios: datos.ejercicios.map((e, i) => ({ ...e, orden: i })),
    };
    try {
      if (editando) await axios.put("/rutinas/" + editando, cuerpo);
      else await axios.post("/rutinas", cuerpo);
      limpiar();
      await cargar();
      setAviso("Rutina guardada.");
    } catch (error) {
      setAviso(
        error.response?.data?.message || "No se pudo guardar la rutina.",
      );
    } finally {
      setOcupado(false);
    }
  }
  async function eliminar(r, confirmado = false) {
    if (!confirmado) {
      setConfirmacion(r);
      return;
    }
    setConfirmacion(null);
    try {
      await axios.delete("/rutinas/" + r.id, { data: { confirmar: true } });
      await cargar();
      if (editando === r.id) limpiar();
    } catch (e) {
      setAviso(e.response?.data?.message || "No se pudo dar de baja.");
    }
  }
  return (
    <main>
      {confirmacion && (
        <Confirmar
          texto="¿Dar de baja esta rutina? Los entrenamientos se conservan."
          onAceptar={() => eliminar(confirmacion, true)}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
      <p className="etiqueta">UN PLAN QUE TE MUEVE</p>
      <h1>Rutinas</h1>
      <p className="muted">
        Armá tu semana con ejercicios propios o del catálogo.
      </p>
      {aviso && (
        <p role="status" className="aviso">
          {aviso}
        </p>
      )}
      <form className="tarjeta" onSubmit={guardar}>
        <h2>{editando ? "Editar rutina" : "Nueva rutina"}</h2>
        <div className="grilla dos">
          <label>
            Nombre
            <input
              required
              minLength={2}
              maxLength={100}
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </label>
          <label>
            Objetivo
            <select
              value={datos.objetivo_id}
              onChange={(e) =>
                setDatos({ ...datos, objetivo_id: e.target.value })
              }
            >
              <option value="">Sin objetivo asociado</option>
              {objetivos
                .filter(
                  (o) => o.estado === "activo" || o.id === datos.objetivo_id,
                )
                .map((o) => (
                  <option value={o.id} key={o.id}>
                    {o.nombre} ({o.estado})
                  </option>
                ))}
            </select>
          </label>
        </div>
        <label>
          Descripción
          <textarea
            maxLength={2000}
            value={datos.descripcion}
            onChange={(e) =>
              setDatos({ ...datos, descripcion: e.target.value })
            }
          />
        </label>
        {datos.ejercicios.map((ejercicio, i) => (
          <fieldset key={i}>
            <legend>Ejercicio {i + 1}</legend>
            <div className="grilla tres">
              <label>
                Nombre
                <input
                  required
                  maxLength={150}
                  readOnly={!!ejercicio.ejercicio_id}
                  value={ejercicio.nombre_ejercicio}
                  onChange={(e) =>
                    cambiarEjercicio(i, "nombre_ejercicio", e.target.value)
                  }
                />
              </label>
              {[
                ["dia_semana", "Día (lunes=1)", 1, 7, 1],
                ["series", "Series", 1, 20, 1],
                ["repeticiones", "Repeticiones", 1, 200, 1],
                ["peso_sugerido_kg", "Peso (kg)", 0, 600, 0.01],
                ["descanso_segundos", "Descanso (seg)", 0, 900, 1],
              ].map(([campo, titulo, min, max, step]) => (
                <label key={campo}>
                  {titulo}
                  <input
                    required
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={ejercicio[campo]}
                    onChange={(e) =>
                      cambiarEjercicio(i, campo, Number(e.target.value))
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Observaciones
              <input
                maxLength={1000}
                value={ejercicio.observaciones || ""}
                onChange={(e) =>
                  cambiarEjercicio(i, "observaciones", e.target.value)
                }
              />
            </label>
            <button
              type="button"
              className="secundario"
              disabled={datos.ejercicios.length === 1}
              onClick={() =>
                setDatos({
                  ...datos,
                  ejercicios: datos.ejercicios.filter((_, j) => i !== j),
                })
              }
            >
              Quitar ejercicio
            </button>
          </fieldset>
        ))}
        <div className="acciones">
          <button
            type="button"
            className="secundario"
            disabled={datos.ejercicios.length >= 80}
            onClick={() =>
              setDatos({
                ...datos,
                ejercicios: [...datos.ejercicios, ejercicioNuevo()],
              })
            }
          >
            ＋ Ejercicio manual
          </button>
          <button disabled={ocupado}>Guardar rutina</button>
          {editando && (
            <button type="button" className="secundario" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>
      <section className="tarjeta">
        <h2>Explorá el catálogo</h2>
        <form onSubmit={buscar} className="acciones">
          <label>
            Buscar ejercicio o grupo (en inglés)
            <input
              value={busqueda}
              maxLength={100}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Por ejemplo: squat"
            />
          </label>
          <button>Buscar</button>
        </form>
        {catalogo && (
          <>
            <p className="muted">
              {catalogo.total} resultados · Página {pagina}
            </p>
            <div className="grilla dos">
              {catalogo.items.map((f) => (
                <article key={f.id} className="ficha">
                  <h3>{f.name}</h3>
                  <small>
                    {f.body_part} · {f.equipment}
                  </small>
                  <details>
                    <summary>Cómo realizarlo</summary>
                    <p>{f.instructions?.es || f.instructions?.en}</p>
                  </details>
                  <button
                    className="secundario"
                    disabled={datos.ejercicios.length >= 80}
                    onClick={() => agregarFicha(f)}
                  >
                    Agregar al editor
                  </button>
                </article>
              ))}
            </div>
            <div className="acciones">
              <button
                className="secundario"
                disabled={pagina <= 1}
                onClick={() => buscar(null, pagina - 1)}
              >
                Anterior
              </button>
              <button
                className="secundario"
                disabled={pagina * 24 >= catalogo.total}
                onClick={() => buscar(null, pagina + 1)}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>
      <h2>Mis rutinas</h2>
      {!items.length && (
        <p className="vacio">Tu primera rutina empieza con un ejercicio.</p>
      )}
      {items.map((r) => (
        <article className="tarjeta" key={r.id}>
          <span className="badge">
            {r.tipo_generacion === "ia" ? "Propuesta IA" : "Manual"}
          </span>
          <h2>{r.nombre}</h2>
          <p>{r.descripcion}</p>
          <ul>
            {r.ejercicios.map((e) => (
              <li key={e.id}>
                Día {e.dia_semana} · {e.nombre_ejercicio}: {e.series} ×{" "}
                {e.repeticiones} · {e.peso_sugerido_kg || 0} kg ·{" "}
                {e.descanso_segundos} s
              </li>
            ))}
          </ul>
          <div className="acciones">
            <button onClick={() => editar(r)}>Editar</button>
            <button className="secundario" onClick={() => eliminar(r)}>
              Dar de baja
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}
