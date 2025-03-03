/**
 * Clase para gestionar efectos visuales del menú principal
 */
export class MenuEffects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.effectsEnabled = true;
        
        // Inicializar propiedades
        this.qualityLevel = 'high'; // low, medium, high
        this.particleCount = 15;
        this.mistElements = [];
        
        // Aplicar efectos iniciales
        this.initEffects();
    }
    
    initEffects() {
        // Iniciar con efecto de inicio si es compatible con el navegador
        if (window.CSS && CSS.supports('animation-name', 'fadeIn')) {
            this.applyStartupEffect();
        }
    }
    
    /**
     * Aplica efecto de inicio al cargar el menú
     */
    applyStartupEffect() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'transition-glitch';
        this.container.appendChild(glitchOverlay);
        
        // Activar transición
        setTimeout(() => {
            this.container.classList.add('transition-active');
            
            // Limpiar después de la animación
            setTimeout(() => {
                this.container.classList.remove('transition-active');
                glitchOverlay.remove();
            }, 800);
        }, 100);
    }
    
    /**
     * Crea/actualiza elementos de niebla según calidad visual
     */
    updateMistEffects(quality = 'high') {
        // Limpiar niebla existente
        const mistLayer = this.container.querySelector('.mist-layer');
        if (!mistLayer) return;
        
        mistLayer.innerHTML = '';
        
        // Ajustar cantidad y calidad según nivel
        let count, opacity, size;
        
        switch (quality) {
            case 'low':
                count = 3;
                opacity = 0.1;
                size = 200;
                break;
                
            case 'medium':
                count = 7;
                opacity = 0.2;
                size = 250;
                break;
                
            case 'high':
            default:
                count = 12;
                opacity = 0.3;
                size = 300;
                break;
        }
        
        // Crear nuevos elementos de niebla
        for (let i = 0; i < count; i++) {
            const mistElement = document.createElement('div');
            mistElement.className = 'mist-element';
            mistElement.style.opacity = (Math.random() * opacity + 0.05).toString();
            mistElement.style.left = (Math.random() * 100) + '%';
            mistElement.style.top = (Math.random() * 100) + '%';
            mistElement.style.width = size + 'px';
            mistElement.style.height = size + 'px';
            mistElement.style.animationDuration = (Math.random() * 15 + 15) + 's';
            mistElement.style.animationDelay = (Math.random() * 5) + 's';
            mistLayer.appendChild(mistElement);
            this.mistElements.push(mistElement);
        }
        
        // Guardar nivel actual
        this.qualityLevel = quality;
    }
    
    /**
     * Actualiza la intensidad de los efectos visuales
     */
    updateEffectsIntensity(intensity) {
        document.documentElement.style.setProperty('--effect-intensity', intensity);
    }
    
    /**
     * Aplica modo de alto contraste para accesibilidad
     */
    toggleHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    /**
     * Aplica efecto de interferencia de señal a los elementos
     */
    simulateSignalInterference(duration = 500) {
        const title = this.container.querySelector('.title-container');
        if (!title) return;
        
        // Añadir clase para efecto
        title.classList.add('signal-interference');
        
        // Aplicar distorsión a textos
        const texts = title.querySelectorAll('h1, h2');
        texts.forEach(text => {
            const originalText = text.textContent;
            const glitchTextArr = originalText.split('');
            
            // Animar distorsión
            const glitchInterval = setInterval(() => {
                // Reemplazar algunos caracteres aleatoriamente
                const randomIndex = Math.floor(Math.random() * glitchTextArr.length);
                const randomChar = this.getRandomGlitchChar();
                
                glitchTextArr[randomIndex] = Math.random() > 0.5 ? randomChar : originalText[randomIndex];
                text.textContent = glitchTextArr.join('');
            }, 50);
            
            // Restaurar texto original después del efecto
            setTimeout(() => {
                clearInterval(glitchInterval);
                text.textContent = originalText;
                title.classList.remove('signal-interference');
            }, duration);
        });
    }
    
    /**
     * Devuelve un carácter aleatorio para efectos glitch
     */
    getRandomGlitchChar() {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\¿¡§±æøðłßØμΣΔφΘλΠ©®';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    /**
     * Activa un relámpago ambiental aleatorio
     */
    triggerLightning() {
        const lightningDiv = document.createElement('div');
        lightningDiv.className = 'ambient-lightning';
        document.body.appendChild(lightningDiv);
        
        setTimeout(() => {
            lightningDiv.classList.add('flash');
            
            // Eliminar después de la animación
            setTimeout(() => {
                lightningDiv.remove();
            }, 1500);
        }, 100);
    }
    
    /**
     * Activa la viñeta oscura pulsante
     */
    pulseVignette() {
        const vignette = document.querySelector('.dark-vignette');
        if (vignette) {
            vignette.classList.add('pulse');
            setTimeout(() => {
                vignette.classList.remove('pulse');
            }, 3000);
        }
    }
    
    /**
     * Establece el FPS objetivo para el menú
     */
    setTargetFPS(fps) {
        // En una implementación real, ajustaríamos los timers y animaciones
        // Para este ejemplo, solo imprimimos el valor
        console.log(`FPS objetivo establecido a: ${fps}`);
        
        // Si es un valor bajo, podemos deshabilitar algunas animaciones
        if (fps <= 30) {
            document.body.classList.add('low-performance');
            this.updateEffectsIntensity(0.5); // Reducir intensidad
        } else {
            document.body.classList.remove('low-performance');
            this.updateEffectsIntensity(1.0); // Restaurar intensidad
        }
    }
}
