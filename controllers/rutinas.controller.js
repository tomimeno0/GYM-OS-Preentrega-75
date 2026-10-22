const { Op } = require("sequelize");
const { sequelize } = require("../config/db");
const {
  Rutina,
  RutinaEjercicio,
  Objetivo,
  Entrenamiento,
} = require("../models");
const catalogo = require("../models/exercises/exercises.json");

function validarEjercicios(ejercicios) {
  if (
    !Array.isArray(ejercicios) ||
    ejercicios.length < 1 ||
    ejercicios.length > 80
  )
    throw new Error("Ingresá entre 1 y 80 ejercicios.");
  const posiciones = [];
  return ejercicios.map((e, i) => {
    if (!e || typeof e !== "object") throw new Error("Revisá los ejercicios.");
    const ficha = e.ejercicio_id
      ? catalogo.find((item) => item.id === e.ejercicio_id)
      : null;
    if (e.ejercicio_id && !ficha)
      throw new Error("Un ejercicio no existe en el catálogo.");
    const nombre = ficha ? ficha.name : e.nombre_ejercicio;
    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.length > 150 ||
      !Number.isInteger(e.dia_semana) ||
      e.dia_semana < 1 ||
      e.dia_semana > 7 ||
      !Number.isInteger(e.series) ||
      e.series < 1 ||
      e.series > 20 ||
      !Number.isInteger(e.repeticiones) ||
      e.repeticiones < 1 ||
      e.repeticiones > 200
    )
      throw new Error("Revisá nombre, día, series y repeticiones.");
    if (
      typeof e.peso_sugerido_kg !== "number" ||
      !Number.isFinite(e.peso_sugerido_kg) ||
      e.peso_sugerido_kg < 0 ||
      e.peso_sugerido_kg > 600 ||
      !Number.isInteger(e.descanso_segundos) ||
      e.descanso_segundos < 0 ||
      e.descanso_segundos > 900 ||
      (e.observaciones &&
        (typeof e.observaciones !== "string" || e.observaciones.length > 1000))
    )
      throw new Error("Revisá peso, descanso y observaciones.");
    const orden = e.orden === undefined ? i : e.orden;
    if (
      !Number.isInteger(orden) ||
      orden < 0 ||
      orden > 1000 ||
      posiciones.includes(e.dia_semana + ":" + orden)
    )
      throw new Error("El orden se repite dentro de un día.");
    posiciones.push(e.dia_semana + ":" + orden);
    return {
      ejercicio_id: ficha ? ficha.id : null,
      nombre_ejercicio: nombre.trim(),
      grupo_muscular: ficha ? ficha.body_part : "",
      dia_semana: e.dia_semana,
      orden,
      series: e.series,
      repeticiones: e.repeticiones,
      peso_sugerido_kg: e.peso_sugerido_kg,
      descanso_segundos: e.descanso_segundos,
      observaciones: e.observaciones || "",
    };
  });
}

