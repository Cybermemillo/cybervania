/**
 * Efectos visuales para el tema retro de SNES en Cybervania
 * Implementa efectos visuales que emulan la estética de 16-bits
 */
export class RetroEffects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.pixelSize = 4;
        this.initialized = false;
        
        this.initialize();
    }
    
    /**
     * Inicializa los efectos retro
     */
    initialize() {
        if (this.initialized) return;
        
        // Crear el fondo de píxeles aleatorios
        this.createPixelBg();
        
        // Añadir efecto de líneas de escaneo CRT
        this.addScanlines();
        
        // Añadir efectos de interferencia aleatorios
        this.setupInterferenceEffects();
        
        this.initialized = true;
    }
    
    /**
     * Crea un fondo con píxeles aleatorios estilo 16-bits
     */
    createPixelBg() {
        // Crear el contenedor para los píxeles
        const pixelContainer = document.createElement('div');
        pixelContainer.className = 'retro-pixel-container';
        pixelContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            opacity: 0.3;
        `;
        
        // Colores retro para los píxeles
        const pixelColors = [
            '#ff005b', // cyber-pink
            '#00f6ff', // cyber-teal
            '#c8aa6e', // gothic-gold
            '#a5161d', // gothic-blood
            '#8f0a93', // snes-purple
            '#38b764', // snes-green
            '#326fd1'  // snes-blue
        ];
        
        // Crear píxeles dispersos por el fondo
        const pixelCount = Math.min(30, Math.floor((window.innerWidth * window.innerHeight) / 50000));
        
        for (let i = 0; i < pixelCount; i++) {
            const pixel = document.createElement('div');
            
            // Propiedades aleatorias para cada pixel
            const size = this.pixelSize * (Math.floor(Math.random() * 2) + 1);
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = pixelColors[Math.floor(Math.random() * pixelColors.length)];
            const delay = Math.random() * 3;
            const duration = 1 + Math.random() * 2;
            
            // Aplicar estilos
            pixel.className = 'retro-pixel';
            pixel.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                left: ${x}%;
                top: ${y}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: pixel-blink ${duration}s infinite ${delay}s steps(2);
            `;
            
            pixelContainer.appendChild(pixel);
        }
        
        this.container.appendChild(pixelContainer);
        
        // Crear la animación de parpadeo
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pixel-blink {
                0%, 49% { opacity: 0.1; }
                50%, 100% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Añade el efecto de líneas de escaneo tipo CRT
     */
    addScanlines() {
        const scanlines = document.createElement('div');
        scanlines.className = 'retro-scanlines';
        scanlines.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.05) 3px,
                rgba(0, 0, 0, 0.05) 3px
            );
            pointer-events: none;
            z-index: 9999;
            opacity: 0.4;
        `;
        
        document.body.appendChild(scanlines);
    }
    
    /**
     * Configura efectos de interferencia aleatorios
     */
    setupInterferenceEffects() {
        // Efecto de interferencia que ocurre ocasionalmente
        setInterval(() => {
            if (Math.random() > 0.8) { // 20% de probabilidad
                this.createGlitchEffect();
            }
        }, 10000); // Cada 10 segundos
    }
    
    /**
     * Crea un efecto de glitch/interferencia temporal
     */
    createGlitchEffect() {
        const glitch = document.createElement('div');
        glitch.className = 'retro-glitch-effect';
        
        const glitchType = Math.floor(Math.random() * 3); // 3 tipos diferentes
        
        switch(glitchType) {
            case 0: // Desplazamiento horizontal
                glitch.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 9998;
                `;
                
                // Crear 3-5 secciones desplazadas
                const sliceCount = Math.floor(Math.random() * 3) + 3;
                const height = 100 / sliceCount;
                
                for (let i = 0; i < sliceCount; i++) {
                    const slice = document.createElement('div');
                    const offset = Math.floor(Math.random() * 20) - 10; // -10px a 10px
                    
                    slice.style.cssText = `
                        position: absolute;
                        top: ${i * height}%;
                        left: 0;
                        width: 100%;
                        height: ${height}%;
                        transform: translateX(${offset}px);
                        background-color: transparent;
                        overflow: hidden;
                    `;
                    
                    glitch.appendChild(slice);
                }
                break;
                
            case 1: // Flash de color
                const colors = ['rgba(255,0,91,0.1)', 'rgba(0,246,255,0.1)', 'rgba(141,0,196,0.1)'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                glitch.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: ${color};
                    mix-blend-mode: overlay;
                    pointer-events: none;
                    z-index: 9998;
                `;
                break;
                
            case 2: // Líneas de ruido
                glitch.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 1px,
                        rgba(255, 255, 255, 0.2) 1px,
                        rgba(255, 255, 255, 0.2) 2px
                    );
                    pointer-events: none;
                    z-index: 9998;
                    animation: noise-move 0.2s steps(4) infinite;
                `;
                
                const noiseStyle = document.createElement('style');
                noiseStyle.textContent = `
                    @keyframes noise-move {
                        0% { background-position: 0 0; }
                        100% { background-position: 100px 0; }
                    }
                `;
                document.head.appendChild(noiseStyle);
                break;
        }
        
        // Añadir a document
        document.body.appendChild(glitch);
        
        // Eliminar después de un breve tiempo
        setTimeout(() => {
            glitch.remove();
        }, 500);
    }
    
    /**
     * Crea un efecto pixelado dkinámica para transiciones
     * @param {string} type - Tipo de transición ('fade', 'pixelate', 'dissolve')
     * @param {number} duration - Duración en ms
     * @param {Function} callback - Función a llamar al finalizar
     */
    createTransition(type = 'pixelate', duration = 500, callback = null) {
        const transition = document.createElement('div');
        transition.className = 'retro-transition';
        
        switch(type) {
            case 'fade':
                transition.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    opacity: 0;
                    z-index: 10000;
                    transition: opacity ${duration/1000}s ease;
                    pointer-events: none;
                `;
                
                document.body.appendChild(transition);
                
                // Ejecutar la transición
                setTimeout(() => {
                    transition.style.opacity = '1';
                    
                    setTimeout(() => {
                        if (callback) callback();
                        
                        setTimeout(() => {
                            transition.style.opacity = '0';
                            setTimeout(() => transition.remove(), duration);
                        }, 100);
                    }, duration);
                }, 10);
                break;
                
            case 'pixelate':
                transition.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    z-index: 10000;
                    pointer-events: none;
                    display: grid;
                    grid-template-columns: repeat(16, 1fr);
                    grid-template-rows: repeat(12, 1fr);
                    gap: 0;
                `;
                
                // Crear bloques pixelados para la transición
                const colors = ['#1a0b22', '#320f55', '#000000', '#210069'];
                
                for (let i = 0; i < 192; i++) { // 16x12 grid
                    const block = document.createElement('div');
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const delay = Math.random() * 200;
                    
                    block.style.cssText = `
                        background-color: ${color};
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        transition-delay: ${delay}ms;
                    `;
                    
                    transition.appendChild(block);
                }
                
                document.body.appendChild(transition);
                
                // Ejecutar la transición
                const blocks = transition.querySelectorAll('div');
                
                setTimeout(() => {
                    blocks.forEach(block => {
                        block.style.opacity = '1';
                    });
                    
                    setTimeout(() => {
                        if (callback) callback();
                        
                        setTimeout(() => {
                            blocks.forEach(block => {
                                block.style.opacity = '0';
                            });
                            setTimeout(() => transition.remove(), 400);
                        }, 200);
                    }, duration);
                }, 10);
                break;
                
            case 'dissolve':
                // Crear un lienzo para el efecto de disolución
                const canvas = document.createElement('canvas');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    pointer-events: none;
                `;
                
                document.body.appendChild(canvas);
                
                const ctx = canvas.getContext('2d');
                const pixelSize = this.pixelSize * 2;
                const cols = Math.ceil(canvas.width / pixelSize);
                const rows = Math.ceil(canvas.height / pixelSize);
                const total = cols * rows;
                let current = 0;
                
                const pixels = Array.from({ length: total }, (_, i) => ({
                    col: i % cols,
                    row: Math.floor(i / cols),
                    active: false
                })).sort(() => Math.random() - 0.5); // Orden aleatorio
                
                // Función para dibujar un frame
                const drawFrame = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'black';
                    
                    pixels.forEach((pixel, index) => {
                        if (index < current) {
                            ctx.fillRect(
                                pixel.col * pixelSize,
                                pixel.row * pixelSize,
                                pixelSize,
                                pixelSize
                            );
                        }
                    });
                };
                
                // Animar la transición
                const startTime = Date.now();
                const halfDuration = duration / 2;
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    
                    if (elapsed < halfDuration) {
                        // Primera mitad: aparecer
                        current = Math.floor((elapsed / halfDuration) * total);
                        drawFrame();
                        requestAnimationFrame(animate);
                    } else if (elapsed < duration) {
                        // Ejecutar callback a la mitad
                        if (elapsed - halfDuration < 50 && callback) {
                            callback();
                        }
                        
                        // Segunda mitad: desaparecer
                        current = total - Math.floor(((elapsed - halfDuration) / halfDuration) * total);
                        drawFrame();
                        requestAnimationFrame(animate);
                    } else {
                        // Eliminar al finalizar
                        canvas.remove();
                    }
                };
                
                requestAnimationFrame(animate);
                break;
        }
    }
    
    /**
     * Aplica efecto de texto pixelado a un elemento
     * @param {HTMLElement} element - Elemento al que aplicar el efecto
     */
    applyPixelTextEffect(element) {
        if (!element) return;
        
        // Guardar el texto original como dato
        element.dataset.originalText = element.textContent;
        
        // Crear el efecto de revelación de texto
        const animateText = () => {
            const text = element.dataset.originalText;
            let displayText = '';
            let charIndex = 0;
            
            const revealInterval = setInterval(() => {
                if (charIndex < text.length) {
                    displayText += text.charAt(charIndex);
                    element.textContent = displayText;
                    charIndex++;
                } else {
                    clearInterval(revealInterval);
                }
            }, 50); // Velocidad de revelación
        };
        
        // Ejecutar ahora o en un evento
        if (element.offsetParent !== null) { // Es visible
            animateText();
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateText();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        }
    }
    
    /**
     * Crea un "frame" pixelado alrededor de un elemento
     * @param {HTMLElement} element - Elemento al que aplicar el marco
     */
    createPixelFrame(element) {
        if (!element) return;
        
        element.style.position = 'relative';
        
        // Crear el marco
        const frame = document.createElement('div');
        frame.className = 'retro-pixel-frame';
        frame.style.cssText = `
            position: absolute;
            top: -${this.pixelSize}px;
            left: -${this.pixelSize}px;
            right: -${this.pixelSize}px;
            bottom: -${this.pixelSize}px;
            border: ${this.pixelSize}px solid var(--gothic-gold);
            z-index: -1;
            pointer-events: none;
        `;
        
        // Añadir esquinas pixeladas
        const corners = [
            { top: '-8px', left: '-8px' },
            { top: '-8px', right: '-8px' },
            { bottom: '-8px', left: '-8px' },
            { bottom: '-8px', right: '-8px' }
        ];
        
        corners.forEach(position => {
            const corner = document.createElement('div');
            corner.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background-color: var(--cyber-pink);
                ${Object.keys(position)[0]}: ${position[Object.keys(position)[0]]};
                ${Object.keys(position)[1]}: ${position[Object.keys(position)[1]]};
            `;
            
            frame.appendChild(corner);
        });
        
        element.appendChild(frame);
    }
}
