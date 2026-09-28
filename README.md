# Portfolio · David Rodríguez San Miguel

Portfolio personal publicado con GitHub Pages en **https://davidrodriguez05.github.io**.

Está hecho con HTML, CSS y JavaScript, sin frameworks, sin dependencias y sin paso de compilación. Lo que ves en el repositorio es exactamente lo que se publica.

## Estructura

```text
.
├── index.html                  Página principal (todo el contenido está aquí)
├── 404.html                    Página para enlaces que no existen
├── css/style.css               Estilos (colores y tipografía al principio del archivo)
├── js/script.js                Tema claro/oscuro, menú móvil, copiar email, animaciones
├── assets/
│   ├── cv/CV-David-Rodriguez-San-Miguel.pdf
│   ├── fonts/                  Geist y Geist Mono (licencia OFL), alojadas aquí
│   ├── icons/                  favicon.svg y apple-touch-icon.png
│   └── images/                 og-image.png (vista previa al compartir) y capturas
├── robots.txt · sitemap.xml    SEO básico
├── .nojekyll                   Le dice a GitHub Pages que no procese la web con Jekyll
└── README.md
```

## Verlo en local

Para verla exactamente como en GitHub Pages, sírvela con un servidor local. Si abres `index.html` con doble clic, algunos navegadores no cargan las fuentes.

- **VS Code:** instala la extensión **Live Server** y pulsa **Go Live**. Recarga sola cada vez que guardas.
- **Python:** ejecuta `python -m http.server 8000` en la carpeta y abre http://localhost:8000

## Publicar en GitHub Pages

El repositorio `DavidRodriguez05/DavidRodriguez05.github.io` ya existe y es público, así que solo tienes que subir los archivos y activar Pages una vez.

### 1. Crear el repositorio (solo si empezaras de cero)

1. En GitHub, pulsa **New repository**.
2. Nómbralo **exactamente** `DavidRodriguez05.github.io`.
3. Márcalo como **Public** (en el plan gratuito, Pages solo funciona con repositorios públicos) y créalo.

### 2. Subir los archivos

Desde la carpeta del proyecto:

```bash
git add .
git commit -m "Portfolio: primera versión"
git push origin main
```

### 3. Activar GitHub Pages publicando desde `main`

1. En el repositorio, entra en **Settings → Pages**.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. En **Branch**, elige `main` y la carpeta `/ (root)`, y pulsa **Save**.
4. Espera uno o dos minutos. El progreso se ve en la pestaña **Actions**.
5. Abre https://davidrodriguez05.github.io

A partir de ahí, cada `git push` a `main` vuelve a publicar la web automáticamente.

## Dominio personalizado (por ejemplo, `midominio.dev`), sin VPS

GitHub Pages sigue alojando la web gratis. Tú solo pagas el dominio, que para un `.dev` suele costar entre 10 y 20 € al año en Cloudflare, Porkbun o Namecheap.

1. **Compra el dominio** en cualquier registrador.
2. **Verifica el dominio en GitHub.** En tu perfil, ve a **Settings → Pages → Add a domain** y añade el registro TXT que te indique en el DNS. Esto evita que otra persona pueda usar tu dominio en su GitHub.
3. **Configura el DNS** en el registrador:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `davidrodriguez05.github.io` |

   Si usas Cloudflare, deja los registros en **DNS only** (nube gris) al menos hasta que GitHub emita el certificado.

4. En el repositorio, ve a **Settings → Pages → Custom domain**, escribe `midominio.dev` y pulsa **Save**. GitHub crea un archivo `CNAME` en el repositorio; no lo borres.
5. Cuando la comprobación DNS salga en verde (puede tardar desde minutos hasta 24 horas), marca **Enforce HTTPS**. Los dominios `.dev` **solo funcionan con HTTPS**, así que hasta que GitHub emita el certificado la web no cargará en el navegador. Es normal.
6. **Cambia la URL** `https://davidrodriguez05.github.io/` por `https://midominio.dev/` en:
   - `index.html`: `<link rel="canonical">`, `og:url`, `og:image` y el campo `"url"` del bloque JSON-LD
   - `sitemap.xml` y `robots.txt`

