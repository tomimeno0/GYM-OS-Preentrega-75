# Reparto por endpoints · edición 75

Los **37 endpoints HTTP de la aplicación** tienen un responsable principal, sin duplicados ni rutas inventadas. Se incluyen 36 de cuentas/gimnasio/IA y `GET /api/salud`. Las rutas visuales de React y el fallback de archivos estáticos no se cuentan como endpoints de negocio.

El reparto es de estudio, revisión y defensa; no acredita autoría histórica. Se conserva la agrupación funcional para que las operaciones relacionadas queden juntas. La cantidad de rutas no mide esfuerzo ni porcentaje de código.

**Cómo leerlo:** el endpoint es método + ruta completa. `GET /api/rutinas` y `POST /api/rutinas` son dos endpoints distintos; `:id` es un parámetro. Todas las rutas de los routers se montan bajo `/api` en index.js. Axios usa ese prefijo automáticamente.

| Integrante y guía | Grupo | Endpoints asignados | Cantidad |
| --- | --- | --- | ---: |
| [Gianluca Pizarro](01-gianluca-pizarro.md) | Registro, sesión y estado del servidor | `POST /api/registro`<br>`POST /api/login`<br>`POST /api/logout`<br>`GET /api/salud` | 4 |
| [Tomás Menossi](02-tomas-menossi.md) | Chat y rutinas con Cohere | `GET /api/ia/estado`<br>`POST /api/ia/consulta`<br>`GET /api/ia/conversaciones`<br>`GET /api/ia/conversaciones/:id`<br>`POST /api/ia/rutinas`<br>`POST /api/ia/rutinas/:id/adaptar` | 6 |
| [Iván Lerner](03-ivan-lerner.md) | Entrenamientos e historial | `GET /api/entrenamientos`<br>`POST /api/entrenamientos`<br>`PUT /api/entrenamientos/:id` | 3 |
| [Paulo López](04-paulo-lopez.md) | Objetivos personales | `GET /api/objetivos`<br>`POST /api/objetivos`<br>`POST /api/objetivos/:id/completar`<br>`DELETE /api/objetivos/:id` | 4 |
| [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | Mediciones y resumen del progreso | `GET /api/mediciones`<br>`POST /api/mediciones/initial`<br>`POST /api/mediciones`<br>`GET /api/progreso` | 4 |
| [Valentín Schueld (Sueco)](06-valentin-schueld.md) | Dietas manuales | `GET /api/dietas`<br>`POST /api/dietas`<br>`PUT /api/dietas/:id`<br>`DELETE /api/dietas/:id` | 4 |
| [Mateo Romani](07-mateo-romani.md) | Consumos y macros | `GET /api/consumos`<br>`POST /api/consumos`<br>`PUT /api/consumos/:id`<br>`DELETE /api/consumos/:id` | 4 |
| [Joaquín Casanou](08-joaquin-casanou.md) | Catálogo y rutinas manuales | `GET /api/ejercicios`<br>`GET /api/rutinas`<br>`POST /api/rutinas`<br>`PUT /api/rutinas/:id`<br>`DELETE /api/rutinas/:id` | 5 |
| [Simón Castellani](09-simon-castellani.md) | Mi cuenta y datos personales | `GET /api/cuenta`<br>`PUT /api/cuenta`<br>`DELETE /api/cuenta` | 3 |

## Cobertura completa

| Endpoint | Responsable principal | Handler |
| --- | --- | --- |
| `DELETE /api/consumos/:id` | [Mateo Romani](07-mateo-romani.md) | `eliminarConsumo` |
| `DELETE /api/cuenta` | [Simón Castellani](09-simon-castellani.md) | `eliminarCuenta` |
| `DELETE /api/dietas/:id` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) | `eliminarDieta` |
| `DELETE /api/objetivos/:id` | [Paulo López](04-paulo-lopez.md) | `eliminarObjetivo` |
| `DELETE /api/rutinas/:id` | [Joaquín Casanou](08-joaquin-casanou.md) | `eliminarRutina` |
| `GET /api/consumos` | [Mateo Romani](07-mateo-romani.md) | `verMacros` |
| `GET /api/cuenta` | [Simón Castellani](09-simon-castellani.md) | `verCuenta` |
| `GET /api/dietas` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) | `listarDietas` |
| `GET /api/ejercicios` | [Joaquín Casanou](08-joaquin-casanou.md) | `listarEjercicios` |
| `GET /api/entrenamientos` | [Iván Lerner](03-ivan-lerner.md) | `listarEntrenamientos` |
| `GET /api/ia/conversaciones` | [Tomás Menossi](02-tomas-menossi.md) | `listarConversaciones` |
| `GET /api/ia/conversaciones/:id` | [Tomás Menossi](02-tomas-menossi.md) | `verConversacion` |
| `GET /api/ia/estado` | [Tomás Menossi](02-tomas-menossi.md) | `estadoIA` |
| `GET /api/mediciones` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | `listarMediciones` |
| `GET /api/objetivos` | [Paulo López](04-paulo-lopez.md) | `visuaizarObjetivo` |
| `GET /api/progreso` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | `verProgreso` |
| `GET /api/rutinas` | [Joaquín Casanou](08-joaquin-casanou.md) | `listarRutinas` |
| `GET /api/salud` | [Gianluca Pizarro](01-gianluca-pizarro.md) | `handler en index.js` |
| `POST /api/consumos` | [Mateo Romani](07-mateo-romani.md) | `registrarComida` |
| `POST /api/dietas` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) | `actualizarDieta` |
| `POST /api/entrenamientos` | [Iván Lerner](03-ivan-lerner.md) | `iniciarEntrenamiento` |
| `POST /api/ia/consulta` | [Tomás Menossi](02-tomas-menossi.md) | `responderConsulta` |
| `POST /api/ia/rutinas` | [Tomás Menossi](02-tomas-menossi.md) | `generarRutinaIA` |
| `POST /api/ia/rutinas/:id/adaptar` | [Tomás Menossi](02-tomas-menossi.md) | `modificarRutinaIA` |
| `POST /api/login` | [Gianluca Pizarro](01-gianluca-pizarro.md) | `iniciarSesion` |
| `POST /api/logout` | [Gianluca Pizarro](01-gianluca-pizarro.md) | `cerrarSesion` |
| `POST /api/mediciones` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | `actualizarMedicion` |
| `POST /api/mediciones/initial` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | `actualizarMedicion` |
| `POST /api/objetivos` | [Paulo López](04-paulo-lopez.md) | `definirObjeto` |
| `POST /api/objetivos/:id/completar` | [Paulo López](04-paulo-lopez.md) | `marcarCompletado` |
| `POST /api/registro` | [Gianluca Pizarro](01-gianluca-pizarro.md) | `registrarUsuario` |
| `POST /api/rutinas` | [Joaquín Casanou](08-joaquin-casanou.md) | `actualizarRutina` |
| `PUT /api/consumos/:id` | [Mateo Romani](07-mateo-romani.md) | `registrarComida` |
| `PUT /api/cuenta` | [Simón Castellani](09-simon-castellani.md) | `actualizarDatos` |
| `PUT /api/dietas/:id` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) | `actualizarDieta` |
| `PUT /api/entrenamientos/:id` | [Iván Lerner](03-ivan-lerner.md) | `actualizarRegistro` |
| `PUT /api/rutinas/:id` | [Joaquín Casanou](08-joaquin-casanou.md) | `actualizarRutina` |

## Criterio del reparto

Cada endpoint tiene un solo responsable principal. Que dos rutas usen el mismo handler —por ejemplo POST y PUT de rutinas— no las convierte en una sola ruta. Compartir una función de cálculo o persistencia tampoco duplica la propiedad del endpoint. Las nueve guías mantienen sus diagramas dentro de cada MD.

La distribución busca continuidad funcional y carga razonable, no nueve cantidades iguales de rutas. Las rutas que calculan progreso, guardan varios detalles o llaman a Cohere requieren más explicación que un listado simple.

En el 75, Joaquín reúne consulta y escritura de rutinas; Valentín tiene las dietas manuales y Mateo los consumos/macros. Gade reúne medidas y progreso. Tomás conserva los endpoints de IA: los helpers de guardar una rutina se coordinan con Joaquín, sin duplicar sus rutas manuales.

## Lectura de la implementación

Cada guía incluye una sección sobre la lógica simplificada y las diferencias que se conservan frente al repaso. El reparto y el alcance no cambiaron. Consultá el [criterio del profesor y las protecciones conservadas](../docs/CRITERIO-DEL-PROFESOR.md).
