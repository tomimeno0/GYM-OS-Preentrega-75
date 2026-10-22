# Preentrega del 75 %

El corte incluye 29 de los 39 casos nominales del proyecto: 74,36 %. Es la aproximación más cercana al 75 % usando el número de casos; no un porcentaje de esfuerzo ni de caracteres. El proyecto completo y la preentrega del 50 % permanecen separados y sin modificaciones.

Incluye CU001–CU022, CU024, CU025 y CU027–CU031: registro, ingreso, salida, recuperación, perfil y borrado propios; mediciones e historial; objetivos y progreso; rutinas manuales y con IA, adaptación de rutinas; sesiones deportivas; dietas manuales; registro alimentario y macros; chat con IA.

No incluye CU023 ni CU026 (generar/adaptar dietas con IA), ni CU032–CU039 (administración de terceros y roles). No se muestran botones ni se habilitan rutas para esos casos.

Las credenciales y los datos de las entregas anteriores no se migran ni se alteran. Esta copia usa una base independiente, otro puerto y otra cookie. El repositorio contiene código y documentación; no guarda claves ni la base local.

## Qué se simplificó y qué no se afirma

Las operaciones del corte son funciones de controladores; no se reproduce la jerarquía de clases del UML mediante wrappers. Se mantienen sus nombres (incluidas las grafías `definirObjeto`, `visuaizarObjetivo`, `encriptarRreversible` y las dos variantes de consulta IA). Es una adaptación funcional a la estructura del profesor, no equivalencia estructural de clases.

Las columnas `dvh` del DER están reservadas y quedan vacías. No se implementa el sistema anterior de DVH/DVV, ni se afirma que `digitoVerificador`/`digitoVerificado` estén funcionando. Ese sistema y los métodos administrativos y de dietas IA quedan fuera de esta copia simplificada. Se prioriza el pedido posterior de quitar la complejidad no presente en el repaso. La bitácora básica de cuentas, medidas y objetivos no constituye una auditoría completa del sistema.

Los macros se calculan a partir de la etiqueta ingresada manualmente; no hay un catálogo externo de alimentos ni verificación nutricional de esos valores. Los planes y consumos se muestran por separado. Los gráficos representan registros reales, no pronósticos.

Se usa una transacción concreta al guardar varias filas relacionadas y un límite de espera en IA; no hay colas, circuit breakers, fallback a modelos locales ni tolerancia automática a fallos. Los errores de conexión se muestran para que la persona decida volver a intentar.

El despliegue es local. No se incluyen administración, planes de dieta con IA, certificaciones, correo SMTP entregado de extremo a extremo ni pruebas de carga de producción. El conteo de 29 casos describe funciones alcanzadas, no garantiza cada condición secundaria de todos los diagramas originales.
