const { sequelize } = require("../config/db");
const {
  Rutina,
  RutinaEjercicio,
  Entrenamiento,
  EntrenamientoEjercicio,
} = require("../models");

async function listarEntrenamientos(req, res) {
  try {
    const items = await Entrenamiento.findAll({
      where: { usuario_id: req.user.id },
      include: { model: EntrenamientoEjercicio, as: "ejercicios" },
      order: [["fecha_inicio", "DESC"]],
    });
    for (const item of items) item.ejercicios.sort((a, b) => a.orden - b.orden);
    res.json({ items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron consultar los entrenamientos." });
  }
}
async function iniciarEntrenamiento(req, res) {
  try {
    const { rutina_id, dia_semana } = req.body;
    if (
      typeof rutina_id !== "string" ||
      !Number.isInteger(dia_semana) ||
      dia_semana < 1 ||
      dia_semana > 7
    )
      return res.status(400).json({ message: "Elegí rutina y día." });
    const rutina = await Rutina.findOne({
      where: { id: rutina_id, usuario_id: req.user.id, estado: "activa" },
    });
    if (!rutina)
      return res.status(404).json({ message: "Rutina no encontrada." });
    const ejercicios = await RutinaEjercicio.findAll({
      where: { rutina_id, dia_semana },
      order: [["orden", "ASC"]],
    });
    if (!ejercicios.length)
      return res
        .status(400)
        .json({ message: "No hay ejercicios para ese día." });
    if (
      await Entrenamiento.findOne({
        where: { usuario_id: req.user.id, estado: "iniciado" },
      })
    )
      return res
        .status(409)
        .json({ message: "Ya tenés un entrenamiento en curso." });
    let entrenamiento;
    await sequelize.transaction(async (transaction) => {
      entrenamiento = await Entrenamiento.create(
        {
          usuario_id: req.user.id,
          usuario_en_curso: req.user.id,
          rutina_id,
          dia_semana,
          fecha: new Intl.DateTimeFormat("en-CA", {
            timeZone: req.user.zona_horaria,
          }).format(new Date()),
          fecha_inicio: new Date(),
        },
        { transaction },
      );
      for (const e of ejercicios)
        await EntrenamientoEjercicio.create(
          {
            entrenamiento_id: entrenamiento.id,
            nombre_ejercicio: e.nombre_ejercicio,
            ejercicio_id: e.ejercicio_id,
            orden: e.orden,
            series: e.series,
            repeticiones: e.repeticiones,
            peso_utilizado_kg: e.peso_sugerido_kg,
          },
          { transaction },
        );
    });
    res.status(201).json(entrenamiento);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res
        .status(409)
        .json({ message: "Ya tenés un entrenamiento en curso." });
    res.status(500).json({ message: "No se pudo iniciar el entrenamiento." });
  }
}
async function actualizarRegistro(req, res) {
  try {
    const entrenamiento = await Entrenamiento.findOne({
      where: { id: req.params.id, usuario_id: req.user.id },
    });
    if (!entrenamiento)
      return res.status(404).json({ message: "Entrenamiento no encontrado." });
    if (entrenamiento.estado !== "iniciado")
      return res
        .status(409)
        .json({ message: "El entrenamiento ya está cerrado." });
    const { estado, ejercicios, observaciones, distancia_km } = req.body;
    if (
      !["iniciado", "completado", "incompleto", "cancelado"].includes(estado) ||
      (estado !== "iniciado" && req.body.confirmar !== true) ||
      typeof observaciones !== "string" ||
      observaciones.length > 2000 ||
      typeof distancia_km !== "number" ||
      !Number.isFinite(distancia_km) ||
      distancia_km < 0 ||
      distancia_km > 1000 ||
      !Array.isArray(ejercicios)
    )
      return res
        .status(400)
        .json({ message: "Revisá el registro y confirmá el cierre." });
    const originales = await EntrenamientoEjercicio.findAll({
      where: { entrenamiento_id: entrenamiento.id },
    });
    const ids = [];
    for (const e of ejercicios) {
      if (
        !e ||
        !originales.some((o) => o.id === e.id) ||
        ids.includes(e.id) ||
        typeof e.realizado !== "boolean" ||
        !Number.isInteger(e.series) ||
        e.series < 1 ||
        e.series > 20 ||
        !Number.isInteger(e.repeticiones) ||
        e.repeticiones < 1 ||
        e.repeticiones > 200 ||
        typeof e.peso_utilizado_kg !== "number" ||
        !Number.isFinite(e.peso_utilizado_kg) ||
        e.peso_utilizado_kg < 0 ||
        e.peso_utilizado_kg > 600
      )
        return res
          .status(400)
          .json({ message: "Los ejercicios del registro no son válidos." });
      ids.push(e.id);
    }
    if (
      ejercicios.length !== originales.length ||
      (estado === "completado" && ejercicios.some((e) => !e.realizado)) ||
      (estado === "incompleto" && !ejercicios.some((e) => e.realizado))
    )
      return res.status(400).json({
        message:
          "Completado requiere todos los ejercicios; incompleto, al menos uno.",
      });
    await sequelize.transaction(async (transaction) => {
      const actual = await Entrenamiento.findOne({
        where: { id: entrenamiento.id, usuario_id: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (actual.estado !== "iniciado") throw new Error("Cerrado");
      for (const e of ejercicios)
        await EntrenamientoEjercicio.update(
          {
            realizado: e.realizado,
            series: e.series,
            repeticiones: e.repeticiones,
            peso_utilizado_kg: e.peso_utilizado_kg,
          },
          { where: { id: e.id, entrenamiento_id: actual.id }, transaction },
        );
      await actual.update(
        {
          estado,
          observaciones,
          distancia_km,
          fecha_fin: estado === "iniciado" ? null : new Date(),
          usuario_en_curso: estado === "iniciado" ? req.user.id : null,
        },
        { transaction },
      );
    });
    res.json({ message: "Entrenamiento guardado." });
  } catch (error) {
    res
      .status(error.message === "Cerrado" ? 409 : 500)
      .json({ message: "No se pudo actualizar el entrenamiento." });
  }
}
module.exports = {
  listarEntrenamientos,
  iniciarEntrenamiento,
  actualizarRegistro,
};