La dirección antigua `davidrodriguez05.github.io` redirigirá automáticamente al dominio nuevo.

## Cómo actualizar el portfolio

Todo el contenido está en `index.html`. Cada sección empieza con un comentario del tipo `<!-- ============ PROYECTOS ============ -->`.

### Hacer público el código de un proyecto

En el `<div class="project__links">` del proyecto, cambia:

```html
data-repo-public="false"   →   data-repo-public="true"
```

- **HabitFlow** y **FlowManager** ya están enlazados (`data-repo-public="true"`).
- **Gestión de mantenimiento** es código de una empresa: se queda como "Código fuente privado".

⚠️ **Antes de hacer público cualquier repositorio**, comprueba que no contenga claves de API, contraseñas de base de datos, datos de usuarios reales ni información personal, **incluido el historial de commits**. Las credenciales van en un archivo que esté en `.gitignore`, como `src/config/config.php` en FlowManager.

### Añadir capturas

1. Guarda las imágenes en `assets/images/`. Formato recomendado: `.webp`, unos 1280×800 px y menos de 200 KB. Puedes convertirlas en https://squoosh.app.
2. En el proyecto, sustituye el `<svg class="cover">…</svg>` que hay dentro de `.project__media` por:

   ```html
   <img src="assets/images/habitflow-1.webp" alt="Pantalla de hábitos de HabitFlow en un móvil" width="1280" height="800" loading="lazy" decoding="async">
   ```

   El `alt` debe describir lo que se ve en la captura.

### Añadir un enlace de demo o de Google Play

Dentro de `.project__links`, antes del enlace de GitHub:

```html
<a class="repo-link" href="https://URL-DE-LA-DEMO" target="_blank" rel="noopener noreferrer">Ver demo<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>
```

### Añadir un proyecto, una experiencia o una formación

Copia un bloque `<article class="project">…</article>` o `<li class="timeline__item">…</li>` completo, pégalo donde quieras que aparezca y cambia los textos. En los proyectos, cambia también el `id` del título (`p-…`) y su `aria-labelledby` para que no se repitan.

### Tecnologías

Cada tecnología es un `<li class="chip">`. Las de **uso habitual** llevan `chip chip--main` y el texto oculto `<span class="visually-hidden">, uso habitual</span>`, que sirve para lectores de pantalla.

### Cambiar el CV

Sustituye `assets/cv/CV-David-Rodriguez-San-Miguel.pdf` por la versión nueva **con el mismo nombre de archivo**. Así no tienes que tocar el HTML.

### Si dejas de estar disponible (o cambias de situación)

Actualiza estos puntos:

- La etiqueta **"Disponible para trabajar"** de la presentación (`.status`)
- `"disponible": true` en la tarjeta `GET /api/perfil`
- La frase final de Contacto (`.contact__note`)
- `assets/images/og-image.png`, porque la imagen que aparece al compartir el enlace también lo dice

### Colores y tipografía

Están al principio de `css/style.css`, en `:root` (tema claro) y en los dos bloques del tema oscuro. Si cambias un color del tema oscuro, cámbialo **en los dos bloques**.

## Checklist antes de cada `git push`

- [ ] La página se ve bien en el móvil (en Chrome: F12 y el icono de móvil) y en tema claro y oscuro
- [ ] Todos los enlaces nuevos funcionan y los externos llevan `target="_blank" rel="noopener noreferrer"`
- [ ] Las imágenes nuevas tienen `alt`, `width` y `height`
- [ ] Si has cambiado el título o la descripción, actualiza también `og:title` y `og:description`
- [ ] Actualiza la fecha `<lastmod>` de `sitemap.xml`
- [ ] No has subido nada privado: claves, datos de clientes, código sin permiso
- [ ] Opcional: pasa **Lighthouse** (F12 → Lighthouse) para revisar rendimiento, accesibilidad y SEO
