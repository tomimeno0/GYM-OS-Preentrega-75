# Plan de avance equilibrado · referencia de alcance 75

Fecha: 26/10/2026. Reemplaza el reparto que concentraba la ampliación en dietas, consumos e IA bajo tres responsables. No cambia las versiones históricas ni demuestra quién escribió el código.

## Objetivo y estado

Nueve paquetes concretos con carga parecida. Referencia: 11,11 % por persona, sin igualdad matemática obligatoria. La proyección actual va de 9,28 % a 13,04 % del código nuevo/reemplazado asignado. Es una comprobación de volumen para orientar el trabajo, no una medición de horas, dificultad ni aportes hechos. Si las pruebas o el estudio muestran una carga distinta, se traslada una tarea completa y se actualizan ambas guías; no se agregan líneas de relleno.

**Pendiente:** cada integrante debe recorrer, revisar y comprobar su paquete. No se marcan contribuciones como realizadas ni se generan commits a nombre de estudiantes. El código actual del incremento es la referencia de trabajo. Actualizar documentación no crea colaboración real por sí solo.

## Reparto

| Integrante | Paquete nuevo | Referencia de volumen |
| --- | --- | ---: |
| [Gianluca Pizarro](../guias/01-gianluca-pizarro.md) | Alimentos, validación nutricional y eliminación de consumos | 11.01 % |
| [Tomás Menossi](../guias/02-tomas-menossi.md) | Generación de rutinas con IA | 9.28 % |
| [Iván Lerner](../guias/03-ivan-lerner.md) | Creación de dietas | 11.90 % |
| [Paulo López](../guias/04-paulo-lopez.md) | Edición de dietas | 13.04 % |
| [Gade Silva y Lápiz](../guias/05-gade-silva-y-lapiz.md) | Registro de consumos y agregado de alimentos | 10.06 % |
| [Valentín Schueld (Sueco)](../guias/06-valentin-schueld.md) | Consulta/baja de dietas y editor de comidas | 12.81 % |
| [Mateo Romani](../guias/07-mateo-romani.md) | Resumen diario, macros y metas nutricionales | 11.82 % |
| [Joaquín Casanou](../guias/08-joaquin-casanou.md) | Adaptación de rutinas con IA | 9.46 % |
| [Simón Castellani](../guias/09-simon-castellani.md) | Edición de consumos y alimentos | 10.62 % |
| **Total** | | **100,00 %** |

## Cómo se coordinan los bloques compartidos

- Iván crea dietas; Paulo edita. El handler actualizarDieta y la cabecera del formulario sirven a ambos. No se duplican funciones por contar líneas.
- Valentín trabaja consulta/baja y el editor de comidas. Gade agrega alimentos y consumos; juntos revisan actualizarComida y el modelo del detalle.
- Gade crea consumos y agrega alimentos; Simón edita y quita alimentos. Comparten los campos del editor y el handler registrarComida.
- Gianluca revisa las fórmulas, validaciones numéricas y borrado de consumo; Mateo consulta totales y revisa metas nutricionales y su comparación con el consumo.
- Tomás crea rutinas con IA y Joaquín adapta las existentes. Comparten preparar/validar la propuesta y el guardado; conservan responsables distintos para los dos endpoints.
- La base del 50 % se mantiene con sus responsables: no se cuenta volver a leer un módulo intacto como si fuera una funcionalidad nueva.

## Orden de trabajo

1. Cada integrante lee su guía y localiza el flujo real; anota dudas y casos esperados.
2. Coordinar los helpers compartidos antes de editarlos; quien cambie uno acuerda sus entradas/salidas con el otro responsable.
3. Trabajar con bucles, if/else y Sequelize directos, manteniendo el estilo del profesor y los métodos del UML incluidos.
4. Ejecutar los tres casos concretos de cada guía con datos sintéticos; conservar aislamiento entre usuarios, transacciones y consentimiento.
5. Revisar el funcionamiento en la pantalla real y explicar input → endpoint → función → consulta → respuesta.
6. Registrar únicamente trabajo efectivamente realizado. Comparar carga pendiente y redistribuir una tarea completa si hace falta, antes de cerrar la entrega.

## Alcance flexible

No hay una obligación de alcanzar 65 %, 75 % u otro número exacto de funciones. Se conserva el nombre del repositorio para no crear otro ni romper enlaces. El alcance ejecutable actual sigue siendo el declarado en alcance.json y ALCANCE.md; esta revisión no añade ni retira funciones, no reduce protecciones y no modifica el proyecto completo. Cambiar el corte real de una entrega requiere una selección explícita de casos completos y volver a comprobarlos.

