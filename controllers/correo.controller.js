const nodemailer = require("nodemailer");
const fs = require("node:fs/promises");
const path = require("node:path");
const { tokenNuevo } = require("./seguridad.controller");

async function enviarRecuperacion(email, token) {
  const enlace =
    process.env.APP_ORIGIN + "/restablecer?token=" + encodeURIComponent(token);
  const texto =
    "Abrí este enlace para elegir una contraseña nueva: " +
    enlace +
    "\nVence en 30 minutos y se usa una sola vez.";
  if (process.env.SMTP_HOST) {
    const correo = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await correo.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Recuperar acceso a GYM-OS",
      text: texto,
    });
  } else {
    const carpeta = path.join(__dirname, "../.local/correos");
    await fs.mkdir(carpeta, { recursive: true, mode: 0o700 });
    await fs.writeFile(
      path.join(carpeta, tokenNuevo() + ".txt"),
      "Para: " + email + "\n" + texto,
      { mode: 0o600 },
    );
  }
}

module.exports = { enviarRecuperacion };
