# Operaciones UML y secuencias

Esta tabla enlaza nombres con implementaciones reales del corte. Las clases del documento se usan como agrupación conceptual; esta versión no implementa esa jerarquía ni clases delegadoras. Los nombres con errores de escritura se conservan para identificarlos.

| Agrupación original | Operación | Implementación en esta copia |
| --- | --- | --- |
| Usuario | `iniciarSesion` | [usuarios.controller.js](../controllers/usuarios.controller.js#L127) |
| Usuario | `cerrarSesion` | [usuarios.controller.js](../controllers/usuarios.controller.js#L154) |
| Usuario | `recuperarPassword` | [usuarios.controller.js](../controllers/usuarios.controller.js#L258) |
| Administrador | `crearRoles` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Administrador | `asignarRoles` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Administrador | `modificarRoles` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Administrador | `activarUsuario` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Administrador | `bloquearUsuario` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Administrador | `eliminarUsuario` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Cliente | `actualizarDatos` | [usuarios.controller.js](../controllers/usuarios.controller.js#L175) |
| Cliente | `verProgreso` | [progreso.controller.js](../controllers/progreso.controller.js#L20) |
| PerfilFisico | `cambiarPeso` | [mediciones.controller.js](../controllers/mediciones.controller.js#L4) |
| PerfilFisico | `cambiarAltura` | [mediciones.controller.js](../controllers/mediciones.controller.js#L14) |
| PerfilFisico | `cambiarPorcMusculo` | [mediciones.controller.js](../controllers/mediciones.controller.js#L24) |
| PerfilFisico | `cambiarPorcGraso` | [mediciones.controller.js](../controllers/mediciones.controller.js#L35) |
| PerfilFisico | `cambiarNivelActividad` | [mediciones.controller.js](../controllers/mediciones.controller.js#L46) |
| Objetivo | `definirObjeto` | [objetivos.controller.js](../controllers/objetivos.controller.js#L22) |
| Objetivo | `visuaizarObjetivo` | [objetivos.controller.js](../controllers/objetivos.controller.js#L5) |
| Objetivo | `marcarCompletado` | [objetivos.controller.js](../controllers/objetivos.controller.js#L172) |
| Objetivo | `eliminarObjetivo` | [objetivos.controller.js](../controllers/objetivos.controller.js#L201) |
| MedicionCorporal | `actualizarMedicion` | [mediciones.controller.js](../controllers/mediciones.controller.js#L52) |
| Rutina | `agregarEjercicio` | [rutinas.controller.js](../controllers/rutinas.controller.js#L78) |
| Rutina | `eliminarEjercicio` | [rutinas.controller.js](../controllers/rutinas.controller.js#L81) |
| Rutina | `actualizarRutina` | [rutinas.controller.js](../controllers/rutinas.controller.js#L124) |
| Rutina | `generarConIA` | [ia.controller.js](../controllers/ia.controller.js#L14) |
| Rutina | `generarRutinaIA` | [ia.controller.js](../controllers/ia.controller.js#L75) |
| Rutina | `modificarRutinaIA` | [ia.controller.js](../controllers/ia.controller.js#L192) |
| Rutina | `eliminarRutina` | [rutinas.controller.js](../controllers/rutinas.controller.js#L185) |
| RutinaEjercicio | `actualizarRutinaEjercicio` | [rutinas.controller.js](../controllers/rutinas.controller.js#L84) |
| Dieta | `calcularMacros` | [nutricion.controller.js](../controllers/nutricion.controller.js#L5) |
| Dieta | `actualizarDieta` | [nutricion.controller.js](../controllers/nutricion.controller.js#L107) |
| Dieta | `generarConIA` | [ia.controller.js](../controllers/ia.controller.js#L14) |
| Dieta | `generarDietaIA` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Dieta | `modificarDietaIA` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Dieta | `eliminarDieta` | [nutricion.controller.js](../controllers/nutricion.controller.js#L224) |
| Comida | `actualizarComida` | [nutricion.controller.js](../controllers/nutricion.controller.js#L82) |
| Comida | `calcularMacros` | [nutricion.controller.js](../controllers/nutricion.controller.js#L5) |
| RegistroEntrenamiento | `actualizarRegistro` | [entrenamientos.controller.js](../controllers/entrenamientos.controller.js#L93) |
| IAService | `generarRutina` | [ia.controller.js](../controllers/ia.controller.js#L41) |
| IAService | `generarDieta` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| IAService | `responderConsulta` | [ia.controller.js](../controllers/ia.controller.js#L215) |
| IAService | `responderconsulta` | [ia.controller.js](../controllers/ia.controller.js#L195) |
| Progreso | `calcularPorcentaje` | [progreso.controller.js](../controllers/progreso.controller.js#L9) |
| Seguridad | `encriptarRreversible` | [seguridad.controller.js](../controllers/seguridad.controller.js#L10) |
| Seguridad | `encriptarIrreversible` | [seguridad.controller.js](../controllers/seguridad.controller.js#L4) |
| Seguridad | `digitoVerificador` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |
| Seguridad | `digitoVerificado` | Fuera de este corte: administración, dieta IA o verificación DVH/DVV. |

`generarConIA` es el acceso compartido a Cohere; no habilita dieta con IA. `responderConsulta` recibe HTTP y `responderconsulta` construye la consulta al proveedor. `modificarRutinaIA` utiliza la generación sobre un plan propio ya existente. Agregar/quitar/actualizar ejercicios son operaciones internas de guardado en la transacción del plan, no rutas arbitrarias que acepten ids ajenos.

Las rutas HTTP están escritas directamente en [usuarios.routes.js](../routes/usuarios.routes.js) y [gimnasio.routes.js](../routes/gimnasio.routes.js). El [alcance](ALCANCE.md) declara las diferencias respecto del documento completo y del DER.
