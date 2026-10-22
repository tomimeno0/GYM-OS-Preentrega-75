const express = require("express");
const { rateLimit } = require("express-rate-limit");
const { verificarSesion } = require("../controllers/auth.controller");
const usuarios = require("../controllers/usuarios.controller");
const router = express.Router();
const limitarAcceso = rateLimit({
  windowMs: 15 * 60000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Esperá unos minutos." },
});
router.post("/registro", limitarAcceso, usuarios.registrarUsuario);
router.post("/login", limitarAcceso, usuarios.iniciarSesion);
router.post("/recuperar", limitarAcceso, usuarios.recuperarPassword);
router.post("/restablecer", limitarAcceso, usuarios.restablecerPassword);
router.get("/cuenta", verificarSesion, usuarios.verCuenta);
router.put("/cuenta", verificarSesion, usuarios.actualizarDatos);
router.delete("/cuenta", verificarSesion, usuarios.eliminarCuenta);
router.post("/logout", verificarSesion, usuarios.cerrarSesion);
module.exports = router;
