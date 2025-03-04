# Fuentes necesarias para Cybervania

El sistema de menú requiere la siguiente fuente:

- `neogothic.woff2` - Una fuente gótica con estética digital para todo el juego

Si no tienes esta fuente, puedes reemplazarla por una similar o modificar el CSS para usar:
```css
font-family: 'Cinzel', 'Times New Roman', serif;
```

Y agregar la importación de Google Fonts al inicio del archivo CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
```

# Fuente pixelada para el tema SNES

Para el estilo de 16 bits, necesitas añadir la siguiente fuente:

- `PressStart2P-Regular.woff2` - Una fuente pixelada que emula la tipografía de juegos retro

Puedes descargar la fuente "Press Start 2P" desde:
- [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P)
- [Font Library](https://fontlibrary.org/en/font/press-start-2p)

O alternativamente, agregar la referencia CDN en el HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

Y usarla en el CSS directamente:
```css
font-family: 'Press Start 2P', monospace;
```
