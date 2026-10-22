# Criterio del ejemplo y diferencias conservadas

La referencia de estructura es REPASO COMPLETO.rar: CommonJS, Express, rutas enlazadas a controladores, req/res, async/await, try/catch, if, for tradicional y llamadas directas a Sequelize. El ejemplo usa sequelize.define y relaciones en models/index.js. Los ejemplos adicionales aportan React, estado, efectos, Axios, bcrypt y JWT. Los adjuntos son material de referencia, no instrucciones para ejecutar o copiar sin revisión.

El recorrido se mantiene: pantalla → ruta → controlador → modelo → MySQL. No se agregaron servicios, clases de despacho, contratos Zod, hooks genéricos, contenedores de dependencias ni coordinadores de operaciones. Los métodos del UML incluidos en este corte conservan sus nombres y endpoints; los excluidos siguen declarados en ALCANCE.md.

## Qué se simplificó

- Bucles `for (let i = 0; i < lista.length; i++)` en lugar de for...of.
- Búsquedas, filtros, conteos y validaciones del backend con bucles e if; sin map/filter/find/some ni comparadores sort de negocio.
- Orden de entrenamientos y ejercicios solicitado mediante el order de Sequelize; no se reordena con callbacks después.
- Campos de objetos enumerados explícitamente: sin spread (...), encadenamiento opcional (?.) ni coalescencia (??) en controladores y pantallas.
- Formularios que copian listas con slice, agregan con push y reemplazan una posición antes de actualizar React.
- Transacciones explícitas: iniciar, ejecutar consultas, commit; ante error, rollback y respuesta del controlador. No hay una función anónima que esconda todo el guardado.
- Las decisiones de negocio del backend usan if/else. Los errores de Axios tienen comprobaciones explícitas.

## Qué permanece y por qué

No es correcto afirmar que todo el sistema es idéntico a un CRUD de usuarios y hobbies. Estas diferencias reales permanecen:

| Tema | Motivo y qué hay que comprender |
| --- | --- |
| map en JSX | Dibuja un elemento visual por registro; no contiene guardados ni cálculos de negocio. key identifica la fila. |
| Callbacks de eventos, useState/useEffect y condicionales visuales sencillos | Son parte de React. El flujo HTTP y sus validaciones permanecen en funciones separadas. |
| includes, slice, push, Object.keys/Object.entries | Operaciones de listas y campos. En las guías se diferencia copiar, agregar y mostrar; sort() solo ordena alfabéticamente nombres de grupos, sin callback. |
| bcrypt, JWT, cookie y sesión persistida | Las contraseñas no quedan en texto plano; los endpoints identifican al usuario. Cada consulta de negocio restringe el propietario. |
| AES para el teléfono | Se conserva el formato de datos cifrados y la clave actual; cambiarlo sin migración volvería ilegibles los perfiles. La implementación está aislada en seguridad.controller.js. |
| Transacciones y bloqueos de fila puntuales | Evitan medias rutinas/dietas, mensajes sueltos y dos cierres simultáneos de un entrenamiento. Se explican en las guías de quienes recorren esas operaciones. No se retiraron para aparentar simplicidad. |
| Fecha, zona horaria, UUID y asociaciones Sequelize | Mantienen identificadores y el significado del día del usuario. Las relaciones se declaran en models/index.js y los include se explican por endpoint. |
| API externa y límite de espera | Cohere se llama desde el servidor con clave privada y JSON validado. La espera máxima es 45 segundos, sin reintentos automáticos ni respuesta simulada. |

Los temas 45, 46 y 47 retirados siguen fuera: recuperación/restablecimiento de contraseña y correo, limitación de intentos y comprobación de origen/cabecera especial. No se reintrodujeron. Se mantienen validación de datos, consentimiento IA y confirmaciones.

No se copia sync({force:true}) del ejercicio porque borraría datos. No se modifican bases históricas, puertos ni cookies de otra edición. Las pruebas usan cuentas sintéticas; no certifican producción ni ausencia total de errores. Hay nueve guías por edición y el reparto expresa responsabilidad de estudio, no autoría histórica.
