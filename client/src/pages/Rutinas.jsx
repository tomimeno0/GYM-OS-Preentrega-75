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
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudieron cargar las rutinas.");
      }
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function buscar(e, p = 1) {
    if (e) {
      e.preventDefault();
    }
    try {
      const r = await axios.get("/ejercicios", {
        params: {
          buscar: busqueda,
          pagina: p,
        },
      });
      setCatalogo(r.data);
      setPagina(p);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo consultar el catálogo.");
      }
    }
  }
  function copiarEjercicio(ejercicio) {
    return {
      nombre_ejercicio: ejercicio.nombre_ejercicio,
      ejercicio_id: ejercicio.ejercicio_id,
      dia_semana: ejercicio.dia_semana,
      series: ejercicio.series,
      repeticiones: ejercicio.repeticiones,
      peso_sugerido_kg: ejercicio.peso_sugerido_kg || 0,
      descanso_segundos: ejercicio.descanso_segundos,
      observaciones: ejercicio.observaciones || "",
    };
  }
  function agregarFicha(ficha) {
    const ejercicios = datos.ejercicios.slice();
    const ejercicio = ejercicioNuevo();
    ejercicio.ejercicio_id = ficha.id;
    ejercicio.nombre_ejercicio = ficha.name;
    ejercicios.push(ejercicio);
    setDatos({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo_id: datos.objetivo_id,
      ejercicios,
    });
    setAviso(
      "Ejercicio agregado al editor. Completá sus datos y guardá la rutina.",
    );
  }
  function cambiarEjercicio(indice, campo, valor) {
    const ejercicios = datos.ejercicios.slice();
    const ejercicio = copiarEjercicio(ejercicios[indice]);
    ejercicio[campo] = valor;
    ejercicios[indice] = ejercicio;
    setDatos({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo_id: datos.objetivo_id,
      ejercicios,
    });
  }
  function editar(rutina) {
    const ejercicios = [];
    for (let i = 0; i < rutina.ejercicios.length; i++) {
      const ejercicio = copiarEjercicio(rutina.ejercicios[i]);
      if (
        ejercicio.descanso_segundos === null ||
        ejercicio.descanso_segundos === undefined
      ) {
        ejercicio.descanso_segundos = 90;
      }
      ejercicios.push(ejercicio);
    }
    setEditando(rutina.id);
    setDatos({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || "",
      objetivo_id: rutina.objetivo_id || "",
      ejercicios,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    const ejercicios = [];
    for (let i = 0; i < datos.ejercicios.length; i++) {
      const ejercicio = copiarEjercicio(datos.ejercicios[i]);
      ejercicio.orden = i;
      ejercicios.push(ejercicio);
    }
    const cuerpo = {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo_id: datos.objetivo_id,
      ejercicios,
    };
    try {
      if (editando) {
        await axios.put("/rutinas/" + editando, cuerpo);
      } else {
        await axios.post("/rutinas", cuerpo);
      }
      limpiar();
      await cargar();
      setAviso("Rutina guardada.");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo guardar la rutina.");
      }
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
      await axios.delete("/rutinas/" + r.id, {
        data: {
          confirmar: true,
        },
      });
      await cargar();
      if (editando === r.id) {
        limpiar();
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudo dar de baja.");
      }
    }
  }
  const objetivosDisponibles = [];
  for (let i = 0; i < objetivos.length; i++) {
    const objetivo = objetivos[i];
    if (objetivo.estado === "activo" || objetivo.id === datos.objetivo_id) {
      objetivosDisponibles.push(objetivo);
    }
  }
  function quitarEjercicio(indice) {
    const ejercicios = [];
    for (let i = 0; i < datos.ejercicios.length; i++) {
      if (i !== indice) {
        ejercicios.push(datos.ejercicios[i]);
      }
    }
    setDatos({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo_id: datos.objetivo_id,
      ejercicios,
    });
  }
  function agregarEjercicioManual() {
    const ejercicios = datos.ejercicios.slice();
    ejercicios.push(ejercicioNuevo());
    setDatos({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo_id: datos.objetivo_id,
      ejercicios,
    });
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
              onChange={(e) =>
                setDatos({
                  descripcion: datos.descripcion,
                  objetivo_id: datos.objetivo_id,
                  ejercicios: datos.ejercicios,
                  nombre: e.target.value,
                })
              }
            />
          </label>
          <label>
            Objetivo
            <select
              value={datos.objetivo_id}
              onChange={(e) =>
                setDatos({
                  nombre: datos.nombre,
                  descripcion: datos.descripcion,
                  ejercicios: datos.ejercicios,
                  objetivo_id: e.target.value,
                })
              }
            >
              <option value="">Sin objetivo asociado</option>
              {objetivosDisponibles.map((o) => (
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
              setDatos({
                nombre: datos.nombre,
                objetivo_id: datos.objetivo_id,
                ejercicios: datos.ejercicios,
                descripcion: e.target.value,
              })
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
              onClick={() => quitarEjercicio(i)}
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
            onClick={() => agregarEjercicioManual()}
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
                    <p>
                      {(f.instructions !== null &&
                        f.instructions !== undefined &&
                        f.instructions.es) ||
                        (f.instructions !== null &&
                          f.instructions !== undefined &&
                          f.instructions.en)}
                    </p>
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
