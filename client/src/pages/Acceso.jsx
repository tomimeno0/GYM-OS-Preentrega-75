import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Acceso({ modo, setUsuario }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const navegar = useNavigate();
  async function enviar(e) {
    e.preventDefault();
    setAviso("");
    setOcupado(true);
    try {
      let datos;
      if (modo === "registro") {
        datos = {
          nombre,
          apellido,
          email,
          password,
        };
      } else {
        datos = {
          email,
          password,
        };
      }
      const r = await axios.post("/" + modo, datos);
      setUsuario(r.data.user);
      navegar("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAviso(error.response.data.message);
      } else {
        setAviso("No se pudo conectar con el servidor.");
      }
    } finally {
      setOcupado(false);
    }
  }
  return (
    <main className="acceso">
      <Link className="marca" to="/">
        GYM<span>—</span>OS
      </Link>
      <div className="tarjeta acceso-form">
        <p className="etiqueta">TU ESPACIO PERSONAL</p>
        <h1>
          {modo === "registro"
            ? "Tu próximo paso empieza acá."
            : "Volvé a tu ritmo."}
        </h1>
        <form onSubmit={enviar}>
          {modo === "registro" && (
            <div className="grilla dos">
              <label>
                Nombre
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </label>
              <label>
                Apellido
                <input
                  maxLength={100}
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </label>
            </div>
          )}
          <label>
            Correo electrónico
            <input
              required
              type="email"
              autoComplete="email"
              maxLength={150}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Contraseña
            <input
              required
              type="password"
              autoComplete={
                modo === "login" ? "current-password" : "new-password"
              }
              minLength={modo === "login" ? 1 : 10}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small>
              10 caracteres como mínimo al crearla; máximo 72 bytes.
            </small>
          </label>
          {aviso && (
            <p role="status" className="aviso">
              {aviso}
            </p>
          )}
          <button disabled={ocupado}>
            {ocupado
              ? "Procesando…"
              : modo === "login"
                ? "Iniciar sesión"
                : "Crear mi cuenta"}
          </button>
        </form>
        <div className="enlaces">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </main>
  );
}
