# Reparto del próximo avance · referencia de alcance 75

Actualizado el 26/10/2026. El nombre del repositorio se conserva. El objetivo es un avance similar para los nueve, no llegar a un porcentaje fijo de aplicación. El 50 % queda congelado como referencia; no se reescribe el pasado.

**Estado: tareas de revisión, implementación y defensa pendientes de cada integrante.** La cobertura estimada que aparece abajo NO demuestra aportes realizados ni autoría. El código del incremento ya existe como referencia; cada uno debe entender, revisar y verificar su recorrido antes de marcarlo terminado.

Se conservan las responsabilidades de base del 50 % y se añaden tareas concretas a todos. Las rutas completas siguen siendo método + `/api/...`. Cada endpoint tiene un responsable principal; los helpers compartidos se coordinan sin inventar rutas nuevas.

| Integrante | Avance nuevo principal | Cobertura prevista del código del incremento |
| --- | --- | ---: |
| [Gianluca Pizarro](01-gianluca-pizarro.md) | Alimentos, validación nutricional y eliminación de consumos | 11.01 % |
| [Tomás Menossi](02-tomas-menossi.md) | Generación de rutinas con IA | 9.28 % |
| [Iván Lerner](03-ivan-lerner.md) | Creación de dietas | 11.90 % |
| [Paulo López](04-paulo-lopez.md) | Edición de dietas | 13.04 % |
| [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) | Registro de consumos y agregado de alimentos | 10.06 % |
| [Valentín Schueld (Sueco)](06-valentin-schueld.md) | Consulta/baja de dietas y editor de comidas | 12.81 % |
| [Mateo Romani](07-mateo-romani.md) | Resumen diario, macros y metas nutricionales | 11.82 % |
| [Joaquín Casanou](08-joaquin-casanou.md) | Adaptación de rutinas con IA | 9.46 % |
| [Simón Castellani](09-simon-castellani.md) | Edición de consumos y alimentos | 10.62 % |
| **Total previsto** | **Nueve paquetes pendientes** | **100,00 %** |

## Propiedad de los 37 endpoints

| Método y ruta | Responsable principal |
| --- | --- |
| `DELETE /api/consumos/:id` | [Gianluca Pizarro](01-gianluca-pizarro.md) |
| `DELETE /api/cuenta` | [Simón Castellani](09-simon-castellani.md) |
| `DELETE /api/dietas/:id` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) |
| `DELETE /api/objetivos/:id` | [Paulo López](04-paulo-lopez.md) |
| `DELETE /api/rutinas/:id` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) |
| `GET /api/consumos` | [Mateo Romani](07-mateo-romani.md) |
| `GET /api/cuenta` | [Simón Castellani](09-simon-castellani.md) |
| `GET /api/dietas` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) |
| `GET /api/ejercicios` | [Joaquín Casanou](08-joaquin-casanou.md) |
| `GET /api/entrenamientos` | [Iván Lerner](03-ivan-lerner.md) |
| `GET /api/ia/conversaciones` | [Tomás Menossi](02-tomas-menossi.md) |
| `GET /api/ia/conversaciones/:id` | [Tomás Menossi](02-tomas-menossi.md) |
| `GET /api/ia/estado` | [Tomás Menossi](02-tomas-menossi.md) |
| `GET /api/mediciones` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) |
| `GET /api/objetivos` | [Paulo López](04-paulo-lopez.md) |
| `GET /api/progreso` | [Mateo Romani](07-mateo-romani.md) |
| `GET /api/rutinas` | [Joaquín Casanou](08-joaquin-casanou.md) |
| `GET /api/salud` | [Gianluca Pizarro](01-gianluca-pizarro.md) |
| `POST /api/consumos` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) |
| `POST /api/dietas` | [Iván Lerner](03-ivan-lerner.md) |
| `POST /api/entrenamientos` | [Iván Lerner](03-ivan-lerner.md) |
| `POST /api/ia/consulta` | [Tomás Menossi](02-tomas-menossi.md) |
| `POST /api/ia/rutinas` | [Tomás Menossi](02-tomas-menossi.md) |
| `POST /api/ia/rutinas/:id/adaptar` | [Joaquín Casanou](08-joaquin-casanou.md) |
| `POST /api/login` | [Gianluca Pizarro](01-gianluca-pizarro.md) |
| `POST /api/logout` | [Gianluca Pizarro](01-gianluca-pizarro.md) |
| `POST /api/mediciones` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) |
| `POST /api/mediciones/initial` | [Gade Silva y Lápiz](05-gade-silva-y-lapiz.md) |
| `POST /api/objetivos` | [Paulo López](04-paulo-lopez.md) |
| `POST /api/objetivos/:id/completar` | [Paulo López](04-paulo-lopez.md) |
| `POST /api/registro` | [Gianluca Pizarro](01-gianluca-pizarro.md) |
| `POST /api/rutinas` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) |
| `PUT /api/consumos/:id` | [Simón Castellani](09-simon-castellani.md) |
| `PUT /api/cuenta` | [Simón Castellani](09-simon-castellani.md) |
| `PUT /api/dietas/:id` | [Paulo López](04-paulo-lopez.md) |
| `PUT /api/entrenamientos/:id` | [Iván Lerner](03-ivan-lerner.md) |
| `PUT /api/rutinas/:id` | [Valentín Schueld (Sueco)](06-valentin-schueld.md) |

La ampliación suma diez endpoints repartidos entre los nueve: ocho de nutrición y dos de IA. Tener una sola ruta nueva no significa una tarea pequeña: se incluyen pantalla, validaciones, datos, errores y comprobación. Tomás conserva el chat y la creación con IA; Joaquín toma adaptación. Valentín conserva la escritura de rutinas; Mateo conserva progreso. La cantidad de rutas por persona no es una medida de esfuerzo.

[Plan y cobertura por archivo](../docs/PLAN.md). Los informes anteriores describen el reparto anterior y no se sobrescriben para simular otra historia.
