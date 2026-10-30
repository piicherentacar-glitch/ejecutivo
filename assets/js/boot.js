/* Se ejecuta antes de pintar la página: activa los estilos con JavaScript
   y cubre la pantalla para la transición de entrada. */
(function () {
  var html = document.documentElement;
  html.classList.add("js", "pt-covered");
  // Respaldo: si algo falla, la página se descubre sola a los 4 segundos.
  setTimeout(function () { html.classList.remove("pt-covered"); }, 4000);
})();
