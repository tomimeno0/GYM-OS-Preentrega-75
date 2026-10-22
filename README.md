# GYM-OS · Preentrega 75

Proyecto educativo en JavaScript con React, Express, Sequelize y MySQL. Esta copia reorganiza la aplicación según los ejemplos de `REPASO COMPLETO.rar`: rutas → controladores → modelos, con consultas directas y funciones visibles.

No reemplaza el proyecto completo ni la preentrega anterior. El nombre identifica el corte de entrega: incluye 28 de los 39 casos nominales (71,79 %), no un 75 % medido por dificultad, tiempo ni autoría. Ver [alcance y límites](docs/ALCANCE.md).

## Cómo está organizado

```text
index.js                 servidor Express
config/db.js             conexión MySQL
config/inicializar.js    creación inicial de tablas y cuenta demo
models/                  tablas y relaciones Sequelize
controllers/             lógica de cada función
routes/                  dirección HTTP → función del controlador
client/src/pages/        pantallas React con estado y Axios
client/src/components/   confirmación visible de acciones
models/exercises/        catálogo textual de ejercicios y licencia
sql/estructura.sql       esquema MySQL, sin usuarios ni datos personales
```

Cada pantalla usa `useState`, `useEffect`, formularios y Axios. No hay carpeta de servicios, clases de despacho, validadores genéricos ni reintentos automáticos de IA. Se retiraron los temas 45, 46 y 47. Las contraseñas siguen protegidas; simplificar no significa publicar credenciales ni permitir consultar cuentas ajenas. [Criterio del profesor](docs/CRITERIO-DEL-PROFESOR.md).

## Ejecutar

Requiere Node.js 22.12 o posterior compatible con Vite, npm y MySQL 8.4. Docker es opcional; `compose.yaml` inicia una base separada en el puerto 3310.

1. Copiar `.env.example` a `.env`. Completar los valores `CAMBIAR`. Usar una contraseña de demo de al menos 10 caracteres y como máximo 72 bytes; `JWT_SECRET` debe tener al menos 32 caracteres. `ENCRYPTION_KEY` debe ser una clave hexadecimal aleatoria de 64 caracteres. No publicar ese archivo.
2. Si usás Docker: `docker compose up -d`. Si tenés el ejecutable independiente, `docker-compose up -d`. En esta Mac el contexto es `colima-gymos`; usar `DOCKER_CONTEXT=colima-gymos docker-compose up -d` con Colima ya iniciado.
3. `npm ci` y `npm ci --prefix client`.
4. `npm run db:iniciar`: crea tablas faltantes y el rol Cliente. No borra tablas ni modifica su estructura. Si se definió `DEMO_PASSWORD`, crea `demo@gymos.local` solo si no existe; nunca restablece una cuenta existente.
5. `npm run build` y `npm start`.
6. Abrir **http://localhost:5175**. El servidor escucha únicamente en las dos direcciones locales IPv4/IPv6; no se publica en la red.

Para editar React con recarga: mantener el servidor y ejecutar `npm run dev --prefix client`; abre http://localhost:5176 con el proxy `/api`. Después de modificar el backend hay que reiniciarlo, o usar `npm run dev` en lugar de `npm start`.

Para usar una instalación propia de MySQL, crear una base vacía y un usuario con permisos solamente sobre esa base; configurar `DB_*` y ejecutar el paso de inicialización. `sql/estructura.sql` permite inspeccionar el esquema; no hace falta importarlo además de inicializar.

## IA

Cohere se llama desde el backend, con clave privada en .env y consentimiento en Mi cuenta. No hay modelo local ni respuesta simulada. Una llamada puede fallar y se informa sin reintentar automáticamente. [Referencia de la API](https://docs.cohere.com/v2/reference/chat).

## Estudiar y revisar

[Las nueve guías](guias/README.md) reparten los 37 endpoints reales entre nueve responsables principales. Cada MD indica método/ruta, entrada, handler, consultas, respuestas, errores, pantalla que lo llama y su diagrama. El reparto es para estudiar y defender, no una certificación de autoría.

[Mapa de operaciones UML](docs/METODOS-UML.md) · [Plan de reescritura](docs/PLAN.md) · [Verificación y límites](docs/VERIFICACION.md)

Se conserva la licencia y procedencia del catálogo en `models/exercises/`. No se incluyen fotos/GIF del conjunto original ni los documentos privados del curso. No hay suites de tests ni comentarios explicativos en el código entregado; la explicación está en los MD.
