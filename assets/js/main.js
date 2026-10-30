/* ==========================================================================
   PICHE Premium Services — interacciones y animaciones
   Sin dependencias. Cada bloque es independiente y se activa solo si
   encuentra sus elementos en la página.
   ========================================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "50377443687"; // Código de país + número, sin "+" ni espacios
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  /* Limpia el texto escrito por el usuario antes de enviarlo:
     quita caracteres de control, espacios repetidos y limita la longitud. */
  function clean(str, max) {
    return String(str || "").replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E]/g, " ")
      .replace(/\s+/g, " ").trim().slice(0, max || 200);
  }

  /* Abre WhatsApp en una pestaña nueva sin dar acceso a esta página (opener).
     Si el navegador bloquea la ventana, abre WhatsApp en la misma pestaña. */
  function openWhatsApp(lines) {
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    var win = window.open(url, "_blank");
    if (win) { try { win.opener = null; } catch (err) { /* sin acceso */ } }
    else location.href = url;
  }

  function pax(v) { var n = parseInt(v, 10); return n >= 1 && n <= 60 ? String(n) : ""; }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------
     1. Transición entre páginas (persianas con logo)
     --------------------------------------------------------------------- */
  function pageEnter() {
    if (!root.classList.contains("pt-covered")) return;
    root.classList.remove("pt-covered");
    if (reduceMotion) return;
    root.classList.add("pt-enter");
    setTimeout(function () { root.classList.remove("pt-enter"); }, 1400);
  }

  function isInternalPage(a) {
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return false;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|https?:|javascript:)/i.test(href)) return false;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin && location.protocol !== "file:") return false;
    // Mismo documento con ancla: no hacer transición
    if (url.pathname === location.pathname && url.hash) return false;
    return true;
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest("a");
    if (!isInternalPage(a)) return;
    e.preventDefault();
    var dest = a.href;
    document.body.classList.remove("menu-open");
    if (reduceMotion) { location.href = dest; return; }
    root.classList.add("pt-leave");
    setTimeout(function () { location.href = dest; }, 820);
  });

  // Al volver con el botón "atrás" (caché del navegador) se limpia el estado
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) root.classList.remove("pt-leave", "pt-covered", "pt-enter");
  });

  if (document.readyState === "complete") pageEnter();
  else window.addEventListener("load", pageEnter);
  // Respaldo por si alguna imagen tarda demasiado
  setTimeout(pageEnter, 2500);

  /* ---------------------------------------------------------------------
     2. Encabezado, progreso y botón flotante
     --------------------------------------------------------------------- */
  var header = $(".header");
  var progress = $(".progress");
  var waFloat = $(".wa-float");
  var lastY = window.scrollY;
  var ticking = false;
  var shiftEls = $$("[data-shift]");

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle("is-scrolled", y > 30);
      var menuOpen = document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", !menuOpen && y > 500 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove("is-hidden");
    }
    if (progress) progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 280);

    // Parallax ligero
    if (!reduceMotion) {
      shiftEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        var f = parseFloat(el.getAttribute("data-shift")) || 0.1;
        el.style.setProperty("--shift", (center * -f).toFixed(1) + "px");
      });
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------------------------------------------------------------
     3. Menú móvil
     --------------------------------------------------------------------- */
  var menuBtn = $(".menu-btn");
  if (menuBtn) {
    $$(".mobile-menu .m-link").forEach(function (l, i) { l.style.setProperty("--i", i); });
    var setMenu = function (open) {
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (open && header) header.classList.remove("is-hidden");
    };
    menuBtn.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 960) setMenu(false); });
  }

  /* ---------------------------------------------------------------------
     4. Texto dividido en palabras (títulos con clase .split)
     --------------------------------------------------------------------- */
  $$(".split").forEach(function (el) {
    var idx = 0;
    function wrapText(text, cls) {
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w";
        var inner = document.createElement("span");
        if (cls) inner.className = cls;
        inner.textContent = part;
        inner.style.setProperty("--wi", idx++);
        w.appendChild(inner); frag.appendChild(w);
      });
      return frag;
    }
    var label = el.textContent.replace(/\s+/g, " ").trim();
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = "";
    nodes.forEach(function (n) {
      if (n.nodeType === 3) el.appendChild(wrapText(n.textContent));
      else if (n.nodeName === "BR") el.appendChild(n);
      else if (n.nodeType === 1) el.appendChild(wrapText(n.textContent, n.className));
    });
    el.setAttribute("aria-label", label);
    $$(".w", el).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
  });

  /* ---------------------------------------------------------------------
     5. Aparición al hacer scroll
     --------------------------------------------------------------------- */
  $$("[data-stagger]").forEach(function (group) {
    var step = parseFloat(group.getAttribute("data-stagger")) || 0.08;
    $$("[data-reveal]", group).forEach(function (el, i) { el.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
  });
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    // Los elementos con recorte (clip) no son "visibles" para el observador,
    // así que se observa a su contenedor y se revelan sus hijos.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        if (t.__clipKids) t.__clipKids.forEach(function (k) { k.classList.add("is-in"); });
        else t.classList.add("is-in");
        io.unobserve(t);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) {
      if (el.getAttribute("data-reveal") === "clip") {
        var p = el.parentElement;
        (p.__clipKids = p.__clipKids || []).push(el);
        io.observe(p);
      } else io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------------------------------------------------------------
     6. Cursor personalizado, botones magnéticos y tarjetas 3D
     --------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    var ring = $(".cursor"), dot = $(".cursor-dot");
    if (ring && dot) {
      root.classList.add("has-cursor");
      var mx = -100, my = -100, rx = -100, ry = -100;
      window.addEventListener("pointermove", function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      }, { passive: true });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
        requestAnimationFrame(loop);
      })();
      document.addEventListener("pointerover", function (e) {
        ring.classList.toggle("is-hover", !!e.target.closest("a, button, label, input, select, textarea, [data-cursor]"));
      });
    }

    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--bx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
        b.style.setProperty("--by", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
    });

    $$(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        c.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
        c.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
      });
      c.addEventListener("pointerleave", function () { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
    });

    // Profundidad del microbús en la bienvenida
    var hero = $(".hero"), van = $(".hero__van");
    if (hero && van) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        van.style.setProperty("--px", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        van.style.setProperty("--py", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
      hero.addEventListener("pointerleave", function () { van.style.setProperty("--px", 0); van.style.setProperty("--py", 0); });
    }
  }

  /* ---------------------------------------------------------------------
     7. Galería con arrastre
     --------------------------------------------------------------------- */
  $$(".gallery").forEach(function (g) {
    var down = false, startX = 0, startLeft = 0;
    g.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; startX = e.clientX; startLeft = g.scrollLeft; g.classList.add("is-drag");
    });
    window.addEventListener("pointerup", function () { down = false; g.classList.remove("is-drag"); });
    g.addEventListener("pointermove", function (e) { if (down) g.scrollLeft = startLeft - (e.clientX - startX); });
  });

  /* ---------------------------------------------------------------------
     8. Pestañas de destinos
     --------------------------------------------------------------------- */
  $$(".tabs").forEach(function (tabs) {
    var btns = $$(".tab", tabs);
    var ind = $(".tabs__ind", tabs);
    function moveInd(btn) {
      if (!ind) return;
      ind.style.width = btn.offsetWidth + "px";
      ind.style.transform = "translateX(" + (btn.offsetLeft - 6) + "px)";
    }
    function select(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        if (!panel) return;
        panel.hidden = !on;
        if (on) {
          panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering");
          $$("[data-reveal]", panel).forEach(function (el) { el.classList.add("is-in"); });
        }
      });
      moveInd(btn);
      if (focus) btn.focus();
      if (btn.dataset.hash && history.replaceState) history.replaceState(null, "", "#" + btn.dataset.hash);
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
          select(n, true);
        }
      });
    });
    var initial = btns.filter(function (b) { return location.hash === "#" + b.dataset.hash; })[0] || btns[0];
    select(initial);
    window.addEventListener("resize", function () { moveInd(btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0]); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInd(btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0]); });
  });

  // Mapa de Centroamérica reacciona al país señalado
  var map = $(".ca__map img");
  $$(".country").forEach(function (c) {
    c.addEventListener("pointerenter", function () {
      $$(".country").forEach(function (o) { o.classList.toggle("is-active", o === c); });
      if (map && !reduceMotion) { map.style.setProperty("--rot", (c.dataset.rot || 0) + "deg"); map.style.setProperty("--sc", 1.05); }
    });
  });
  var countries = $(".countries");
  if (countries && map) countries.addEventListener("pointerleave", function () {
    map.style.setProperty("--rot", "0deg"); map.style.setProperty("--sc", 1);
    $$(".country").forEach(function (o) { o.classList.remove("is-active"); });
  });

  /* ---------------------------------------------------------------------
     9. Formulario de reserva por pasos → WhatsApp
     --------------------------------------------------------------------- */
  var form = $("#bookingForm");
  if (form) {
    var steps = $$(".step", form);
    var markers = $$(".stepper li");
    var msg = $(".form-msg", form);
    var current = 0;
    var viaPointer = false;
    form.addEventListener("pointerdown", function () { viaPointer = true; });
    form.addEventListener("keydown", function () { viaPointer = false; }, true);

    // Fecha mínima: hoy
    var fecha = form.elements.fecha;
    if (fecha) {
      var d = new Date();
      fecha.min = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    // Datos que llegan desde otras páginas (?servicio=...&destino=...)
    var params = new URLSearchParams(location.search);
    var preServ = params.get("servicio");
    if (preServ) {
      var radio = $$("input[name=servicio]", form).filter(function (r) { return r.value === preServ || r.dataset.key === preServ; })[0];
      if (radio) radio.checked = true;
    }
    var preDest = params.get("destino");
    if (preDest && form.elements.destino) form.elements.destino.value = preDest;

    // Contador de pasajeros
    $$(".counter", form).forEach(function (cnt) {
      var input = $("input", cnt);
      $$("button", cnt).forEach(function (b) {
        b.addEventListener("click", function () {
          var v = parseInt(input.value, 10) || 1;
          v += b.dataset.step === "+" ? 1 : -1;
          input.value = Math.max(parseInt(input.min, 10) || 1, Math.min(parseInt(input.max, 10) || 60, v));
        });
      });
    });

    function show(i, back, initial) {
      steps.forEach(function (s, n) {
        s.classList.toggle("is-active", n === i);
        s.classList.toggle("is-back", n === i && !!back);
      });
      markers.forEach(function (m, n) {
        m.classList.toggle("is-current", n === i);
        m.classList.toggle("is-done", n < i);
        if (n === i) m.setAttribute("aria-current", "step"); else m.removeAttribute("aria-current");
      });
      current = i;
      if (msg) msg.textContent = "";
      if (i === steps.length - 1) fillSummary();
      if (initial) return;
      var top = form.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      var focusable = $("input:not([type=hidden]), select, textarea", steps[i]);
      if (focusable && i > 0) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 350);
    }

    function validate(step) {
      var ok = true;
      $$("[required]", step).forEach(function (el) {
        var field = el.closest(".field");
        var valid = el.type === "radio" ? !!$("input[name=" + el.name + "]:checked", step) : el.checkValidity();
        if (field) field.classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok && msg) msg.textContent = step.getAttribute("data-error") || "Revisa los campos marcados para continuar.";
      return ok;
    }

    function value(name) {
      var el = form.elements[name];
      if (!el) return "";
      if (el instanceof RadioNodeList || (el.length && el[0] && el[0].type === "radio")) {
        var c = $("input[name=" + name + "]:checked", form);
        return c ? c.value : "";
      }
      return clean(el.value, el.maxLength > 0 ? el.maxLength : 200);
    }
    function formatDate(v) { if (!v) return ""; var p = v.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }

    function fillSummary() {
      var map = {
        servicio: value("servicio"),
        fecha: [formatDate(value("fecha")), value("hora")].filter(Boolean).join(" · "),
        pasajeros: value("pasajeros"),
        ruta: [value("origen"), value("destino")].filter(Boolean).join(" → ")
      };
      Object.keys(map).forEach(function (k) {
        var dd = $("[data-sum=" + k + "]", form);
        if (dd) dd.textContent = map[k] || "Por definir";
      });
    }

    form.addEventListener("click", function (e) {
      var next = e.target.closest("[data-next]"), prev = e.target.closest("[data-prev]");
      if (next) { e.preventDefault(); if (validate(steps[current])) show(Math.min(current + 1, steps.length - 1)); }
      if (prev) { e.preventDefault(); show(Math.max(current - 1, 0), true); }
    });
    form.addEventListener("input", function (e) {
      var f = e.target.closest(".field"); if (f) f.classList.remove("has-error");
    });
    form.addEventListener("change", function (e) {
      // Al elegir servicio en el paso 1 se avanza solo
      if (e.target.name === "servicio" && current === 0 && viaPointer) setTimeout(function () { show(1); }, 380);
    });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && current < steps.length - 1) {
        e.preventDefault(); if (validate(steps[current])) show(current + 1);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(steps[current])) return;
      var lines = [
        "Hola, quiero reservar un servicio con PICHE Premium Services.",
        "",
        "Nombre: " + value("nombre"),
        "Servicio: " + value("servicio")
      ];
      if (value("fecha")) lines.push("Fecha: " + formatDate(value("fecha")));
      if (value("hora")) lines.push("Hora: " + value("hora"));
      if (pax(value("pasajeros"))) lines.push("Pasajeros: " + pax(value("pasajeros")));
      if (value("origen")) lines.push("Origen: " + value("origen"));
      if (value("destino")) lines.push("Destino: " + value("destino"));
      if (value("vuelo")) lines.push("Vuelo: " + value("vuelo"));
      if (value("detalle")) lines.push("Detalles: " + value("detalle"));
      openWhatsApp(lines);
      if (msg) { msg.style.color = "#7ee2a3"; msg.textContent = "Abriendo WhatsApp con tu solicitud…"; }
    });

    show(preServ ? 1 : 0, false, true);
  }

  /* ---------------------------------------------------------------------
     10. Formulario rápido de la bienvenida → WhatsApp
     --------------------------------------------------------------------- */
  var quick = $("#quickForm");
  if (quick) {
    var qMsg = $(".form-msg", quick);
    var qFecha = quick.elements.fecha;
    if (qFecha) {
      var t = new Date();
      qFecha.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    }
    quick.addEventListener("input", function (e) { var f = e.target.closest(".field"); if (f) f.classList.remove("has-error"); });
    quick.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", quick).forEach(function (el) {
        var valid = el.checkValidity();
        el.closest(".field").classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { qMsg.style.color = ""; qMsg.textContent = "Completa tu nombre y el servicio para continuar."; return; }
      var v = function (n) { var el = quick.elements[n]; return clean(el.value, el.maxLength > 0 ? el.maxLength : 200); };
      var lines = ["Hola, quiero reservar un servicio con PICHE Premium Services.", "", "Nombre: " + v("nombre"), "Servicio: " + v("servicio")];
      if (v("fecha")) { var p = v("fecha").split("-"); lines.push("Fecha: " + p[2] + "/" + p[1] + "/" + p[0]); }
      if (pax(v("pasajeros"))) lines.push("Pasajeros: " + pax(v("pasajeros")));
      if (v("detalle")) lines.push("Ruta: " + v("detalle"));
      openWhatsApp(lines);
      qMsg.style.color = "#7ee2a3"; qMsg.textContent = "Abriendo WhatsApp con tu solicitud…";
    });
  }

  /* Foto del país en lugar del mapa al pasar el cursor */
  var mapBox = $(".ca__map"), caPhoto = $(".ca__photo");
  if (mapBox && caPhoto) {
    var caImg = $("img", caPhoto), caCap = $("figcaption", caPhoto);
    $$(".country").forEach(function (c) {
      // Precarga para que el cambio sea instantáneo
      if (c.dataset.photo) { var pre = new Image(); pre.src = c.dataset.photo; }
      c.addEventListener("pointerenter", function () {
        if (!c.dataset.photo) return;
        caImg.src = c.dataset.photo;
        caCap.textContent = $("h3", c).textContent;
        mapBox.classList.add("has-photo");
      });
    });
    if (countries) countries.addEventListener("pointerleave", function () { mapBox.classList.remove("has-photo"); });
  }

  /* ---------------------------------------------------------------------
     11. Detalles
     --------------------------------------------------------------------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
