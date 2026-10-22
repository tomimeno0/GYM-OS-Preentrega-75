# Verificación de esta copia

Revisión local del 22 de octubre de 2026, con datos sintéticos y una base MySQL separada. No es una certificación de ausencia de bugs ni una afirmación de cumplimiento de todas las condiciones del sistema completo.

## Funcionamiento comprobado

Se ejecutó un recorrido de 57 solicitudes HTTP contra Express y MySQL reales: registro, acceso incorrecto/correcto, campos públicos, rechazo de contraseña que excede el límite de bcrypt, perfil y fechas, consentimiento, medidas iniciales/posteriores, objetivo único, catálogo, rutina manual y edición, inicio/cierre de entrenamiento, dieta manual, consumos/macros, cierre de sesión y recuperación de un solo uso. Se comprobaron rechazos al intentar operar con registros de otra cuenta. La baja de una cuenta sintética con datos en todos los módulos eliminó sus dependencias y revocó el acceso.

Se probaron además un fallo de base durante la inserción del segundo ejercicio (sin cabecera ni detalle parcial), dos inicios de entrenamiento concurrentes (solo uno aceptado), consumo UTC cercano a medianoche en Buenos Aires, origen ajeno rechazado y separación de conversaciones. El fallo sintético se eliminó al terminar la prueba.

Un objetivo completado conserva el instante de cierre en `fecha_cierre`: se probó que una medición posterior, incluso del mismo día, no cambie su progreso. La fecha visible `fecha_completado` se conserva por separado. Es un campo auxiliar explícito agregado al modelo, no un sistema de migraciones.

La IA se probó con Cohere real: consulta de soporte, seguimiento con historial, generación de rutina y adaptación de la misma rutina. Se verificó persistencia de mensajes y ejercicios; no se usó un modelo local ni una respuesta simulada. También se levantó temporalmente una instancia sin clave: devolvió error 503, indicó que no pudo responder y no creó una conversación. Disponibilidad futura, límites gratuitos y calidad de propuestas dependen del proveedor.

## Interfaz real

Se abrió la aplicación compilada en el navegador integrado. Desde las pantallas se inició sesión, agregó una medición, creó y editó una rutina, inició y completó un entrenamiento, creó una dieta, canceló su baja y registró un consumo cuya cantidad produjo el total esperado. Una consulta enviada desde el chat recibió respuesta real de Cohere.

Se revisó la página de inicio, el resumen de escritorio, el chat y el resumen móvil. Las nueve pantallas protegidas se recorrieron a 390 px: ninguna amplió el ancho del documento. Eso comprueba el ancho, no todas las combinaciones de dispositivos, teclados o lectores de pantalla.

Los diálogos nativos que bloquearon una prueba se reemplazaron por confirmaciones dentro de la página. Se comprobó aceptar y cancelar sin recurrir a `window.confirm`. La confirmación admite Escape y mantiene Tab dentro de sus dos botones.

Capturas con datos sintéticos: [resumen de escritorio](capturas/resumen.png), [resumen móvil](capturas/resumen-movil.png) y [chat móvil](capturas/asistente-movil.png).

## Entrega y límites

La compilación terminó correctamente. Las auditorías de dependencias de npm no informaron vulnerabilidades conocidas en los dos proyectos al ejecutar la revisión. Se actualizó Vite por los avisos de seguridad detectados en la versión inicial. El compilador advierte que el archivo JavaScript principal supera 500 kB; se conserva una organización simple, sin agregar carga diferida solo para silenciar ese aviso.

La inicialización de tablas se ejecutó sin borrar tablas. El esquema SQL exportado contiene estructura, no datos ni contraseñas. Se revisaron enlaces locales de guías y documentación. Los scripts de prueba, cuentas sintéticas y resultados detallados están fuera del código versionado.

No se probaron entrega SMTP real, cargas de producción, todos los navegadores ni todas las alternativas del PDF original. La aplicación no tiene administración, dieta IA ni el sistema de DVH/DVV de la arquitectura anterior. Ver [ALCANCE.md](ALCANCE.md). Las entregas anteriores permanecen separadas.
