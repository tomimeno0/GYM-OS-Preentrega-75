const { Op } = require("sequelize");
const { sequelize } = require("../config/db");
const { Dieta, DietaComida, ComidaConsumida, Objetivo } = require("../models");

function calcularMacros(alimentos) {
  if (
    !Array.isArray(alimentos) ||
    alimentos.length < 1 ||
    alimentos.length > 30
  )
    throw new Error("Cada comida debe tener de 1 a 30 alimentos.");
  const total = {
    calorias: 0,
    proteinas_g: 0,
    carbohidratos_g: 0,
    grasas_g: 0,
  };
  const lista = [];
  for (const alimento of alimentos) {
    if (
      !alimento ||
      typeof alimento.nombre !== "string" ||
      !alimento.nombre.trim() ||
      alimento.nombre.length > 150 ||
      !["g", "ml", "porcion"].includes(alimento.unidad) ||
      typeof alimento.cantidad !== "number" ||
      !Number.isFinite(alimento.cantidad) ||
      alimento.cantidad <= 0 ||
      alimento.cantidad > 10000
    )
      throw new Error("Revisá nombre, cantidad y unidad de cada alimento.");
    const a = {
      nombre: alimento.nombre.trim(),
      cantidad: alimento.cantidad,
      unidad: alimento.unidad,
    };
    for (const campo of Object.keys(total)) {
      const valor = alimento[campo];
      if (
        typeof valor !== "number" ||
        !Number.isFinite(valor) ||
        valor < 0 ||
        valor > (campo === "calorias" ? 10000 : 1000)
      )
        throw new Error("Los nutrientes deben ser números positivos o cero.");
      a[campo] = valor;
      total[campo] +=
        (valor * alimento.cantidad) / (alimento.unidad === "porcion" ? 1 : 100);
    }
    lista.push(a);
  }
  for (const campo of Object.keys(total))
    total[campo] =
      Math.round(total[campo] * (campo === "calorias" ? 1 : 100)) /
      (campo === "calorias" ? 1 : 100);
  if (
    total.calorias > 50000 ||
    total.proteinas_g > 9000 ||
    total.carbohidratos_g > 9000 ||
    total.grasas_g > 9000
  )
    throw new Error("Las cantidades totales son demasiado grandes.");
  return { ...total, alimentos: lista };
}
function datosComida(comida) {
  if (
    !comida ||
    typeof comida.nombre_comida !== "string" ||
    !comida.nombre_comida.trim() ||
    comida.nombre_comida.length > 100 ||
    !["desayuno", "almuerzo", "merienda", "cena", "colacion"].includes(
      comida.tipo_comida,
    )
  )
    throw new Error("Revisá nombre y tipo de comida.");
  return {
    nombre_comida: comida.nombre_comida.trim(),
    tipo_comida: comida.tipo_comida,
    ...calcularMacros(comida.alimentos),
  };
}
async function actualizarComida(dieta_id, comida, transaction) {
  const datos = datosComida(comida);
  if (
    typeof comida.hora !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(comida.hora)
  )
    throw new Error("La hora de la comida debe ser válida.");
  return DietaComida.create(
    { ...datos, dieta_id, hora: comida.hora, cantidad: 1, unidad: "porcion" },
    { transaction },
  );
}
async function listarDietas(req, res) {
  try {
    res.json({
      items: await Dieta.findAll({
        where: { usuario_id: req.user.id, estado: { [Op.ne]: "eliminada" } },
        include: { model: DietaComida, as: "comidas" },
        order: [["fecha_creacion", "DESC"]],
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "No se pudieron consultar las dietas." });
  }
}
async function actualizarDieta(req, res) {
  try {
    const {
      nombre,
      descripcion,
      objetivo_id,
      comidas,
      calorias_objetivo,
      proteinas_objetivo_g,
      carbohidratos_objetivo_g,
      grasas_objetivo_g,
    } = req.body;
    if (
      typeof nombre !== "string" ||
      nombre.trim().length < 2 ||
      nombre.length > 100 ||
      typeof descripcion !== "string" ||
      descripcion.length > 2000 ||
      !Array.isArray(comidas) ||
      !comidas.length ||
      comidas.length > 15
    )
      return res
        .status(400)
        .json({ message: "Revisá nombre, descripción y comidas." });
    for (const valor of [
      calorias_objetivo,
      proteinas_objetivo_g,
      carbohidratos_objetivo_g,
      grasas_objetivo_g,
    ])
      if (
        typeof valor !== "number" ||
        !Number.isFinite(valor) ||
        valor < 0 ||
        valor > 9000
      )
        return res
          .status(400)
          .json({
            message: "Revisá las metas de calorías y macros (0 a 9000).",
          });
    if (!Number.isInteger(calorias_objetivo))
      return res
        .status(400)
        .json({ message: "Las calorías objetivo deben ser enteras." });
    try {
      for (const comida of comidas) {
        datosComida(comida);
        if (
          typeof comida.hora !== "string" ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(comida.hora)
        )
          throw new Error("Revisá los horarios.");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    let dieta = req.params.id
      ? await Dieta.findOne({
          where: {
            id: req.params.id,
            usuario_id: req.user.id,
            estado: "activa",
          },
        })
      : null;
    if (req.params.id && !dieta)
      return res.status(404).json({ message: "Dieta no encontrada." });
    if (objetivo_id) {
      const objetivo = await Objetivo.findOne({
        where: { id: objetivo_id, usuario_id: req.user.id },
      });
      if (
        !objetivo ||
        (objetivo.estado !== "activo" &&
          (!dieta || dieta.objetivo_id !== objetivo_id))
      )
        return res
          .status(400)
          .json({ message: "Elegí un objetivo activo propio." });
    }
    await sequelize.transaction(async (transaction) => {
      const datos = {
        nombre: nombre.trim(),
        descripcion,
        objetivo_id: objetivo_id || null,
        calorias_objetivo,
        proteinas_objetivo_g,
        carbohidratos_objetivo_g,
        grasas_objetivo_g,
        fecha_actualizacion: new Date(),
      };
      if (dieta) {
        await dieta.update(datos, { transaction });
        await DietaComida.destroy({
          where: { dieta_id: dieta.id },
          transaction,
        });
      } else
        dieta = await Dieta.create(
          {
            ...datos,
            usuario_id: req.user.id,
            tipo_generacion: "manual",
            fecha_creacion: new Date(),
          },
          { transaction },
        );
      for (const comida of comidas)
        await actualizarComida(dieta.id, comida, transaction);
    });
    res.status(req.params.id ? 200 : 201).json(dieta);
  } catch (error) {
    res.status(500).json({ message: "No se pudo guardar la dieta." });
  }
}
async function eliminarDieta(req, res) {
  try {
    if (req.body.confirmar !== true)
      return res.status(400).json({ message: "Confirmá la baja de la dieta." });
    const dieta = await Dieta.findOne({
      where: { id: req.params.id, usuario_id: req.user.id, estado: "activa" },
    });
    if (!dieta)
      return res.status(404).json({ message: "Dieta no encontrada." });
    await dieta.update({
      estado: "eliminada",
      fecha_actualizacion: new Date(),
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "No se pudo dar de baja la dieta." });
  }
}
async function registrarComida(req, res) {
  try {
    let datos;
    try {
      datos = datosComida(req.body);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const fecha = new Date(req.body.fecha_consumo);
    if (
      typeof req.body.fecha_consumo !== "string" ||
      !Number.isFinite(fecha.getTime()) ||
      fecha > new Date() ||
      fecha.getUTCFullYear() < 2000
    )
      return res
        .status(400)
        .json({ message: "La fecha de consumo debe ser válida y no futura." });
    const campos = {
      nombre_comida: datos.nombre_comida,
      tipo_comida: datos.tipo_comida,
      fecha_consumo: fecha,
      cantidad_consumida: 1,
      unidad: "porcion",
      calorias_totales: datos.calorias,
      proteinas_totales_g: datos.proteinas_g,
      carbohidratos_totales_g: datos.carbohidratos_g,
      grasas_totales_g: datos.grasas_g,
      alimentos: datos.alimentos,
    };
    let comida;
    if (req.params.id) {
      comida = await ComidaConsumida.findOne({
        where: { id: req.params.id, usuario_id: req.user.id },
      });
      if (!comida)
        return res.status(404).json({ message: "Consumo no encontrado." });
      await comida.update(campos);
    } else
      comida = await ComidaConsumida.create({
        ...campos,
        usuario_id: req.user.id,
      });
    res.status(req.params.id ? 200 : 201).json(comida);
  } catch (error) {
    res.status(500).json({ message: "No se pudo guardar el consumo." });
  }
}
async function verMacros(req, res) {
  try {
    const formato = new Intl.DateTimeFormat("en-CA", {
      timeZone: req.user.zona_horaria,
    });
    const fecha = req.query.fecha || formato.format(new Date());
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
      !Number.isFinite(Date.parse(fecha)) ||
      new Date(fecha).toISOString().slice(0, 10) !== fecha
    )
      return res.status(400).json({ message: "Fecha no válida." });
    const consumos = await ComidaConsumida.findAll({
      where: { usuario_id: req.user.id },
      order: [["fecha_consumo", "DESC"]],
    });
    const items = consumos.filter(
      (c) => formato.format(c.fecha_consumo) === fecha,
    );
    const totales = {
      calorias: 0,
      proteinas_g: 0,
      carbohidratos_g: 0,
      grasas_g: 0,
    };
    for (const c of items) {
      totales.calorias += c.calorias_totales;
      totales.proteinas_g += c.proteinas_totales_g;
      totales.carbohidratos_g += c.carbohidratos_totales_g;
      totales.grasas_g += c.grasas_totales_g;
    }
    for (const campo of Object.keys(totales))
      totales[campo] = Math.round(totales[campo] * 100) / 100;
    const dieta = await Dieta.findOne({
      where: { usuario_id: req.user.id, estado: "activa" },
      order: [
        ["fecha_actualizacion", "DESC"],
        ["fecha_creacion", "DESC"],
      ],
    });
    res.json({ fecha, items, totales, dieta });
  } catch (error) {
    res.status(500).json({ message: "No se pudieron consultar los macros." });
  }
}
async function eliminarConsumo(req, res) {
  try {
    if (req.body.confirmar !== true)
      return res.status(400).json({ message: "Confirmá la eliminación." });
    const comida = await ComidaConsumida.findOne({
      where: { id: req.params.id, usuario_id: req.user.id },
    });
    if (!comida)
      return res.status(404).json({ message: "Consumo no encontrado." });
    await comida.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "No se pudo eliminar el consumo." });
  }
}
module.exports = {
  calcularMacros,
  actualizarComida,
  listarDietas,
  actualizarDieta,
  eliminarDieta,
  registrarComida,
  verMacros,
  eliminarConsumo,
};
