import Confirmar from "../components/Confirmar";
import { useEffect, useState } from "react";
import axios from "axios";
const tipos = {
  bajar_peso: "Bajar peso",
  ganar_masa_muscular: "Ganar masa muscular",
  mejorar_resistencia: "Mejorar resistencia",
  aumentar_frecuencia_entrenamiento: "Aumentar frecuencia",
  definir: "Definir",
  mantener_peso: "Mantener peso",
};
export default function Objetivos({ usuario }) {
  const [items, setItems] = useState([]);
  const [datos, setDatos] = useState({
    nombre: "",
    descripcion: "",
    tipo: "bajar_peso",
    valor_objetivo: "",
    frecuencia_semanal: 3,
    fecha_inicio: new Date().toLocaleDateString("en-CA", {
      timeZone: usuario.zona_horaria,
    }),
    fecha_fin_estimada: "",
  });
  const [aviso, setAviso] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  async function cargar() {
    try {
      setItems((await axios.get("/objetivos")).data.items);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudieron cargar los objetivos.");
      }
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  let unidad = "kg";
  if (datos.tipo === "definir") {
    unidad = "%";
  } else if (datos.tipo === "mejorar_resistencia") {
    unidad = "km";
  } else if (datos.tipo === "aumentar_frecuencia_entrenamiento") {
    unidad = "entrenamientos";
  }
  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    setAviso("");
    try {
      await axios.post("/objetivos", {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        fecha_inicio: datos.fecha_inicio,
        fecha_fin_estimada: datos.fecha_fin_estimada,
        unidad,
        valor_objetivo: Number(datos.valor_objetivo),
        frecuencia_semanal: Number(datos.frecuencia_semanal),
      });
      await cargar();
      setAviso("Objetivo creado.");
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
  async function cambiar(o, completar, confirmado = false) {
    if (!confirmado) {
      setConfirmacion({
        o,
        completar,
      });
      return;
    }
    setConfirmacion(null);
    setOcupado(true);
    try {
      if (completar) {
        await axios.post("/objetivos/" + o.id + "/completar", {
          confirmar: true,
        });
      } else {
        await axios.delete("/objetivos/" + o.id, {
          data: {
            confirmar: true,
          },
        });
      }
      await cargar();
      setAviso("Objetivo actualizado.");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudo actualizar.");
      }
    } finally {
      setOcupado(false);
    }
  }
  let hayObjetivoActivo = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].estado === "activo") {
      hayObjetivoActivo = true;
      break;
    }
  }
  return (
    <main>
      {confirmacion && (
        <Confirmar
          texto={
            confirmacion.completar
              ? "¿Marcar este objetivo como completado?"
              : "¿Dar de baja este objetivo? El historial se conserva."
          }
          onAceptar={() =>
            cambiar(confirmacion.o, confirmacion.completar, true)
          }
          onCancelar={() => setConfirmacion(null)}
        />
      )}
      <p className="etiqueta">DALE DIRECCIÓN</p>
      <h1>Objetivos</h1>
      <p className="muted">
        Un objetivo activo a la vez. Primero necesitás una medición física.
      </p>
      {aviso && (
        <p role="status" className="aviso">
          {aviso}
        </p>
      )}
      {!hayObjetivoActivo && (
        <form className="tarjeta" onSubmit={guardar}>
          <h2>Definir objetivo</h2>
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
                    tipo: datos.tipo,
                    valor_objetivo: datos.valor_objetivo,
                    frecuencia_semanal: datos.frecuencia_semanal,
                    fecha_inicio: datos.fecha_inicio,
                    fecha_fin_estimada: datos.fecha_fin_estimada,
                    nombre: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Tipo
              <select
                value={datos.tipo}
                onChange={(e) =>
                  setDatos({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    valor_objetivo: datos.valor_objetivo,
                    frecuencia_semanal: datos.frecuencia_semanal,
                    fecha_inicio: datos.fecha_inicio,
                    fecha_fin_estimada: datos.fecha_fin_estimada,
                    tipo: e.target.value,
                  })
                }
              >
                {Object.entries(tipos).map(([v, t]) => (
                  <option key={v} value={v}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Meta ({unidad})
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={datos.valor_objetivo}
                onChange={(e) =>
                  setDatos({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    tipo: datos.tipo,
                    frecuencia_semanal: datos.frecuencia_semanal,
                    fecha_inicio: datos.fecha_inicio,
                    fecha_fin_estimada: datos.fecha_fin_estimada,
                    valor_objetivo: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Días por semana
              <input
                required
                type="number"
                min="1"
                max="7"
                value={datos.frecuencia_semanal}
                onChange={(e) =>
                  setDatos({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    tipo: datos.tipo,
                    valor_objetivo: datos.valor_objetivo,
                    fecha_inicio: datos.fecha_inicio,
                    fecha_fin_estimada: datos.fecha_fin_estimada,
                    frecuencia_semanal: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Inicio
              <input
                required
                type="date"
                value={datos.fecha_inicio}
                onChange={(e) =>
                  setDatos({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    tipo: datos.tipo,
                    valor_objetivo: datos.valor_objetivo,
                    frecuencia_semanal: datos.frecuencia_semanal,
                    fecha_fin_estimada: datos.fecha_fin_estimada,
                    fecha_inicio: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Fin estimado (opcional)
              <input
                type="date"
                value={datos.fecha_fin_estimada}
                onChange={(e) =>
                  setDatos({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    tipo: datos.tipo,
                    valor_objetivo: datos.valor_objetivo,
                    frecuencia_semanal: datos.frecuencia_semanal,
                    fecha_inicio: datos.fecha_inicio,
                    fecha_fin_estimada: e.target.value,
                  })
                }
              />
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
                  tipo: datos.tipo,
                  valor_objetivo: datos.valor_objetivo,
                  frecuencia_semanal: datos.frecuencia_semanal,
                  fecha_inicio: datos.fecha_inicio,
                  fecha_fin_estimada: datos.fecha_fin_estimada,
                  descripcion: e.target.value,
                })
              }
            />
          </label>
          <button disabled={ocupado}>Crear objetivo</button>
        </form>
      )}
      <div className="grilla dos">
        {items.map((o) => (
          <article key={o.id} className="tarjeta">
            <span className="badge">{o.estado}</span>
            <h2>{o.nombre}</h2>
            <p>
              {tipos[o.tipo]} · {o.valor_objetivo} {o.unidad}
            </p>
            <p className="muted">{o.descripcion}</p>
            <small>
              Inicio: {o.fecha_inicio} · Frecuencia: {o.frecuencia_semanal} días
            </small>
            <div className="acciones">
              {o.estado === "activo" && (
                <button disabled={ocupado} onClick={() => cambiar(o, true)}>
                  Marcar completado
                </button>
              )}
              <button
                className="secundario"
                disabled={ocupado}
                onClick={() => cambiar(o, false)}
              >
                Dar de baja
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
