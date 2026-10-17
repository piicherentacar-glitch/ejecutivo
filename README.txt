TRANSPORTE EJECUTIVO PREMIUM — PAQUETE PARA NETLIFY

CONTENIDO
- index.html: sitio estático responsive, con menú móvil, secciones de servicios y formulario.
- assets/hero-transporte-ejecutivo.png: nueva imagen principal.
- netlify.toml: configuración básica de publicación y encabezados.

PROBAR LOCALMENTE
Abre index.html en un navegador. Para probarlo como sitio estático también puedes usar una extensión de servidor local.

PUBLICAR EN NETLIFY (SIN GITHUB)
1. Descomprime transporte-ejecutivo-netlify.zip.
2. Entra a https://app.netlify.com/drop
3. Arrastra la carpeta descomprimida (o el contenido de la carpeta) al área de despliegue.
4. Netlify generará una URL temporal *.netlify.app.
5. Prueba la web en móvil y escritorio antes de compartirla.

PUBLICAR CON GITHUB
1. Sube index.html, netlify.toml y la carpeta assets a un repositorio.
2. En Netlify elige Add new site > Import an existing project.
3. Selecciona el repositorio. Build command: dejar vacío. Publish directory: .
4. Despliega y prueba el formulario.

FUNCIONALIDAD ACTUAL
- Diseño adaptable a móvil y escritorio.
- Navegación y menú móvil.
- Formulario que valida nombre y servicio, y prepara una solicitud en WhatsApp.
- Enlaces directos a WhatsApp y teléfono.
- Fecha mínima configurada al día actual y año automático en el pie.

IMPORTANTE
El formulario abre WhatsApp con el mensaje preparado; no guarda reservas en una base de datos ni envía correo por sí solo. El teléfono configurado es +503 7744 3587. Verifica que sea el número correcto antes de publicar.
La imagen principal es una imagen publicitaria generada para el diseño, no una fotografía documental del vehículo real.
