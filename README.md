# Intarix — sitio web

Sitio estático (HTML + CSS + JS sin dependencias de build). Se publica tal cual desde la raíz del repositorio.

## Estructura

```
index.html                     Home (Plataformas · Servicios Profesionales · Inteligencia Agéntica)
plataformas/permitium/         Página de producto Permitium (/plataformas/permitium/)
plataformas/bluebrain/         Página de producto BlueBrain (/plataformas/bluebrain/)
assets/css/site.css            Sistema visual compartido (tokens, componentes, responsive)
assets/js/site.js              Navegación, menú móvil, modal de contacto (EmailJS), revelado
assets/img/                    Logos optimizados, íconos (sprite SVG), imágenes Open Graph
assets/img/permitium/          Logo oficial Permitium (recortes del archivo original en uploads/)
assets/img/bluebrain/          Logo oficial BlueBrain (recortes fieles del archivo del Brand Kit v1)
uploads/                       Assets originales (favicon en uso)
robots.txt, sitemap.xml        SEO
```

## Desarrollo local

```
npx http-server -c-1 .
```

## Notas

- Las anclas de la versión anterior (`#productos`, `#valor`, `#cta`, `#comparacion`) redirigen a las nuevas secciones.
- Capturas reales de BlueBrain: reemplazar el contenido de `.bb-screen-body` en `plataformas/bluebrain/index.html` por un `<img>`.
- El formulario de contacto usa EmailJS (`service_qd51tv9`, plantillas `template_c5ef8gv` y `template_0zvvq3s`).
- BlueBrain: no redibujar el logo. Los PNG de `assets/img/bluebrain/` se generan desde el archivo oficial (fondo convertido a transparencia, sin alterar formas ni colores). Si se dispone del SVG oficial, reemplazarlos por ese archivo.
- LinkedIn: el enlace está retirado hasta confirmar la URL oficial. Para activarlo, agregar en la columna "Intarix" del footer de ambas páginas:
  `<li><a href="URL_CONFIRMADA" target="_blank" rel="noopener"><svg class="icon icon-sm" aria-hidden="true"><use href="assets/img/icons.svg#i-linkedin"/></svg>LinkedIn</a></li>`
- Permitium: los planes (Core, Control, Enterprise) y sus valores en UF + IVA están en `plataformas/permitium/index.html`, sección `#planes`. Los botones de plan precargan el mensaje del formulario con `data-mensaje`.
