import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
export default function Acceso({ modo, setUsuario }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  async function enviar(e) {
    e.preventDefault();
    setAviso("");
    setOcupado(true);
    try {
      const datos =
        modo === "registro"
          ? { nombre, apellido, email, password }
          : modo === "restablecer"
            ? { token: parametros.get("token"), password }
            : modo === "recuperar"
              ? { email }
              : { email, password };
      const r = await axios.post("/" + modo, datos);
      if (r.data.user) {
        setUsuario(r.data.user);
        navegar("/dashboard");
      } else {
        setAviso(r.data.message);
        setPassword("");
      }
    } catch (error) {
      setAviso(
        error.response?.data?.message || "No se pudo conectar con el servidor.",
      );
    } finally {
      setOcupado(false);
    }
  }
  const titulo = {
    registro: "Tu próximo paso empieza acá.",
    login: "Volvé a tu ritmo.",
    recuperar: "Recuperá tu acceso.",
    restablecer: "Elegí una contraseña nueva.",
  }[modo];
  return (
    <main className="acceso" key={modo}>
      <Link className="marca" to="/">
        GYM<span>—</span>OS
      </Link>
      <div className="tarjeta acceso-form">
        <p className="etiqueta">TU ESPACIO PERSONAL</p>
        <h1>{titulo}</h1>
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
          {modo !== "restablecer" && (
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
          )}
          {modo !== "recuperar" && (
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
          )}
          {aviso && (
            <p role="status" className="aviso">
              {aviso}
            </p>
          )}
          <button disabled={ocupado}>
            {ocupado
              ? "Procesando…"
              : {
                  login: "Iniciar sesión",
                  registro: "Crear mi cuenta",
                  recuperar: "Enviar enlace",
                  restablecer: "Guardar contraseña",
                }[modo]}
          </button>
        </form>
        <div className="enlaces">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/recuperar">Olvidé mi contraseña</Link>
        </div>
        <small>
          Sin correo SMTP configurado, el enlace se guarda en el equipo del
          servidor. Pedile acceso al responsable de la demostración.
        </small>
      </div>
    </main>
  );
}
