# Mateo Romani · Consumos y cálculo de macros

Esta es tu responsabilidad de estudio y revisión. No declara quién escribió el código.

## Mapa mental

```mermaid
flowchart TD
  N0["Etiqueta y cantidad real"]
  N1["Validar alimento"]
  N2["calcularMacros"]
  N3["Guardar consumo"]
  N4["Filtrar por día local"]
  N5["Sumar y comparar con meta"]
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
```

## Archivos y funciones

Pantalla: [client/src/pages/Nutricion.jsx](../client/src/pages/Nutricion.jsx). Backend: [controllers/nutricion.controller.js](../controllers/nutricion.controller.js). Rutas de cuentas en [usuarios.routes.js](../routes/usuarios.routes.js); las demás en [gimnasio.routes.js](../routes/gimnasio.routes.js).

| Función | Qué hace y qué tenés que poder explicar |
| --- | --- |
| [calcularMacros](../controllers/nutricion.controller.js#L5) | Multiplica cada nutriente por cantidad/100 para g/ml o por cantidad para porciones, suma y redondea. |
| [datosComida](../controllers/nutricion.controller.js#L65) | Valida el nombre y tipo de comida y calcula sus nutrientes a partir de los alimentos. |
| [registrarComida](../controllers/nutricion.controller.js#L242) | Crea o edita un consumo propio con fecha válida y totales calculados en el servidor. |
| [verMacros](../controllers/nutricion.controller.js#L290) | Agrupa consumos por día en la zona de la cuenta, suma nutrientes y devuelve la dieta activa más reciente para comparar. |
| [eliminarConsumo](../controllers/nutricion.controller.js#L335) | Exige confirmación y elimina solamente un registro del usuario actual. |

## Librerías que intervienen

React y Axios; Sequelize guarda ComidaConsumida con copia de alimentos y nutrientes. Intl convierte el instante a un día local. Las etiquetas nutricionales se ingresan manualmente, no se consultan a un proveedor externo.

## Qué tenés que entender

Por 100 g no es por porción. Ejemplo: 50 g de un alimento de 400 kcal/100 g son 200 kcal. No se aceptan totales inventados enviados por el navegador. Cambiar la dieta no debe modificar un consumo anterior. Diferenciá fecha UTC y fecha local.

En la pantalla ubicá los estados (useState), la carga inicial (useEffect), el submit y las llamadas Axios. Seguí la ruta hasta la función del controlador y el modelo. Entendé qué datos entran, qué se valida, qué consulta se ejecuta y qué respuesta se devuelve. No hace falta memorizar cada palabra, pero sí poder explicar una función y una condición de error.

## Recorrido para defenderlo

Ingresá 50 g de un alimento de 400 kcal/100 g y verificá 200 kcal. Cambiá la cantidad a 100 y revisá el total. Consultá otro día sin registros. Mostrá que no se agregan automáticamente las comidas del plan.

## Base común mínima

Todos deben poder explicar `pantalla → ruta → controlador → modelo → MySQL`, request/response, async/await y try/catch. Las relaciones están en [models/index.js](../models/index.js). La confirmación visible está en [Confirmar.jsx](../client/src/components/Confirmar.jsx): muestra aceptar/cancelar; el servidor vuelve a exigir confirmación. Consultá [el alcance](../docs/ALCANCE.md) antes de prometer funciones del sistema completo.