## Cómo se estimó la cobertura

Se reutilizan las 1.702 líneas nuevas/reemplazadas del análisis 50 → 75, sin dependencias, documentos, builds, datasets ni SQL exportado. Cada línea pertenece una sola vez al total; los helpers usados por dos o más paquetes se reparten con pesos iguales entre quienes los revisan. No se presentan esas fracciones como autoría. Los porcentajes se redondean por restos mayores para sumar 100 %.

La asignación trata: campos/fórmula de alimentos y validación de metas con Gianluca; crear/editar plan con Iván/Paulo; editor de comidas con Valentín; agregar/editar alimentos con Gade/Simón; metas/resumen con Mateo; generar/adaptar con Tomás/Joaquín. La matriz siguiente permite ver qué archivos revisan juntos.

| Archivo cambiado | Responsables y líneas equivalentes previstas |
| --- | --- |
| `client/src/App.jsx` | Gianluca Pizarro: 3.79; Iván Lerner: 3.95; Paulo López: 3.95; Gade Silva y Lápiz: 2.79; Valentín Schueld (Sueco): 3.95; Mateo Romani: 2.79; Simón Castellani: 2.79 |
| `client/src/pages/Asistente.jsx` | Tomás Menossi: 45.00; Valentín Schueld (Sueco): 4.50; Mateo Romani: 4.50; Joaquín Casanou: 45.00 |
| `client/src/pages/Nutricion.jsx` | Gianluca Pizarro: 26.21; Iván Lerner: 95.21; Paulo López: 114.71; Gade Silva y Lápiz: 110.55; Valentín Schueld (Sueco): 109.71; Mateo Romani: 104.55; Simón Castellani: 133.05 |
| `client/src/pages/Progreso.jsx` | Mateo Romani: 2.00 |
| `client/vite.config.js` | Gianluca Pizarro: 1.00 |
| `controllers/auth.controller.js` | Gianluca Pizarro: 1.00 |
| `controllers/ia.controller.js` | Tomás Menossi: 112.00; Joaquín Casanou: 115.00 |
| `controllers/nutricion.controller.js` | Gianluca Pizarro: 138.71; Iván Lerner: 74.21; Paulo López: 74.21; Gade Silva y Lápiz: 47.21; Valentín Schueld (Sueco): 69.71; Mateo Romani: 69.71; Simón Castellani: 33.21 |
| `controllers/progreso.controller.js` | Mateo Romani: 7.00 |
| `controllers/usuarios.controller.js` | Gianluca Pizarro: 3.00; Simón Castellani: 1.00 |
| `index.js` | Gianluca Pizarro: 3.00 |
| `models/ComidaConsumida.model.js` | Gianluca Pizarro: 7.75; Gade Silva y Lápiz: 7.75; Mateo Romani: 7.75; Simón Castellani: 7.75 |
| `models/Dieta.model.js` | Iván Lerner: 14.33; Paulo López: 14.33; Valentín Schueld (Sueco): 14.33 |
| `models/DietaComida.model.js` | Iván Lerner: 9.33; Paulo López: 9.33; Valentín Schueld (Sueco): 9.33 |
| `models/index.js` | Gianluca Pizarro: 1.75; Iván Lerner: 4.33; Paulo López: 4.33; Gade Silva y Lápiz: 1.75; Valentín Schueld (Sueco): 4.33; Mateo Romani: 1.75; Simón Castellani: 1.75 |
| `routes/gimnasio.routes.js` | Gianluca Pizarro: 1.14; Tomás Menossi: 1.00; Iván Lerner: 1.14; Paulo López: 1.14; Gade Silva y Lápiz: 1.14; Valentín Schueld (Sueco): 2.14; Mateo Romani: 1.14; Joaquín Casanou: 1.00; Simón Castellani: 1.14 |

Las líneas equivalentes se muestran aproximadas. Un archivo compartido no debe ser editado simultáneamente sin coordinar. Esta tabla no sustituye revisar dificultad y resultados. Los conteos históricos previos se conservan sin cambios.

## Lo que no se modifica en esta revisión

Solo se actualizan las nueve guías y el plan del repositorio de ampliación. Sin cambios de código, endpoints, dependencias, bases, secretos o versiones de referencia. El estado de los recorridos comprobados antes no equivale a que los nueve hayan hecho ya su revisión.
