import Confirmar from "../components/Confirmar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Asistente({ usuario }) {
  const [modo, setModo] = useState("entrenador");
  const [mensajes, setMensajes] = useState([]);
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacion, setConversacion] = useState(null);
  const [consulta, setConsulta] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [rutinas, setRutinas] = useState([]);
  const [rutina, setRutina] = useState("");
  const [estado, setEstado] = useState(null);
  const [aviso, setAviso] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  async function cargar() {
    try {
      setEstado((await axios.get("/ia/estado")).data);
      setConversaciones((await axios.get("/ia/conversaciones")).data.items);
      const respuesta = await axios.get("/rutinas");
      const rutinasActivas = [];
      for (let i = 0; i < respuesta.data.items.length; i++) {
        const rutina = respuesta.data.items[i];
        if (rutina.estado === "activa") {
          rutinasActivas.push(rutina);
        }
      }
      setRutinas(rutinasActivas);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudo consultar el asistente.");
      }
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function abrir(id) {
    if (!id) {
      setConversacion(null);
      setMensajes([]);
      return;
    }
    setOcupado(true);
    try {
      const r = await axios.get("/ia/conversaciones/" + id);
      setConversacion(id);
      setModo(r.data.conversacion.modo);
      setMensajes(r.data.mensajes);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setAviso(e.response.data.message);
      } else {
        setAviso("No se pudo abrir la conversación.");
      }
    } finally {
      setOcupado(false);
    }
  }
  async function enviar(e) {
    e.preventDefault();
    setOcupado(true);
    setAviso("");
    try {
      const r = await axios.post("/ia/consulta", {
        consulta,
        modo,
        conversacion_id: conversacion,
      });
      const historialActualizado = mensajes.slice();
      historialActualizado.push({
        rol: "user",
        contenido: consulta,
      });
      historialActualizado.push({
        rol: "assistant",
        contenido: r.data.respuesta,
      });
      setMensajes(historialActualizado);
      setConversacion(r.data.conversacion_id);
      setConsulta("");
      await cargar();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo contactar a Cohere.");
      }
    } finally {
      setOcupado(false);
    }
  }
  async function generar(e, confirmado = false) {
    if (e) {
      e.preventDefault();
    }
    if (!confirmado) {
      setConfirmacion(true);
      return;
    }
    setConfirmacion(null);
    setOcupado(true);
    setAviso("");
    try {
      const r = await axios.post(
        rutina ? "/ia/rutinas/" + rutina + "/adaptar" : "/ia/rutinas",
        {
          preferencias,
          confirmar: true,
        },
      );
      await cargar();
      setAviso(r.data.message + " La encontrás en Rutinas.");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo generar la propuesta.");
      }
    } finally {
      setOcupado(false);
    }
  }
  const habilitado =
    usuario.consentimiento_ia &&
    estado !== null &&
    estado !== undefined &&
    estado.configurada &&
    !ocupado;
  const conversacionesDelModo = [];
  for (let i = 0; i < conversaciones.length; i++) {
    if (conversaciones[i].modo === modo) {
      conversacionesDelModo.push(conversaciones[i]);
    }
  }
  return (
    <main>
      {confirmacion && (
        <Confirmar
          texto={
            rutina
              ? "¿Enviar el contexto a Cohere y reemplazar los ejercicios de la rutina?"
              : "¿Enviar medidas, objetivo y resumen de entrenamientos a Cohere para crear una propuesta?"
          }
          onAceptar={() => generar(null, true)}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
      <p className="etiqueta">PREGUNTÁ. ENTENDÉ. AVANZÁ.</p>
      <h1>
        Asistente <span className="acento">✦</span>
      </h1>
      <p className="muted">
        Cohere por API ·{" "}
        {estado
          ? estado.configurada
            ? "Configurada; disponibilidad sujeta al proveedor"
            : "Falta configurar la clave en el servidor"
          : "Consultando configuración…"}
      </p>
      {!usuario.consentimiento_ia && (
        <p className="aviso">
          Primero activá el consentimiento de IA en{" "}
          <Link to="/cuenta">Mi cuenta</Link>.
        </p>
      )}
      {aviso && (
        <p role="status" className="aviso">
          {aviso}
        </p>
      )}
      <section className="tarjeta">
        <div className="grilla dos">
          <label>
            Modo
            <select
              value={modo}
              disabled={ocupado}
              onChange={(e) => {
                setModo(e.target.value);
                setConversacion(null);
                setMensajes([]);
              }}
            >
              <option value="entrenador">Entrenador</option>
              <option value="soporte">Soporte de la app</option>
            </select>
          </label>
          <label>
            Conversación
            <select
              value={conversacion || ""}
              disabled={ocupado}
              onChange={(e) => abrir(e.target.value)}
            >
              <option value="">Nueva conversación</option>
              {conversacionesDelModo.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="chat" aria-live="polite">
          {!mensajes.length && (
            <div className="vacio">
              <span className="chat-estrella">✦</span>
              <h2>¿Qué querés mejorar hoy?</h2>
              <p>
                Podés preguntar sobre entrenamiento, hábitos o cómo usar GYM-OS.
              </p>
            </div>
          )}
          {mensajes.map((m, i) => (
            <article className={"mensaje " + m.rol} key={m.id || i}>
              <small>{m.rol === "user" ? "VOS" : "GYM-OS · COHERE"}</small>
              <p>{m.contenido.replaceAll("**", "")}</p>
            </article>
          ))}
          {ocupado && <p role="status">Consultando… No cierres esta página.</p>}
        </div>
        <form onSubmit={enviar}>
          <label>
            Tu consulta
            <textarea
              required
              maxLength={2000}
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Por ejemplo: ¿cómo organizo tres días de entrenamiento?"
            />
          </label>
          <button disabled={!habilitado}>Enviar consulta ↗</button>
        </form>
        <small>
          El chat no modifica tus datos. Orientación general, no consejo médico
          ni nutricional individual.
        </small>
      </section>
      <form className="tarjeta" onSubmit={generar}>
        <h2>Una propuesta para tu rutina</h2>
        <p className="muted">
          Requiere medidas y un objetivo activo. La propuesta se guarda para que
          la revises y ajustes antes de entrenar.
        </p>
        <label>
          Qué querés hacer
          <select
            value={rutina}
            disabled={ocupado}
            onChange={(e) => setRutina(e.target.value)}
          >
            <option value="">Generar una rutina nueva</option>
            {rutinas.map((r) => (
              <option key={r.id} value={r.id}>
                Adaptar: {r.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preferencias y limitaciones de equipo
          <textarea
            required
            minLength={3}
            maxLength={1000}
            value={preferencias}
            onChange={(e) => setPreferencias(e.target.value)}
            placeholder="Tres días por semana, nivel inicial, mancuernas…"
          />
        </label>
        <button disabled={!habilitado}>
          {rutina ? "Adaptar con Cohere" : "Generar con Cohere"}
        </button>
        <p>
          <Link to="/rutinas">Ver mis rutinas ↗</Link>
        </p>
      </form>
    </main>
  );
}
