# Plantilla Retro para presentar un proyecto

Plantilla web de una sola página con estética retro-futurista (póster vintage):
paleta ámbar/azul, tipografía condensada, texturas y animaciones al hacer scroll.
Sin frameworks ni pasos de compilación — solo HTML, CSS y JavaScript.

Secciones: **Presentación · Problema · Solución · Cómo funciona · Costos**.

## Archivos

```
pagina/
├── index.html      → estructura y contenido (5 secciones)
├── styles.css      → diseño, colores y animaciones
├── main.js         → navegación y animaciones al scroll
├── assets/         → coloca aquí tus imágenes si las usas
└── README.md
```

## Cómo verla en local

Basta con abrir `index.html` en el navegador (doble clic).
Si prefieres un servidor local:

```powershell
# Con Python instalado
python -m http.server 8000
# luego abre http://localhost:8000
```

## Personalización rápida

- **Textos:** edita `index.html`. Cada sección está comentada (Presentación, Problema, Solución, Cómo funciona, Costos).
- **Colores:** cambia las variables al inicio de `styles.css` en el bloque `:root`.
- **Precios:** en la sección "Costos" del `index.html` ajusta los planes, precios y características.
- **Pasos:** en "Cómo funciona" añade o quita elementos `<li class="step">`.
- **Imágenes/animaciones:** coloca tus archivos en `assets/` y referéncialos donde quieras (por ejemplo `<img src="assets/mi-imagen.png">`).

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube estos archivos:

   ```powershell
   git init
   git add .
   git commit -m "Plantilla retro del proyecto"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. En GitHub, ve a **Settings → Pages**.
3. En **Source**, elige la rama `main` y la carpeta `/root`.
4. Guarda. En un minuto tu sitio estará en:
   `https://TU_USUARIO.github.io/TU_REPO/`

> Consejo: si quieres que sea tu página principal (`https://TU_USUARIO.github.io/`),
> nombra el repositorio como `TU_USUARIO.github.io`.

## Accesibilidad

La plantilla respeta la preferencia `prefers-reduced-motion` para desactivar
animaciones en usuarios que lo configuren.
