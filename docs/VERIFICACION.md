# Verificación · edición 75

Revisión del recorte actual del 22 de octubre de 2026, con cuentas sintéticas y MySQL real. No certifica todas las alternativas de los diagramas ni ausencia de bugs.

## API y base

Se completaron **82 solicitudes HTTP** y 13 comprobaciones agrupadas: registro/login, perfil, mediciones e historial, objetivos, rutinas, copia de ejercicios al entrenar, cierre de sesión y separación entre cuentas. Las escrituras funcionan sin la cabecera especial ni el control de origen retirados. Más de 40 intentos de ingreso incorrectos no activan un limitador. Las rutas eliminadas devuelven 404 para una sesión válida; no hay modelo ni tabla activa de esa función. El perfil público no revela hashes y los filtros de propiedad siguen funcionando.

Se verificó que una edición inválida no cambie la rutina, que no haya dos entrenamientos activos para una cuenta y que una medición posterior no altere el progreso de un objetivo completado.

El chat respondió mediante Cohere real y conservó la conversación. Una segunda cuenta no pudo abrirla. Una prueba visual detectó una indicación de menú incorrecta: se incluyó el mapa real de navegación en el prompt y se volvió a comprobar con el proveedor la respuesta Entrenamientos / Tu historial. Eso no garantiza que un modelo nunca se equivoque. No hay respuesta simulada, modelo local ni reintento automático.

Se verificaron también dietas manuales, consumo, cálculo de macros proporcional a la cantidad e imposibilidad de dar de baja una dieta ajena. Se retiró solamente la tabla correspondiente a la función eliminada; las demás tablas de esta edición se conservaron.

## Pantallas y ejecución

Se recargó la aplicación compilada, cerró sesión y abrió el acceso nuevo: solo ofrece ingreso y registro, sin enlaces al flujo retirado. [Captura del acceso](capturas/acceso-recorte.png). Los recorridos de la edición anterior no sustituyen una certificación visual de todos los estados del recorte actual.

Ambos proyectos compilaron. npm audit no informó vulnerabilidades conocidas en backend y frontend en esta revisión. Vite mantiene el aviso de archivo principal superior a 500 kB; no es un error de compilación. Se verifican enlaces de documentación, nueve guías por versión y ausencia de secretos y suites de tests en los archivos versionados. No se prueba producción ni concurrencia masiva; al quitar los controles solicitados, no debe exponerse este servidor como un servicio público.
