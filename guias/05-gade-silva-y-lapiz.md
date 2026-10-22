# Gade Silva y Lápiz · Medidas, progreso y resumen

Esta es tu responsabilidad de estudio y revisión. No declara quién escribió el código.

## Mapa mental

```mermaid
flowchart TD
  N0["Formulario de medidas"]
  N1["Validación"]
  N2["Nueva fila del historial"]
  N3["verProgreso"]
  N4["calcularPorcentaje"]
  N5["Gráfico y resumen"]
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
```

## Archivos y funciones

Pantalla: [client/src/pages/Medidas.jsx](../client/src/pages/Medidas.jsx). Backend: [controllers/mediciones.controller.js](../controllers/mediciones.controller.js). Rutas de cuentas en [usuarios.routes.js](../routes/usuarios.routes.js); las demás en [gimnasio.routes.js](../routes/gimnasio.routes.js).

| Función | Qué hace y qué tenés que poder explicar |
| --- | --- |
| [actualizarMedicion](../controllers/mediciones.controller.js#L52) | Agrega una medición inicial o posterior, sin sobrescribir las anteriores; valida porcentajes, fecha y perímetros. |
| [listarMediciones](../controllers/mediciones.controller.js#L136) | Consulta el historial propio del más reciente al más antiguo. |
| [cambiarPeso](../controllers/mediciones.controller.js#L4) | Valida peso entre 20 y 400 kg. |
| [cambiarAltura](../controllers/mediciones.controller.js#L14) | Valida altura entre 80 y 250 cm. |
| [cambiarPorcMusculo](../controllers/mediciones.controller.js#L24) | Acepta un porcentaje muscular válido o ausencia del dato. |
| [cambiarPorcGraso](../controllers/mediciones.controller.js#L35) | Acepta un porcentaje de grasa válido o ausencia del dato. |
| [cambiarNivelActividad](../controllers/mediciones.controller.js#L46) | Limita actividad a baja, media o alta. |
| [verProgreso](../controllers/progreso.controller.js#L20) | Reúne el historial y calcula valores actuales según cada tipo de objetivo. |
| [calcularPorcentaje](../controllers/progreso.controller.js#L9) | Calcula avance respecto de inicio/meta, limita a 0–100 y maneja el caso inicio=meta. |

## Librerías que intervienen

React y Axios cargan medidas; Recharts dibuja la serie real de peso en Progreso.jsx. Sequelize consulta medidas, objetivos y entrenamientos; Intl respeta la zona horaria.

## Qué tenés que entender

La primera medición es única y las siguientes deben ser posteriores. Porcentajes no pueden sumar más de 100. Un dato ausente es null, no cero inventado. Progreso calcula recorrido desde la línea de base; resistencia usa la mejor distancia y frecuencia cuenta entrenamientos completos de la semana.

En la pantalla ubicá los estados (useState), la carga inicial (useEffect), el submit y las llamadas Axios. Seguí la ruta hasta la función del controlador y el modelo. Entendé qué datos entran, qué se valida, qué consulta se ejecuta y qué respuesta se devuelve. No hace falta memorizar cada palabra, pero sí poder explicar una función y una condición de error.

## Recorrido para defenderlo

Agregá dos mediciones distintas. Mostrá el historial y el gráfico. Explicá con números: inicial 80, meta 70, actual 75 implica 50 %. Aclarar por qué una meta marcada completa manualmente puede no tener 100 % medido.

## Base común mínima

Todos deben poder explicar `pantalla → ruta → controlador → modelo → MySQL`, request/response, async/await y try/catch. Las relaciones están en [models/index.js](../models/index.js). La confirmación visible está en [Confirmar.jsx](../client/src/components/Confirmar.jsx): muestra aceptar/cancelar; el servidor vuelve a exigir confirmación. Consultá [el alcance](../docs/ALCANCE.md) antes de prometer funciones del sistema completo.
