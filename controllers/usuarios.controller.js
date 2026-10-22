const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db");
const { Usuario, Rol, UsuarioRol, Sesion, Recuperacion } = require("../models");
const {
  encriptarIrreversible,
  compararPassword,
  tokenNuevo,
  hashToken,
  encriptarRreversible,
  desencriptar,
} = require("./seguridad.controller");
const { enviarRecuperacion } = require("./correo.controller");
const { registrarEvento } = require("./bitacora.controller");

function datosPublicos(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: desencriptar(usuario.telefono_cifrado),
    genero: usuario.genero,
    fecha_nacimiento: usuario.fecha_nacimiento,
    zona_horaria: usuario.zona_horaria,
    consentimiento_ia: usuario.consentimiento_ia,
  };
}

async function abrirSesion(usuario, res, transaction) {
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
    jwtid: tokenNuevo(),
  });
  await Sesion.create(
    {
      usuario_id: usuario.id,
      token_hash: hashToken(token),
      fecha_creacion: new Date(),
      fecha_expiracion: new Date(Date.now() + 8 * 3600000),
    },
    { transaction },
  );
  res.cookie("gymos75", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 3600000,
    path: "/",
  });
}

async function registrarUsuario(req, res) {
  try {
    const { nombre, apellido, email, password } = req.body;
    if (
      typeof nombre !== "string" ||
      nombre.trim().length < 2 ||
      nombre.length > 100 ||
      (apellido !== undefined &&
        (typeof apellido !== "string" || apellido.length > 100))
    )
      return res.status(400).json({ message: "Revisá nombre y apellido." });
    if (
      typeof email !== "string" ||
      email.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 10 ||
      Buffer.byteLength(password) > 72
    )
      return res
        .status(400)
        .json({
          message:
            "Ingresá un correo válido y una contraseña de 10 a 72 caracteres.",
        });
    const correo = email.trim().toLowerCase();
    if (await Usuario.findOne({ where: { email: correo } }))
      return res
        .status(409)
        .json({ message: "Ese correo ya está registrado." });
    const password_hash = await encriptarIrreversible(password);
    let usuario;
    await sequelize.transaction(async (transaction) => {
      usuario = await Usuario.create(
        {
          nombre: nombre.trim(),
          apellido: apellido || "",
          email: correo,
          password_hash,
          fecha_registro: new Date(),
        },
        { transaction },
      );
      const rol = await Rol.findOne({
        where: { nombre: "Cliente" },
        transaction,
      });
      if (!rol) throw new Error("Falta inicializar el rol Cliente");
      await UsuarioRol.create(
        {
          usuario_id: usuario.id,
          rol_id: rol.id,
          fecha_asignacion: new Date(),
        },
        { transaction },
      );
      await abrirSesion(usuario, res, transaction);
      await registrarEvento(
        usuario.id,
        "CU001_REGISTRO",
        "cuentas",
        transaction,
      );
    });
    res.status(201).json({ user: datosPublicos(usuario) });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res
        .status(409)
        .json({ message: "Ese correo ya está registrado." });
    res.status(500).json({ message: "No se pudo registrar la cuenta." });
  }
}

async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      Buffer.byteLength(password) > 72
    )
      return res.status(400).json({ message: "Ingresá correo y contraseña." });
    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase(), estado: "activo" },
    });
    if (!usuario || !(await compararPassword(password, usuario.password_hash)))
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos." });
    await sequelize.transaction(async (transaction) => {
      await usuario.update({ ultima_conexion: new Date() }, { transaction });
      await abrirSesion(usuario, res, transaction);
      await registrarEvento(usuario.id, "CU002_LOGIN", "cuentas", transaction);
    });
    res.json({ user: datosPublicos(usuario) });
  } catch (error) {
    res.status(500).json({ message: "No se pudo iniciar sesión." });
  }
}

async function cerrarSesion(req, res) {
  try {
    if (req.body.confirmar !== true)
      return res.status(400).json({ message: "Confirmá el cierre de sesión." });
    await Sesion.destroy({
      where: {
        usuario_id: req.user.id,
        token_hash: hashToken(req.cookies.gymos75),
      },
    });
    res.clearCookie("gymos75", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "No se pudo cerrar la sesión." });
  }
}

function verCuenta(req, res) {
  res.json({ user: datosPublicos(req.user) });
}

