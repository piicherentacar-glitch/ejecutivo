PICHE PREMIUM SERVICES — SITIO WEB V2 (multipágina, estilo oscuro premium)

PUBLICAR EN NETLIFY
Sube la carpeta completa (o el ZIP descomprimido) a https://app.netlify.com/drop.
No se necesita ninguna instalación ni compilación.

PÁGINAS
- index.html      Inicio (bienvenida, servicios, accesos a Flota y Destinos)
- servicios.html  Servicios detallados y logística completa
- flota.html      Microbús ejecutivo, SUV ejecutiva y galería
- destinos.html   Pestañas: El Salvador / Centroamérica
- reservar.html   Formulario en 3 pasos que envía la solicitud a WhatsApp
- 404.html        Página de "ruta no encontrada"

ESTRUCTURA DEL CÓDIGO
- assets/css/styles.css  Todo el diseño (colores y tipografías al inicio, en :root)
- assets/js/main.js      Todas las animaciones e interacciones, sin librerías externas
- assets/img/            Imágenes optimizadas (antes iban incrustadas en el HTML)

CAMBIOS RÁPIDOS
- Número de WhatsApp del formulario: assets/js/main.js, variable WA_NUMBER.
  Los enlaces directos de WhatsApp están en cada página (buscar 50377443687).
- Colores: assets/css/styles.css, variables --red, --red-2, --bg, etc.

EFECTOS INCLUIDOS
- Transición exclusiva entre páginas: persianas rojas/negras con el logo.
- Títulos que aparecen palabra por palabra; elementos que se revelan al hacer scroll.
- Bienvenida con zoom lento de la foto, microbús que entra con destello y responde al mouse.
- Franja de beneficios en movimiento, tarjetas 3D con luz que sigue al cursor.
- Cursor personalizado y botones magnéticos (solo computadoras).
- Menú móvil a pantalla completa que se abre en círculo.
- Pestañas animadas en Destinos; el mapa reacciona al país señalado.
- Formulario por pasos con barra de progreso, contador de pasajeros y resumen.
- Encabezado que se oculta al bajar y aparece al subir; barra de progreso de lectura.
- Si el dispositivo tiene activado "reducir movimiento", las animaciones se desactivan.

IMPORTANTE
El formulario abre WhatsApp; no almacena reservas en una base de datos.
Revisa que los destinos de Centroamérica listados coincidan con las rutas que ofrecen.


ACTUALIZACIÓN: FORMULARIO EN INICIO Y FOTOS
- La bienvenida ahora tiene el formulario de reserva rápida (se quitó el microbús flotante de la página principal).
  Envía nombre, servicio, fecha, pasajeros y ruta directamente a WhatsApp.
- Fotos en alta calidad en Flota, Servicios e Inicio (vehículos ejecutivos, interiores y chofer).
- Destinos: cada tarjeta muestra una foto del lugar al pasar el cursor (en celulares se ve siempre, más tenue).
  En Centroamérica, al señalar un país, el mapa se cambia por una foto de referencia.

FOTOS DE UNSPLASH
Las fotos nuevas se cargan desde images.unsplash.com (licencia Unsplash: uso comercial gratuito,
sin atribución obligatoria). Son fotos de referencia, no de la flota de PICHE.
Para usar fotos propias: guárdalas en assets/img/ y cambia la dirección en el atributo src
de la imagen correspondiente en el HTML.


ACTUALIZACIÓN: HIACE, SEGURIDAD Y FORMULARIOS
- Inicio: se eliminó el microbús flotante; queda el formulario de reserva rápida.
- Las fotos del microbús ahora muestran una Toyota Hiace (Pexels, licencia de uso comercial gratuito).
- Seguridad (netlify.toml):
  * Content-Security-Policy estricta: solo se cargan scripts del propio sitio, fuentes de Google
    y fotos de images.unsplash.com / images.pexels.com.
  * HSTS (solo HTTPS), X-Frame-Options DENY (nadie puede incrustar el sitio), nosniff,
    Referrer-Policy y Permissions-Policy (cámara, micrófono, ubicación y pagos desactivados).
  * Sin código JavaScript en línea (el script inicial está en assets/js/boot.js).
  * Enlaces externos con rel="noopener noreferrer"; WhatsApp se abre sin acceso a la página.
  * Los formularios limpian el texto (caracteres de control, longitud máxima) y validan pasajeros (1 a 60).
- Todos los formularios y botones envían a WhatsApp +503 7744 3687 (wa.me/50377443687).
  El sitio no guarda datos personales ni realiza cobros.


ACTUALIZACIÓN: LOGO OFICIAL
- Se reemplazó el logo por el oficial "PICHE Rent a Car y Multiservicios" en alta resolución
  (assets/img/logo-piche.webp y logo-piche.png, 1200 px de ancho, nítido en pantallas retina).
- Se usa en el encabezado, el pie de página y la transición entre páginas.
- Nuevos íconos del sitio: assets/img/favicon.png y apple-touch-icon.png (el carro del logo).
- Los archivos logo.png y logo-blanco.png ya no se usan y pueden borrarse.
