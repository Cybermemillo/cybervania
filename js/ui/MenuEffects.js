/**
 * Efectos decorativos para los menús de Cybervania
 * Proporciona una capa adicional de estilo gótico cyberpunk
 */
export class MenuEffects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.effectsIntensity = 0.8; // 0-1 para controlar la intensidad
        this.targetFPS = 60;
        
        this.initialize();
    }
    
    /**
     * Inicializa los efectos básicos
     */
    initialize() {
        // Crea partículas de niebla digital
        this.createDigitalMist();
        
        // Añadir efectos de resplandor a elementos
        this.addGlowEffects();
    }
    
    /**
     * Crea un efecto de niebla digital en el fondo
     */
    createDigitalMist() {
        // Verificar si ya existe y removerlo
        const existingMist = document.querySelector('.digital-mist');
        if (existingMist) existingMist.remove();
        
        // Crear el contenedor de la niebla
        const mistContainer = document.createElement('div');
        mistContainer.className = 'digital-mist';
        mistContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
            opacity: ${this.effectsIntensity * 0.6};
        `;
        
        // Número de partículas basado en la intensidad
        const particleCount = Math.floor(30 * this.effectsIntensity);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Propiedades aleatorias
            const size = 2 + Math.random() * 3;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 10 + Math.random() * 20;
            
            // Colores temáticos
            const colors = [
                'rgba(255, 0, 92, 0.3)',  // Rosa
                'rgba(0, 246, 255, 0.3)', // Cian
                'rgba(128, 14, 14, 0.2)', // Rojo
                'rgba(45, 2, 69, 0.3)',   // Púrpura
                'rgba(200, 170, 110, 0.2)' // Dorado
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Aplicar estilos
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                left: ${x}%;
                top: ${y}%;
                border-radius: 50%;
                filter: blur(${size/2}px);
                animation: float-particle ${duration}s infinite ease-in-out ${delay}s;
            `;
            
            mistContainer.appendChild(particle);
        }
        
        // Añadir al contenedor principal
        this.container.appendChild(mistContainer);
        
        // Añadir animación
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            @keyframes float-particle {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                25% {
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-30px) translateX(20px);
                    opacity: 0.3;
                }
                75% {
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    /**
     * Añade efectos de resplandor a elementos del menú
     */
    addGlowEffects() {
        // Seleccionar elementos para aplicar resplandor
        const elements = document.querySelectorAll('.menu-screen h3, .menu-item:hover, button:hover');
        
        elements.forEach(el => {
            // Si ya tiene resplandor, no añadir otro
            if (el.classList.contains('with-glow')) return;
            
            el.classList.add('with-glow');
            
            // Color de resplandor según el tipo de elemento
            let glowColor = 'rgba(255, 0, 92, 0.7)';
            if (el.tagName === 'H3') {
                glowColor = 'rgba(200, 170, 110, 0.7)';
            }
            
            // Añadir resplandor suave
            el.style.textShadow = `0 0 8px ${glowColor}`;
            el.style.position = 'relative';
            
            // Añadir capa de resplandor suave
            const glow = document.createElement('div');
            glow.className = 'element-glow';
            glow.style.cssText = `
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border-radius: inherit;
                background: radial-gradient(
                    ellipse at center,
                    ${glowColor} 0%,
                    rgba(0, 0, 0, 0) 70%
                );
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                z-index: -1;
            `;
            
            // Solo mostrar el resplandor en hover
            el.addEventListener('mouseenter', () => {
                glow.style.opacity = '0.7';
            });
            
            el.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
            
            el.appendChild(glow);
        });
    }
    
    /**
     * Crea una decoración de borde gótico
     */
    createGothicBorderDecoration(targetEl) {
        // Verificar que el elemento existe
        if (!targetEl) return;
        
        const border = document.createElement('div');
        border.className = 'gothic-decoration-border';
        border.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <!-- Esquinas góticas -->
                <path d="M0,0 L20,0 L20,5 L5,5 L5,20 L0,20 Z" fill="#800e0e"/>
                <path d="M80,0 L100,0 L100,20 L95,20 L95,5 L80,5 Z" fill="#800e0e"/>
                <path d="M0,80 L0,100 L20,100 L20,95 L5,95 L5,80 Z" fill="#800e0e"/>
                <path d="M95,80 L95,95 L80,95 L80,100 L100,100 L100,80 Z" fill="#800e0e"/>
                
                <!-- Detalles góticos -->
                <path d="M40,0 L60,0 L55,5 L45,5 Z" fill="#800e0e"/>
                <path d="M0,40 L0,60 L5,55 L5,45 Z" fill="#800e0e"/>
                <path d="M95,45 L95,55 L100,60 L100,40 Z" fill="#800e0e"/>
                <path d="M45,95 L55,95 L60,100 L40,100 Z" fill="#800e0e"/>
            </svg>
        `;
        
        // Ajustar posicionamiento del borde
        border.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            pointer-events: none;
            z-index: 0;
            opacity: 0.8;
        `;
        
        // Añadir el borde y asegurarse que el elemento tiene position
        const position = window.getComputedStyle(targetEl).position;
        if (position === 'static') {
            targetEl.style.position = 'relative';
        }
        
        targetEl.appendChild(border);
    }
    
    /**
     * Simula una interferencia en la señal para efectos especiales
     */
    simulateSignalInterference(duration = 1000) {
        // Crear una capa de interferencia
        const interference = document.createElement('div');
        interference.className = 'signal-interference';
        interference.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent,
                rgba(200, 170, 110, 0.1),
                transparent,
                rgba(255, 0, 92, 0.1),
                transparent
            );
            pointer-events: none;
            z-index: 9999;
            animation: interference-scan 0.5s linear infinite;
        `;
        
        // Añadir más capas de interferencia
        const noise = document.createElement('div');
        noise.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../assets/images/effects/noise.png');
            background-size: cover;
            opacity: 0.07;
            mix-blend-mode: overlay;
        `;
        
        interference.appendChild(noise);
        document.body.appendChild(interference);
        
        // Añadir animación
        if (!document.querySelector('#interference-style')) {
            const style = document.createElement('style');
            style.id = 'interference-style';
            style.textContent = `
                @keyframes interference-scan {
                    0% { background-position: 0 -100vh; }
                    100% { background-position: 0 100vh; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Eliminar después de la duración
        setTimeout(() => {
            interference.style.opacity = '0';
            interference.style.transition = 'opacity 0.3s';
            setTimeout(() => interference.remove(), 300);
        }, duration);
    }
    
    /**
     * Actualiza la intensidad de los efectos
     */
    updateEffectsIntensity(intensity) {
        this.effectsIntensity = Math.max(0, Math.min(1, intensity));
        
        // Actualizar niebla digital
        const mist = document.querySelector('.digital-mist');
        if (mist) {
            mist.style.opacity = this.effectsIntensity * 0.6;
        }
        
        // Recrear niebla si es necesario
        if (intensity > 0.2) {
            this.createDigitalMist();
        } else if (mist) {
            mist.remove();
        }
    }
    
    /**
     * Actualiza los efectos de niebla según calidad visual
     */
    updateMistEffects(quality = 'high') {
        switch(quality) {
            case 'low':
                this.updateEffectsIntensity(0.3);
                break;
            case 'medium':
                this.updateEffectsIntensity(0.6);
                break;
            case 'high':
                this.updateEffectsIntensity(1.0);
                break;
        }
    }
    
    /**
     * Establece el FPS objetivo para animaciones
     */
    setTargetFPS(fps) {
        this.targetFPS = fps;
        document.body.style.setProperty('--animation-speed', `${60/fps}`);
    }
    
    /**
     * Activa/desactiva el modo alto contraste
     */
    toggleHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    /**
     * Crea un componente de respaldo para gráficos que no se puedan cargar
     */
    createFallbackGraphic(type, parentElement) {
        const fallback = document.createElement('div');
        fallback.className = 'fallback-graphic';
        
        switch(type) {
            case 'border':
                fallback.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border: 4px solid #800e0e;
                    box-shadow: inset 0 0 20px rgba(128, 14, 14, 0.5);
                    pointer-events: none;
                `;
                break;
                
            case 'icon':
                fallback.style.cssText = `
                    width: 32px;
                    height: 32px;
                    background-color: #800e0e;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d8c8b8;
                    font-size: 18px;
                    font-weight: bold;
                `;
                fallback.textContent = '?';
                break;
        }
        
        if (parentElement) {
            parentElement.appendChild(fallback);
        }
        
        return fallback;
    }
}