async function agregarEjercicio(rutina_id, datos, transaction) {
  return RutinaEjercicio.create({ ...datos, rutina_id }, { transaction });
}
async function eliminarEjercicio(rutina_id, transaction) {
  return RutinaEjercicio.destroy({ where: { rutina_id }, transaction });
}
async function actualizarRutinaEjercicio(rutina_id, ejercicios, transaction) {
  await eliminarEjercicio(rutina_id, transaction);
  for (const ejercicio of ejercicios)
    await agregarEjercicio(rutina_id, ejercicio, transaction);
}
async function guardarRutina(
  usuario_id,
  datos,
  ejercicios,
  rutina,
  transaction,
) {
  if (rutina) await rutina.update(datos, { transaction });
  else
    rutina = await Rutina.create(
      { ...datos, usuario_id, fecha_creacion: new Date() },
      { transaction },
    );
  await actualizarRutinaEjercicio(rutina.id, ejercicios, transaction);
  return rutina;
}
async function listarRutinas(req, res) {
  try {
    const registros = await Rutina.findAll({
      where: { usuario_id: req.user.id, estado: { [Op.ne]: "eliminada" } },
      include: { model: RutinaEjercicio, as: "ejercicios" },
      order: [["fecha_creacion", "DESC"]],
    });
    const items = registros.map((r) => r.toJSON());
    for (const item of items) {
      for (const e of item.ejercicios) e.dia_semana = Number(e.dia_semana);
      item.ejercicios.sort(
        (a, b) => a.dia_semana - b.dia_semana || a.orden - b.orden,
      );
    }
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "No se pudieron consultar las rutinas." });
  }
}
async function actualizarRutina(req, res) {
  try {
    const { nombre, descripcion, objetivo_id } = req.body;
    if (
      typeof nombre !== "string" ||
      nombre.trim().length < 2 ||
      nombre.length > 100 ||
      (descripcion !== undefined &&
        (typeof descripcion !== "string" || descripcion.length > 2000))
    )
      return res.status(400).json({ message: "Revisá nombre y descripción." });
    let ejercicios;
    try {
      ejercicios = validarEjercicios(req.body.ejercicios);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    let rutina = req.params.id
      ? await Rutina.findOne({
          where: {
            id: req.params.id,
            usuario_id: req.user.id,
            estado: "activa",
          },
        })
      : null;
    if (req.params.id && !rutina)
      return res.status(404).json({ message: "Rutina no encontrada." });
    if (objetivo_id) {
      const objetivo = await Objetivo.findOne({
        where: { id: objetivo_id, usuario_id: req.user.id },
      });
      if (
        !objetivo ||
        (objetivo.estado !== "activo" &&
          (!rutina || rutina.objetivo_id !== objetivo_id))
      )
        return res
          .status(400)
          .json({ message: "Elegí un objetivo activo propio." });
    }
    await sequelize.transaction(async (transaction) => {
      rutina = await guardarRutina(
        req.user.id,
        {
          nombre: nombre.trim(),
          descripcion: descripcion || "",
          objetivo_id: objetivo_id || null,
          tipo_generacion: rutina ? rutina.tipo_generacion : "manual",
          fecha_actualizacion: new Date(),
        },
        ejercicios,
        rutina,
        transaction,
      );
    });
    res.status(req.params.id ? 200 : 201).json(rutina);
  } catch (error) {
    res.status(500).json({ message: "No se pudo guardar la rutina." });
  }
}
async function eliminarRutina(req, res) {
  try {
    if (req.body.confirmar !== true)
      return res.status(400).json({ message: "Confirmá la baja." });
    const rutina = await Rutina.findOne({
      where: { id: req.params.id, usuario_id: req.user.id, estado: "activa" },
    });
    if (!rutina)
      return res.status(404).json({ message: "Rutina no encontrada." });
    if (
      await Entrenamiento.findOne({
        where: {
          rutina_id: rutina.id,
          usuario_id: req.user.id,
          estado: "iniciado",
        },
      })
    )
      return res
        .status(409)
        .json({ message: "Terminá primero el entrenamiento en curso." });
    await rutina.update({
      estado: "eliminada",
      fecha_actualizacion: new Date(),
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "No se pudo dar de baja la rutina." });
  }
}
function listarEjercicios(req, res) {
  const texto = String(req.query.buscar || "")
    .toLowerCase()
    .slice(0, 100);
  const grupo = String(req.query.grupo || "");
  const pagina = Math.max(
    1,
    Math.min(1000, parseInt(req.query.pagina, 10) || 1),
  );
  const encontrados = catalogo.filter(
    (e) =>
      (!texto ||
        e.name.toLowerCase().includes(texto) ||
        e.body_part.toLowerCase().includes(texto)) &&
      (!grupo || e.body_part === grupo),
  );
  const grupos = [];
  for (const e of catalogo)
    if (!grupos.includes(e.body_part)) grupos.push(e.body_part);
  res.json({
    items: encontrados.slice((pagina - 1) * 24, pagina * 24),
    total: encontrados.length,
    pagina,
    grupos: grupos.sort(),
  });
}
module.exports = {
  listarRutinas,
  actualizarRutina,
  eliminarRutina,
  listarEjercicios,
  validarEjercicios,
  agregarEjercicio,
  eliminarEjercicio,
  actualizarRutinaEjercicio,
  guardarRutina,
};
