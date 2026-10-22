const { MedicionFisica } = require("../models");
const { registrarEvento } = require("./bitacora.controller");

function cambiarPeso(peso) {
  if (
    typeof peso !== "number" ||
    !Number.isFinite(peso) ||
    peso < 20 ||
    peso > 400
  )
    throw new Error("El peso debe estar entre 20 y 400 kg.");
  return peso;
}
function cambiarAltura(altura) {
  if (
    typeof altura !== "number" ||
    !Number.isFinite(altura) ||
    altura < 80 ||
    altura > 250
  )
    throw new Error("La altura debe estar entre 80 y 250 cm.");
  return altura;
}
function cambiarPorcMusculo(porcentaje) {
  if (
    porcentaje !== null &&
    (typeof porcentaje !== "number" ||
      !Number.isFinite(porcentaje) ||
      porcentaje < 0 ||
      porcentaje > 100)
  )
    throw new Error("El porcentaje muscular no es válido.");
  return porcentaje;
}
function cambiarPorcGraso(porcentaje) {
  if (
    porcentaje !== null &&
    (typeof porcentaje !== "number" ||
      !Number.isFinite(porcentaje) ||
      porcentaje < 0 ||
      porcentaje > 70)
  )
    throw new Error("El porcentaje de grasa no es válido.");
  return porcentaje;
}
function cambiarNivelActividad(nivel) {
  if (!["baja", "media", "alta"].includes(nivel))
    throw new Error("Elegí actividad baja, media o alta.");
  return nivel;
}

async function actualizarMedicion(req, res) {
  try {
    const datos = req.body;
    const peso_kg = cambiarPeso(datos.peso_kg);
    const altura_cm = cambiarAltura(datos.altura_cm);
    const grasa_corporal = cambiarPorcGraso(datos.grasa_corporal ?? null);
    const musculo_corporal = cambiarPorcMusculo(datos.musculo_corporal ?? null);
    const nivel_actividad = cambiarNivelActividad(datos.nivel_actividad);
    if (
      grasa_corporal !== null &&
      musculo_corporal !== null &&
      grasa_corporal + musculo_corporal > 100
    )
      return res
        .status(400)
        .json({ message: "Grasa y músculo no pueden sumar más de 100 %." });
    const fecha = datos.fecha_medicion
      ? new Date(datos.fecha_medicion)
      : new Date();
    if (!Number.isFinite(fecha.getTime()) || fecha > new Date())
      return res
        .status(400)
        .json({ message: "La fecha no es válida o está en el futuro." });
    const anterior = await MedicionFisica.findOne({
      where: { usuario_id: req.user.id },
      order: [["fecha_medicion", "DESC"]],
    });
    const inicial = req.path.endsWith("/initial");
    if (inicial && anterior)
      return res
        .status(409)
        .json({ message: "Ya cargaste las medidas iniciales." });
    if (!inicial && !anterior)
      return res
        .status(409)
        .json({ message: "Primero cargá las medidas iniciales." });
    if (anterior && fecha <= anterior.fecha_medicion)
      return res
        .status(400)
        .json({ message: "La medición debe ser posterior a la anterior." });
    for (const campo of ["cintura_cm", "pecho_cm", "brazos_cm", "piernas_cm"]) {
      if (
        datos[campo] !== undefined &&
        datos[campo] !== null &&
        (typeof datos[campo] !== "number" ||
          !Number.isFinite(datos[campo]) ||
          datos[campo] <= 0 ||
          datos[campo] > 300)
      )
        return res
          .status(400)
          .json({ message: "Revisá los perímetros corporales." });
    }
    const medicion = await MedicionFisica.create({
      usuario_id: req.user.id,
      usuario_inicial: inicial ? req.user.id : null,
      peso_kg,
      altura_cm,
      grasa_corporal,
      musculo_corporal,
      nivel_actividad,
      fecha_medicion: fecha,
      cintura_cm: datos.cintura_cm ?? null,
      pecho_cm: datos.pecho_cm ?? null,
      brazos_cm: datos.brazos_cm ?? null,
      piernas_cm: datos.piernas_cm ?? null,
    });
    await registrarEvento(
      req.user.id,
      inicial ? "CU007_MEDIDAS_INICIALES" : "CU008_MEDIDAS",
      "mediciones",
    );
    res.status(201).json(medicion);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res
        .status(409)
        .json({ message: "Ya existe una medición inicial." });
    if (error.name === "Error")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "No se pudo guardar la medición." });
  }
}

async function listarMediciones(req, res) {
  try {
    const items = await MedicionFisica.findAll({
      where: { usuario_id: req.user.id },
      order: [["fecha_medicion", "DESC"]],
    });
    res.json({ items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron consultar las mediciones." });
  }
}

module.exports = {
  actualizarMedicion,
  listarMediciones,
  cambiarPeso,
  cambiarAltura,
  cambiarPorcMusculo,
  cambiarPorcGraso,
  cambiarNivelActividad,
};
