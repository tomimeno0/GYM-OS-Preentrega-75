const { Op } = require("sequelize");
const {
  MedicionFisica,
  Objetivo,
  Entrenamiento,
  Rutina,
  Dieta,
} = require("../models");
function calcularPorcentaje(inicial, actual, meta) {
  if (inicial === meta) return actual === meta ? 100 : 0;
  return (
    Math.round(
      Math.max(
        0,
        Math.min(100, ((actual - inicial) / (meta - inicial)) * 100),
      ) * 10,
    ) / 10
  );
}
async function verProgreso(req, res) {
  try {
    const mediciones = await MedicionFisica.findAll({
      where: { usuario_id: req.user.id },
      order: [["fecha_medicion", "ASC"]],
    });
    const objetivos = await Objetivo.findAll({
      where: { usuario_id: req.user.id, estado: { [Op.ne]: "eliminado" } },
      order: [["fecha_inicio", "DESC"]],
    });
    const entrenamientos = await Entrenamiento.findAll({
      where: { usuario_id: req.user.id, estado: "completado" },
      order: [["fecha", "DESC"]],
    });
    const hoy = new Intl.DateTimeFormat("en-CA", {
      timeZone: req.user.zona_horaria,
    }).format(new Date());
    const avances = [];
    for (const o of objetivos) {
      const fin = o.fecha_completado || hoy;
      const hasta = o.fecha_cierre || new Date();
      const sesiones = entrenamientos.filter(
        (e) => e.fecha_fin && e.fecha_fin <= hasta,
      );
      const medidas = mediciones.filter(
        (m) =>
          m.fecha_medicion <= hasta &&
          new Intl.DateTimeFormat("en-CA", {
            timeZone: req.user.zona_horaria,
          }).format(m.fecha_medicion) <= fin,
      );
      const ultima = medidas[medidas.length - 1];
      let actual = o.valor_inicial;
      if (o.tipo === "mejorar_resistencia")
        actual = Math.max(
          0,
          ...sesiones
            .filter((e) => e.fecha >= o.fecha_inicio && e.fecha <= fin)
            .map((e) => e.distancia_km || 0),
        );
      else if (o.tipo === "aumentar_frecuencia_entrenamiento") {
        const inicioSemana = new Date(fin + "T12:00:00Z");
        inicioSemana.setUTCDate(
          inicioSemana.getUTCDate() - ((inicioSemana.getUTCDay() + 6) % 7),
        );
        const desde = inicioSemana.toISOString().slice(0, 10);
        actual = sesiones.filter(
          (e) =>
            e.fecha >= desde && e.fecha >= o.fecha_inicio && e.fecha <= fin,
        ).length;
      } else if (ultima)
        actual = o.tipo === "definir" ? ultima.grasa_corporal : ultima.peso_kg;
      avances.push({
        ...o.toJSON(),
        valor_actual: actual,
        porcentaje:
          actual === null
            ? 0
            : calcularPorcentaje(o.valor_inicial, actual, o.valor_objetivo),
      });
    }
    res.json({
      mediciones,
      objetivos: avances,
      entrenamientos_completados: entrenamientos.length,
      rutinas: await Rutina.count({
        where: { usuario_id: req.user.id, estado: "activa" },
      }),
      dietas: await Dieta.count({
        where: { usuario_id: req.user.id, estado: "activa" },
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "No se pudo consultar el progreso." });
  }
}
module.exports = { verProgreso, calcularPorcentaje };