async function actualizarDatos(req, res) {
  try {
    const {
      nombre,
      apellido,
      telefono,
      genero,
      fecha_nacimiento,
      zona_horaria,
      consentimiento_ia,
    } = req.body;
    if (
      typeof nombre !== "string" ||
      nombre.trim().length < 2 ||
      nombre.length > 100 ||
      typeof apellido !== "string" ||
      apellido.length > 100 ||
      typeof telefono !== "string" ||
      telefono.length > 40 ||
      !["masculino", "femenino", "otro"].includes(genero) ||
      typeof consentimiento_ia !== "boolean" ||
      typeof zona_horaria !== "string" ||
      zona_horaria.length > 80
    )
      return res.status(400).json({ message: "Revisá los datos del perfil." });
    if (
      fecha_nacimiento &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento) ||
        !Number.isFinite(Date.parse(fecha_nacimiento)) ||
        new Date(fecha_nacimiento).toISOString().slice(0, 10) !==
          fecha_nacimiento ||
        new Date(fecha_nacimiento) > new Date())
    )
      return res
        .status(400)
        .json({ message: "La fecha de nacimiento no es válida." });
    try {
      new Intl.DateTimeFormat("es", { timeZone: zona_horaria }).format();
    } catch (error) {
      return res.status(400).json({ message: "La zona horaria no es válida." });
    }
    await req.user.update({
      nombre: nombre.trim(),
      apellido,
      telefono_cifrado: encriptarRreversible(telefono),
      genero,
      fecha_nacimiento: fecha_nacimiento || null,
      zona_horaria,
      consentimiento_ia,
    });
    await registrarEvento(req.user.id, "CU005_PERFIL", "cuentas");
    res.json({ user: datosPublicos(req.user) });
  } catch (error) {
    res.status(500).json({ message: "No se pudo guardar el perfil." });
  }
}

async function eliminarCuenta(req, res) {
  try {
    if (
      req.body.confirmar !== true ||
      typeof req.body.password !== "string" ||
      !(await compararPassword(req.body.password, req.user.password_hash))
    )
      return res
        .status(403)
        .json({ message: "Confirmá la eliminación con tu contraseña actual." });
    await sequelize.transaction(async (transaction) => {
      await registrarEvento(
        null,
        "CU006_ELIMINAR_CUENTA",
        "cuentas",
        transaction,
      );
      await req.user.destroy({ transaction });
    });
    res.clearCookie("gymos75", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "No se pudo eliminar la cuenta." });
  }
}

async function recuperarPassword(req, res) {
  try {
    if (typeof req.body.email !== "string" || req.body.email.length > 150)
      return res.status(400).json({ message: "Ingresá un correo válido." });
    const usuario = await Usuario.findOne({
      where: { email: req.body.email.trim().toLowerCase(), estado: "activo" },
    });
    if (usuario) {
      const token = tokenNuevo();
      await Recuperacion.destroy({ where: { usuario_id: usuario.id } });
      await Recuperacion.create({
        usuario_id: usuario.id,
        token_hash: hashToken(token),
        fecha_creacion: new Date(),
        fecha_expiracion: new Date(Date.now() + 30 * 60000),
      });
      await enviarRecuperacion(usuario.email, token);
    }
    res.json({
      message: "Si la cuenta existe, se generó un enlace de recuperación.",
    });
  } catch (error) {
    res
      .status(503)
      .json({ message: "No se pudo generar el enlace. Probá más tarde." });
  }
}

async function restablecerPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (
      typeof token !== "string" ||
      token.length !== 64 ||
      typeof password !== "string" ||
      password.length < 10 ||
      Buffer.byteLength(password) > 72
    )
      return res
        .status(400)
        .json({ message: "Revisá el enlace y la contraseña nueva." });
    const recuperacion = await Recuperacion.findOne({
      where: {
        token_hash: hashToken(token),
        usado: false,
        fecha_expiracion: { [Op.gt]: new Date() },
      },
    });
    if (!recuperacion)
      return res
        .status(400)
        .json({ message: "El enlace ya fue usado o venció." });
    const password_hash = await encriptarIrreversible(password);
    await sequelize.transaction(async (transaction) => {
      const [cantidad] = await Recuperacion.update(
        { usado: true },
        {
          where: {
            id: recuperacion.id,
            usado: false,
            fecha_expiracion: { [Op.gt]: new Date() },
          },
          transaction,
        },
      );
      if (cantidad !== 1) throw new Error("Enlace usado");
      await Usuario.update(
        { password_hash },
        {
          where: { id: recuperacion.usuario_id, estado: "activo" },
          transaction,
        },
      );
      await Sesion.destroy({
        where: { usuario_id: recuperacion.usuario_id },
        transaction,
      });
      await registrarEvento(
        recuperacion.usuario_id,
        "CU004_RECUPERAR",
        "cuentas",
        transaction,
      );
    });
    res.json({ message: "Contraseña actualizada. Volvé a ingresar." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "No se pudo usar el enlace. Pedí uno nuevo." });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  verCuenta,
  actualizarDatos,
  eliminarCuenta,
  recuperarPassword,
  restablecerPassword,
  datosPublicos,
};
