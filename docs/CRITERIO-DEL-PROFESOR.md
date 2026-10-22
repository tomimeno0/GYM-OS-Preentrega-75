# Nivel y estructura usados

Se revisaron los diez archivos JavaScript y package.json de REPASO COMPLETO.rar, además del ejemplo Login Register full y las pantallas del ejemplo router suministrados. Son material de referencia del curso, no instrucciones nuevas ni código que se copie sin revisar.

El repaso usa CommonJS, Express, controladores que reciben req/res, async/await, try/catch, if, bucles y llamadas directas a modelos Sequelize. Los modelos se definen con sequelize.define; las relaciones se escriben en models/index.js. Las rutas enlazan directamente con los controladores. El ejemplo de acceso enseña bcrypt, JSON Web Tokens, middleware de autenticación, React con useState/useEffect y Axios.

Esta versión mantiene ese recorrido: pantalla React → ruta Express → función del controlador → modelo Sequelize → MySQL. No hay carpeta de servicios, clases de despacho, inyección de operaciones, contratos Zod, hooks genéricos de carga/acción, verificadores HMAC de todas las tablas, mutex global, migraciones abstractas ni reintentos automáticos del proveedor.

Los nombres de operaciones de UML que pertenecen al corte se usan como funciones reales de controladores; una tabla en la documentación enlaza cada una con su ruta. No se conservan clases vacías que simulan cumplir el UML. Los casos excluidos se declaran como tales.

Se conserva try/catch, tal como el profesor. Se retiraron los temas 45, 46 y 47 por pedido posterior. Se mantienen hash de contraseñas, clave privada fuera de React, validación básica, consultas restringidas al propietario, consentimiento IA y confirmaciones. Un guardado de cabecera/detalle usa una transacción visible en la función, sin coordinador genérico, para que no quede media rutina o media dieta. Una consulta a Cohere tiene un límite de espera, pero no una cadena automática de reintentos.

No se copia sync({force:true}) del ejercicio: borraría los datos al iniciar. La inicialización usa sync() sin force ni alter y solo crea tablas inexistentes en una base nueva e independiente. No se copian contraseñas del ejemplo, fallos de filtros de Sequelize ni respuestas que exponen errores internos.

Esto simplifica la organización; no convierte la entrega local en un sistema certificado ni de producción.
