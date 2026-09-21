# Plan: Regalo web "Flores Amarillas" para Kamila 🌼

## Contexto (léelo primero, Claude Code)
Es un regalo para mi novia **Kamila** (con K) por el Día de la Flor Amarilla (21 de septiembre).
La tradición viene de la telenovela argentina *Floricienta* y su canción "Flores Amarillas": la protagonista sueña con que su amor le regale flores amarillas.

**El detalle clave:** Kamila misma me pidió que le regalara flores amarillas, "aunque sea dibujadas". Para ella es una ilusión. La página debe jugar con eso: *ella sabía que yo sabía*, porque literalmente me lo dijo. Es su deseo cumplido.

Ella la va a abrir **en su teléfono**, desde un enlace que le mando por WhatsApp esta noche, para que lo vea al despertar.

## Requisitos técnicos
- Solo HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin dependencias.
- **Mobile-first**, pensado para pantalla vertical de teléfono. Que también se vea decente en computadora.
- Debe funcionar subido a **GitHub Pages** (rutas relativas, nada de servidor).
- Liviano: que cargue rápido con datos móviles.
- Respetar `prefers-reduced-motion` (animaciones más suaves si el usuario lo tiene activado).

## Estructura de carpeta
```
flores-kamila/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── cancion.mp3       ← lo pongo yo
│   ├── preview.jpg       ← imagen para la vista previa en WhatsApp (1200x630)
│   └── foto.jpg          ← opcional, foto de nosotros para el final
└── PLAN.md
```

## Estética
- Paleta amarilla cálida: amarillo girasol, dorado suave, crema, con toques de verde para tallos/hojas.
- Tipografía bonita de Google Fonts (una manuscrita para títulos y una limpia para texto), con fallbacks.
- Pétalos amarillos cayendo suavemente de fondo durante toda la experiencia.
- Todo con transiciones suaves; nada brusco.

## Flujo de la experiencia (pantallas en secuencia)

**1. Pantalla de inicio**
- Fondo cálido, pétalos cayendo.
- Texto: "Kamila… sé que estabas esperando esto 🌼"
- Un botón grande y bonito: "Toca aquí". 
- IMPORTANTE: este primer toque es el que **arranca la música** (los navegadores móviles bloquean el autoplay; el audio solo puede empezar tras una interacción del usuario).

**2. La flor florece**
- Una flor amarilla dibujada en **SVG** que crece: primero el tallo, luego las hojas, luego los pétalos se abren uno a uno, y el centro aparece al final.
- Idealmente varias flores (un pequeño ramo) que florecen escalonadas.
- Guiño al "aunque sea dibujadas": un textito tipo "Me las pediste, aunque fueran dibujadas… así que aquí están, hechas por mí 💛"

**3. La frase de la canción**
- Aparece con fade-in la frase famosa del coro de "Flores Amarillas".
- Debajo, mi toque personal, algo como: "Y sí… yo sabía. Porque tú me lo dijiste."
- (Dejar un placeholder `<!-- FRASE DE LA CANCIÓN -->` en el HTML; yo la escribo.)

**4. Mi mensaje para ella**
- Un párrafo mío, directo para Kamila. Dejar placeholder `<!-- MI MENSAJE -->` con texto de ejemplo que yo reemplazo.
- Mencionar que para ella esto era una ilusión y hoy es un deseo cumplido.

**5. Final: "Para ti"**
- Un botoncito "Para ti 💛" que al tocarlo revela un mensaje escondido y/u una foto nuestra (`assets/foto.jpg`, opcional: si no existe, que no se rompa).

**Navegación:** avanzar tocando la pantalla o con botones "Siguiente" discretos. Que no haya forma de perderse.

## Música
- Archivo `assets/cancion.mp3`.
- Arranca con el primer toque (pantalla 1).
- Botón flotante pequeño y discreto (esquina) para pausar/reanudar, con ícono de nota musical.
- Volumen inicial moderado, con fade-in suave del audio.
- Si el archivo no carga, la página sigue funcionando igual.

## Vista previa bonita en WhatsApp
En el `<head>` agregar etiquetas Open Graph:
- `og:title`: "Para Kamila 🌼"
- `og:description`: "Sé que estabas esperando esto…"
- `og:image`: URL **absoluta** de `assets/preview.jpg` en GitHub Pages (ej. `https://MIUSUARIO.github.io/flores-kamila/assets/preview.jpg`), dejar placeholder para reemplazar.
- `og:type`: website
- También `<title>` y favicon 🌼.

## Publicar en GitHub Pages (esta noche)
1. Crear repo público `flores-kamila` en GitHub.
2. Subir todos los archivos a la rama `main`.
3. Settings → Pages → Source: "Deploy from a branch" → `main` / root → Save.
4. Esperar 1–2 minutos. El enlace queda: `https://MIUSUARIO.github.io/flores-kamila/`
5. Actualizar la URL absoluta de `og:image` y volver a subir.

## Checklist antes de mandarlo
- [ ] Abrirlo en MI teléfono desde el enlace real (no local).
- [ ] Probar en Chrome y en Safari si es posible.
- [ ] Confirmar que la música suena tras el primer toque.
- [ ] Revisar que no haya scroll horizontal ni texto cortado.
- [ ] Mandarme el enlace a mí mismo por WhatsApp para ver la vista previa.
- [ ] Revisar ortografía del nombre: **Kamila**, con K.
- [ ] Programar/mandar el mensaje para que lo vea al despertar. 💛
