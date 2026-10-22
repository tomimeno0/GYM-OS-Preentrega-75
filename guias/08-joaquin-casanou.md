# Joaquín Casanou · Rutinas manuales y catálogo de ejercicios

Esta es tu responsabilidad de estudio y revisión. No declara quién escribió el código.

## Mapa mental

```mermaid
flowchart TD
  N0["Buscar catálogo o escribir ejercicio"]
  N1["Armar días y series"]
  N2["Validar rutina"]
  N3["Guardar cabecera y ejercicios"]
  N4["Ver detalle"]
  N5["Editar o dar de baja"]
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
```

## Archivos y funciones

Pantalla: [client/src/pages/Rutinas.jsx](../client/src/pages/Rutinas.jsx). Backend: [controllers/rutinas.controller.js](../controllers/rutinas.controller.js). Rutas de cuentas en [usuarios.routes.js](../routes/usuarios.routes.js); las demás en [gimnasio.routes.js](../routes/gimnasio.routes.js).

| Función | Qué hace y qué tenés que poder explicar |
| --- | --- |
| [listarEjercicios](../controllers/rutinas.controller.js#L215) | Busca por nombre/grupo, pagina de a 24 y devuelve instrucciones del catálogo textual. |
| [validarEjercicios](../controllers/rutinas.controller.js#L11) | Valida días, orden, series, repeticiones, cargas y descansos; toma el nombre del catálogo cuando hay id. |
| [listarRutinas](../controllers/rutinas.controller.js#L105) | Carga planes propios con sus ejercicios ordenados y normaliza el día para el editor. |
| [actualizarRutina](../controllers/rutinas.controller.js#L124) | Valida la cabecera y objetivo, luego crea o edita el plan en una transacción. |
| [guardarRutina](../controllers/rutinas.controller.js#L89) | Persiste cabecera y lista de ejercicios; también lo usa la generación IA ya validada. |
| [agregarEjercicio](../controllers/rutinas.controller.js#L78) | Inserta una fila vinculada a la rutina. |
| [eliminarEjercicio](../controllers/rutinas.controller.js#L81) | Elimina los detalles de un plan durante su reemplazo. |
| [actualizarRutinaEjercicio](../controllers/rutinas.controller.js#L84) | Reemplaza los ejercicios dentro de la misma transacción. |
| [eliminarRutina](../controllers/rutinas.controller.js#L185) | Da de baja una rutina salvo que tenga un entrenamiento abierto. |

## Librerías que intervienen

React y Axios; Sequelize para Rutina/RutinaEjercicio/Objetivo; catálogo JSON de exercises-dataset con licencia conservada. No requiere imágenes ni llamadas externas para buscar ejercicios.

## Qué tenés que entender

Día lunes=1 a domingo=7; orden distinto dentro del mismo día; peso cero es peso corporal. El catálogo fija nombre y grupo desde el servidor. Una edición no borra entrenamientos, porque éstos ya copiaron los datos. No se puede dar de baja un plan mientras se está entrenando.

En la pantalla ubicá los estados (useState), la carga inicial (useEffect), el submit y las llamadas Axios. Seguí la ruta hasta la función del controlador y el modelo. Entendé qué datos entran, qué se valida, qué consulta se ejecuta y qué respuesta se devuelve. No hace falta memorizar cada palabra, pero sí poder explicar una función y una condición de error.

## Recorrido para defenderlo

Buscá squat, leé las instrucciones, agregá una ficha al editor y quitá el ejercicio vacío inicial si corresponde. Guardá, editá series y volvé a guardar. Mostrá una rutina manual y diferenciála de una propuesta IA.

## Base común mínima

Todos deben poder explicar `pantalla → ruta → controlador → modelo → MySQL`, request/response, async/await y try/catch. Las relaciones están en [models/index.js](../models/index.js). La confirmación visible está en [Confirmar.jsx](../client/src/components/Confirmar.jsx): muestra aceptar/cancelar; el servidor vuelve a exigir confirmación. Consultá [el alcance](../docs/ALCANCE.md) antes de prometer funciones del sistema completo.
