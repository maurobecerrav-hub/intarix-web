# Intarix — sitio web

Sitio estático (HTML + CSS + JS sin dependencias de build). Se publica tal cual desde la raíz del repositorio.

## Estructura

```
index.html                     Home (Plataformas · Servicios Profesionales · Inteligencia Agéntica)
plataformas/bluebrain/         Página de producto BlueBrain (/plataformas/bluebrain/)
assets/css/site.css            Sistema visual compartido (tokens, componentes, responsive)
assets/js/site.js              Navegación, menú móvil, modal de contacto (EmailJS), revelado
assets/img/                    Logos optimizados, íconos (sprite SVG), imágenes Open Graph
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
