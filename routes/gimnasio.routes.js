const express = require("express");
const { rateLimit } = require("express-rate-limit");
const { verificarSesion } = require("../controllers/auth.controller");
const mediciones = require("../controllers/mediciones.controller");
const objetivos = require("../controllers/objetivos.controller");
const rutinas = require("../controllers/rutinas.controller");
const entrenamientos = require("../controllers/entrenamientos.controller");
const nutricion = require("../controllers/nutricion.controller");
const progreso = require("../controllers/progreso.controller");
const ia = require("../controllers/ia.controller");
const router = express.Router();
const limitarIA = rateLimit({
  windowMs: 60000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Esperá un minuto antes de hacer más consultas." },
});
router.use(verificarSesion);
router.get("/mediciones", mediciones.listarMediciones);
router.post("/mediciones/initial", mediciones.actualizarMedicion);
router.post("/mediciones", mediciones.actualizarMedicion);
router.get("/objetivos", objetivos.visuaizarObjetivo);
router.post("/objetivos", objetivos.definirObjeto);
router.post("/objetivos/:id/completar", objetivos.marcarCompletado);
router.delete("/objetivos/:id", objetivos.eliminarObjetivo);
router.get("/rutinas", rutinas.listarRutinas);
router.post("/rutinas", rutinas.actualizarRutina);
router.put("/rutinas/:id", rutinas.actualizarRutina);
router.delete("/rutinas/:id", rutinas.eliminarRutina);
router.get("/ejercicios", rutinas.listarEjercicios);
router.get("/entrenamientos", entrenamientos.listarEntrenamientos);
router.post("/entrenamientos", entrenamientos.iniciarEntrenamiento);
router.put("/entrenamientos/:id", entrenamientos.actualizarRegistro);
router.get("/dietas", nutricion.listarDietas);
router.post("/dietas", nutricion.actualizarDieta);
router.put("/dietas/:id", nutricion.actualizarDieta);
router.delete("/dietas/:id", nutricion.eliminarDieta);
router.get("/consumos", nutricion.verMacros);
router.post("/consumos", nutricion.registrarComida);
router.put("/consumos/:id", nutricion.registrarComida);
router.delete("/consumos/:id", nutricion.eliminarConsumo);
router.get("/progreso", progreso.verProgreso);
router.get("/ia/estado", ia.estadoIA);
router.post("/ia/consulta", limitarIA, ia.responderConsulta);
router.post("/ia/rutinas", limitarIA, ia.generarRutinaIA);
router.post("/ia/rutinas/:id/adaptar", limitarIA, ia.modificarRutinaIA);
router.get("/ia/conversaciones", ia.listarConversaciones);
router.get("/ia/conversaciones/:id", ia.verConversacion);
module.exports = router;
