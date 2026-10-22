# Gade Silva y Lápiz · endpoints de mediciones y resumen del progreso

Edición **75**. Tu responsabilidad principal son los **4 endpoints de la tabla siguiente**. Las funciones auxiliares y las consultas a rutas de otros compañeros se distinguen más abajo. Esto es un reparto para estudiar y defender, no una declaración de quién escribió el código.

## Tus endpoints concretos

| Método y ruta completa | Ruta en el código | Handler real | Acceso |
| --- | --- | --- | --- |
| `GET /api/mediciones` | [routes/gimnasio.routes.js](../routes/gimnasio.routes.js#L12) | [listarMediciones](../controllers/mediciones.controller.js#L204) | Sesión requerida |
| `POST /api/mediciones/initial` | [routes/gimnasio.routes.js](../routes/gimnasio.routes.js#L13) | [actualizarMedicion](../controllers/mediciones.controller.js#L55) | Sesión requerida |
| `POST /api/mediciones` | [routes/gimnasio.routes.js](../routes/gimnasio.routes.js#L14) | [actualizarMedicion](../controllers/mediciones.controller.js#L55) | Sesión requerida |
| `GET /api/progreso` | [routes/gimnasio.routes.js](../routes/gimnasio.routes.js#L35) | [verProgreso](../controllers/progreso.controller.js#L25) | Sesión requerida |

Las URLs de esta tabla incluyen `/api`. En React vas a ver llamadas como `axios.get("/cuenta")`: [App.jsx](../client/src/App.jsx) configura `axios.defaults.baseURL = "/api"`. No existe una ruta extra por cada función interna.

## Mapa de tus endpoints

```mermaid
flowchart LR
  P["Pantalla o cliente HTTP"]
  P --> E0["GET /api/mediciones"]
  E0 --> F0["listarMediciones"]
  F0 --> R["Respuesta HTTP"]
  P --> E1["POST /api/mediciones/initial"]
  E1 --> F1["actualizarMedicion"]
  F1 --> R["Respuesta HTTP"]
  P --> E2["POST /api/mediciones"]
  E2 --> F2["actualizarMedicion"]
  F2 --> R["Respuesta HTTP"]
  P --> E3["GET /api/progreso"]
  E3 --> F3["verProgreso"]
  F3 --> R["Respuesta HTTP"]
```

En los endpoints privados, `verificarSesion` corre antes del handler. Las tablas y consultas concretas se explican por endpoint; el catálogo usa JSON local y `/ia/estado` lee configuración, no hacen consultas de negocio a MySQL.

## Explicación de cada endpoint

### `GET /api/mediciones`

**Qué recibe.** Sin body ni query.

**Qué ejecuta y consulta.** `MedicionFisica.findAll` por `usuario_id`, ordenado por `fecha_medicion DESC`.

**Qué valida o decide.** No acepta un usuario_id del navegador para consultar otra cuenta.

**Respuesta correcta.** `200` → `{items: [...]}`; puede estar vacío.

**Errores propios.** `500` si no puede consultar.

**Quién lo llama.** Medidas.jsx: `cargar`.

**Cómo mostrarlo.** Mostrar el historial con dos registros, indicando cuál es el más reciente.

### `POST /api/mediciones/initial`

**Qué recibe.** Body: `peso_kg`, `altura_cm`, `nivel_actividad`; opcionales `grasa_corporal`, `musculo_corporal`, `fecha_medicion`, `cintura_cm`, `pecho_cm`, `brazos_cm`, `piernas_cm`.

**Qué ejecuta y consulta.** Busca la última medición propia; si no existe crea `MedicionFisica` con `usuario_inicial = req.user.id` y registra `Bitacora`.

**Qué valida o decide.** La función detecta la ruta `/initial`. Rechaza una segunda carga inicial. Peso 20–400 kg, altura 80–250 cm, grasa 0–70 %, músculo 0–100 %, suma de porcentajes ≤100; actividad baja/media/alta. Fecha no futura; perímetros mayores que 0 y hasta 300 cm.

**Respuesta correcta.** `201` → fila de medición creada.

**Errores propios.** `400` por valores/fechas inválidos; `409` si ya existe inicial; `500` si no puede guardar.

**Quién lo llama.** Medidas.jsx: `guardar` elige `/mediciones/initial` cuando la lista está vacía.

**Cómo mostrarlo.** Registrar el punto de partida; explicar por qué este endpoint no se usa de nuevo.

### `POST /api/mediciones`

**Qué recibe.** Body: `peso_kg`, `altura_cm`, `nivel_actividad`; opcionales `grasa_corporal`, `musculo_corporal`, `fecha_medicion`, `cintura_cm`, `pecho_cm`, `brazos_cm`, `piernas_cm`.

**Qué ejecuta y consulta.** Busca la última medición propia; crea otra fila de `MedicionFisica` y agrega `Bitacora`, sin sobrescribir la anterior.

**Qué valida o decide.** Debe haber una medición previa y la nueva fecha debe ser posterior. Peso 20–400 kg, altura 80–250 cm, grasa 0–70 %, músculo 0–100 %, suma de porcentajes ≤100; actividad baja/media/alta. Fecha no futura; perímetros mayores que 0 y hasta 300 cm.

**Respuesta correcta.** `201` → nueva fila del historial.

**Errores propios.** `400` por datos o fecha no posterior; `409` si todavía falta la inicial; `500` si falla el guardado.

**Quién lo llama.** Medidas.jsx: `guardar` elige `/mediciones` si ya hay registros.

**Cómo mostrarlo.** Agregar una medición posterior y mostrar que conserva la inicial.

### `GET /api/progreso`

**Qué recibe.** Sin body ni id de usuario en la URL.

**Qué ejecuta y consulta.** Consulta `MedicionFisica`, `Objetivo` no eliminado, `Entrenamiento` completo y cuenta `Rutina` activa. En el 75 además cuenta `Dieta` activa. Agrupa/calcula valores en JavaScript.

**Qué valida o decide.** `calcularPorcentaje` compara inicio/actual/meta, limita a 0–100 y trata inicio=meta. Resistencia usa mejor distancia; frecuencia cuenta sesiones completas semanales. Objetivos completados cortan en `fecha_cierre`, incluso el mismo día.

**Respuesta correcta.** `200` → `{mediciones, objetivos: [...con valor_actual y porcentaje], entrenamientos_completados, rutinas}`; en 75 agrega `dietas`.

**Errores propios.** `500` si no puede consultar/calcular.

**Quién lo llama.** Progreso.jsx: `useEffect` carga el resumen y Recharts dibuja peso; es la pantalla Resumen, no una pestaña de Mi cuenta.

**Cómo mostrarlo.** Explicar el cálculo 80→70 con actual 75 =50 %, mostrar el gráfico y por qué una meta completada manualmente puede no medir 100 %.

## Funciones de apoyo: no son otros endpoints

Conocé para qué sirven cuando aparecen en el recorrido de tus rutas. No se asigna una ruta inexistente ni se cambia el responsable por compartir una función.

| Función auxiliar | Para qué interviene |
| --- | --- |
| [cambiarPeso](../controllers/mediciones.controller.js#L3) | Valida el rango de peso. |
| [cambiarAltura](../controllers/mediciones.controller.js#L14) | Valida altura. |
| [cambiarPorcMusculo](../controllers/mediciones.controller.js#L25) | Valida porcentaje muscular o dato ausente. |
| [cambiarPorcGraso](../controllers/mediciones.controller.js#L37) | Valida grasa o dato ausente. |
| [cambiarNivelActividad](../controllers/mediciones.controller.js#L49) | Valida baja/media/alta. |
| [calcularPorcentaje](../controllers/progreso.controller.js#L9) | Calcula el avance y trata inicio=meta; no recibe HTTP. |

## Archivos que tenés que ubicar

- [controllers/mediciones.controller.js](../controllers/mediciones.controller.js): handlers y lógica de tus endpoints.
- [controllers/progreso.controller.js](../controllers/progreso.controller.js): handlers y lógica de tus endpoints.
- [client/src/pages/Medidas.jsx](../client/src/pages/Medidas.jsx): estado, formulario o carga que llama a esas rutas.
- [client/src/pages/Progreso.jsx](../client/src/pages/Progreso.jsx): estado, formulario o carga que llama a esas rutas.
- [models/index.js](../models/index.js): relaciones; seguí desde ahí solo los modelos usados en tus consultas.
- [auth.controller.js](../controllers/auth.controller.js#L5): antes de un handler privado comprueba cookie, JWT, sesión persistida y cuenta activa; deja el usuario en `req.user`.

## Lo mínimo común para defender estas rutas

Diferenciá `req.params` (id en la URL), `req.query` (filtros después de `?`), `req.body` (JSON enviado) y `req.user` (cuenta autenticada). El usuario propietario se toma de la sesión, no de un id arbitrario enviado por el formulario.

Todos los endpoints privados pueden responder `401` si la sesión falta, vence, se cierra o la cuenta no está habilitada; el middleware puede responder `500` si falla su comprobación. No confundas estos errores compartidos con los que devuelve el handler. El parser general también puede rechazar JSON inválido (`400`) o un body demasiado grande (`413`).

Para respuestas `204`, no hay JSON que leer. Para crear suele usarse `201`; para leer/editar, `200`. En Axios, el JSON está en `respuesta.data`; en DELETE, el body se pasa como `{data: {...}}`.

No hace falta estudiar todo el sistema ni el funcionamiento interno de Vite. Sí poder seguir tu request desde la pantalla hasta las consultas y explicar una respuesta de éxito y una condición de error.

## Librerías que intervienen

Express y Sequelize guardan el historial físico. React y Axios manejan el formulario; las comprobaciones numéricas y de fechas son JavaScript. Recharts dibuja la serie de peso e Intl aplica la zona horaria en el resumen.

## Coordinación con otros responsables

- Si necesitás datos de otra funcionalidad, consultá el índice general. Un `findAll` interno de tu controlador no equivale a llamar por HTTP a otro endpoint.

Consultá el [reparto completo](README.md) y el [alcance](../docs/ALCANCE.md) antes de prometer una ruta de otra entrega.

## Cómo leer el código simplificado

El recorrido sigue siendo pantalla React → ruta Express → controlador → modelo Sequelize → MySQL. No hay una capa de servicios. Las decisiones de negocio usan `if`/`else` y los recorridos usan `for (let i = 0; i < lista.length; i++)`. En cada vuelta, `lista[i]` es el elemento de esa posición; el nombre de la lista no tiene significado especial para JavaScript.

Se quitaron `for...of`, `?.`, `??` y `...` del código de controladores y pantallas. Los controladores ya no usan callbacks de `map`, `filter`, `find` o `some` ni comparadores de `sort`: las búsquedas, validaciones y cálculos están desplegados en bucles. En los formularios se construye una copia con los campos explícitos antes de llamar al setter de React; `slice()` copia una lista y `push()` agrega un elemento. No hay que modificar directamente el estado anterior.

En JSX se mantiene `map` únicamente para dibujar listas de elementos. Por ejemplo, `items.map((rutina) => <...>)` produce un bloque visual por rutina; no guarda datos ni llama a MySQL. `key` identifica cada fila para React. Algunas etiquetas usan un condicional sencillo `condicion ? textoSi : textoNo`; la validación del servidor está escrita con `if`. Las funciones de evento con `=>` y la desestructuración también aparecen en los ejemplos del curso: no son otra arquitectura.

No se afirma que todo el proyecto sea idéntico al repaso. El sistema tiene más funciones que un CRUD de ejemplo. Las protecciones conservadas se explican abajo según tu recorrido. [Criterio y diferencias conservadas](../docs/CRITERIO-DEL-PROFESOR.md).

### Tu recorrido, paso a paso

`actualizarMedicion` toma los datos del body, trata los porcentajes ausentes como `null` con condiciones explícitas y llama a las validaciones de peso, altura y actividad. Un bucle recorre los nombres de los perímetros para aplicar el mismo rango a cada uno. Valida que la fecha sea posterior a la última medición y distingue la carga inicial de las posteriores.

En React, `guardar` construye el body copiando sus campos; recorre los nombres con un `for`, convierte a número lo escrito y deja `null` en campos opcionales vacíos. `mostrarPorcentaje` devuelve un guion solo cuando no hay valor; el cero real no se oculta.

### Tu recorrido, paso a paso

`verProgreso` consulta mediciones, objetivos y entrenamientos propios. Para cada objetivo, recorre los registros y conserva los anteriores a su cierre. Para resistencia busca la mayor distancia con un `for` y una comparación; para frecuencia cuenta entrenamientos de la semana; para peso/grasa toma la última medición válida. Si no hay mediciones usa el valor inicial, sin acceder a un elemento inexistente.

`calcularPorcentaje` calcula `(actual - inicial) / (meta - inicial) * 100`, limita el resultado entre 0 y 100 con `if` y redondea a un decimal. Cuando inicial y meta coinciden hay un caso separado para no dividir por cero. El objetivo cerrado conserva su fecha de corte.

Progreso.jsx carga con una función `async`, prepara `puntosMediciones` con un bucle y se los entrega al gráfico de Recharts. El gráfico dibuja; no decide el porcentaje ni modifica MySQL. `mostrarValorActual` muestra el cero real y solo usa "Sin medición" para un valor ausente.
