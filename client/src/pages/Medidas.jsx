import { useEffect, useState } from "react";
import axios from "axios";
const vacia = {
  peso_kg: "",
  altura_cm: "",
  grasa_corporal: "",
  musculo_corporal: "",
  nivel_actividad: "media",
  cintura_cm: "",
  pecho_cm: "",
  brazos_cm: "",
  piernas_cm: "",
};
function mostrarPorcentaje(valor) {
  if (valor === null || valor === undefined) {
    return "—";
  }
  return valor;
}
export default function Medidas({ usuario }) {
  const [items, setItems] = useState([]);
  const [datos, setDatos] = useState(vacia);
  const [cargado, setCargado] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  async function cargar() {
    try {
      const r = await axios.get("/mediciones");
      setItems(r.data.items);
      setCargado(true);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudieron cargar las medidas.");
      }
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    setAviso("");
    const cuerpo = {
      peso_kg: datos.peso_kg,
      altura_cm: datos.altura_cm,
      grasa_corporal: datos.grasa_corporal,
      musculo_corporal: datos.musculo_corporal,
      nivel_actividad: datos.nivel_actividad,
      cintura_cm: datos.cintura_cm,
      pecho_cm: datos.pecho_cm,
      brazos_cm: datos.brazos_cm,
      piernas_cm: datos.piernas_cm,
    };
    const campos = Object.keys(cuerpo);
    for (let indice = 0; indice < campos.length; indice++) {
      const campo = campos[indice];
      if (campo !== "nivel_actividad") {
        if (cuerpo[campo] === "") {
          cuerpo[campo] = null;
        } else {
          cuerpo[campo] = Number(cuerpo[campo]);
        }
      }
    }
    try {
      await axios.post(
        items.length ? "/mediciones" : "/mediciones/initial",
        cuerpo,
      );
      setDatos(vacia);
      await cargar();
      setAviso("Medición agregada al historial.");
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
  return (
    <main>
      <p className="etiqueta">PUNTO DE PARTIDA</p>
      <h1>Medidas y progreso</h1>
      <p className="muted">
        Cada medición agrega un registro; las anteriores se conservan.
      </p>
      {aviso && (
        <p role="status" className="aviso">
          {aviso}
        </p>
      )}
      <form className="tarjeta" onSubmit={guardar}>
        <h2>{items.length ? "Nueva medición" : "Medición inicial"}</h2>
        <div className="grilla tres">
          {[
            ["peso_kg", "Peso (kg)", 20, 400],
            ["altura_cm", "Altura (cm)", 80, 250],
            ["grasa_corporal", "Grasa corporal (%)", 0, 70],
            ["musculo_corporal", "Masa muscular (%)", 0, 100],
            ["cintura_cm", "Cintura (cm)", 0, 300],
            ["pecho_cm", "Pecho (cm)", 0, 300],
            ["brazos_cm", "Brazo (cm)", 0, 300],
            ["piernas_cm", "Pierna (cm)", 0, 300],
          ].map(([campo, titulo, min, max]) => (
            <label key={campo}>
              {titulo}
              <input
                type="number"
                step="0.01"
                min={min}
                max={max}
                required={["peso_kg", "altura_cm"].includes(campo)}
                value={datos[campo]}
                onChange={(e) =>
                  setDatos({
                    peso_kg: datos.peso_kg,
                    altura_cm: datos.altura_cm,
                    grasa_corporal: datos.grasa_corporal,
                    musculo_corporal: datos.musculo_corporal,
                    nivel_actividad: datos.nivel_actividad,
                    cintura_cm: datos.cintura_cm,
                    pecho_cm: datos.pecho_cm,
                    brazos_cm: datos.brazos_cm,
                    piernas_cm: datos.piernas_cm,
                    [campo]: e.target.value,
                  })
                }
              />
            </label>
          ))}
          <label>
            Actividad
            <select
              value={datos.nivel_actividad}
              onChange={(e) =>
                setDatos({
                  peso_kg: datos.peso_kg,
                  altura_cm: datos.altura_cm,
                  grasa_corporal: datos.grasa_corporal,
                  musculo_corporal: datos.musculo_corporal,
                  cintura_cm: datos.cintura_cm,
                  pecho_cm: datos.pecho_cm,
                  brazos_cm: datos.brazos_cm,
                  piernas_cm: datos.piernas_cm,
                  nivel_actividad: e.target.value,
                })
              }
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
        </div>
        <button disabled={ocupado || !cargado}>Guardar medición</button>
      </form>
      <section className="tarjeta">
        <h2>Historial</h2>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Peso</th>
                <th>Altura</th>
                <th>Grasa</th>
                <th>Músculo</th>
                <th>Actividad</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>
                    {new Date(m.fecha_medicion).toLocaleString("es-AR", {
                      timeZone: usuario.zona_horaria,
                      hour12: false,
                    })}
                  </td>
                  <td>{m.peso_kg} kg</td>
                  <td>{m.altura_cm} cm</td>
                  <td>{mostrarPorcentaje(m.grasa_corporal)} %</td>
                  <td>{mostrarPorcentaje(m.musculo_corporal)} %</td>
                  <td>{m.nivel_actividad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <p className="muted">Todavía no hay mediciones.</p>}
      </section>
    </main>
  );
}
