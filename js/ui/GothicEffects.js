/**
 * Clase para gestionar efectos visuales góticos
 */
export class GothicEffects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.effectsEnabled = true;
        this.initialized = false;
        this.initialize();
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Crear elementos decorativos
        this.createGargoyles();
        
        this.initialized = true;
    }
    
    createGargoyles() {
        // Posiciones para las gárgolas
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        positions.forEach(position => {
            const gargoyle = document.createElement('div');
            gargoyle.className = `gargoyle-ornament ${position}`;
            gargoyle.innerHTML = this.getGargoyleSVG();
            
            gargoyle.addEventListener('mouseover', () => {
                gargoyle.classList.add('awakened');
                this.triggerRandomEvent();
            });
            
            gargoyle.addEventListener('mouseout', () => {
                gargoyle.classList.remove('awakened');
            });
            
            this.container.appendChild(gargoyle);
        });
    }
    
    getGargoyleSVG() {
        return `<svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M50,20 Q60,10 70,15 T80,40 Q70,50 50,45 T20,40 Q30,30 50,20 Z" 
                fill="#2d0245" stroke="#bf9b30" stroke-width="1"/>
            <circle cx="40" cy="25" r="3" fill="#8a0303"/>
            <circle cx="60" cy="25" r="3" fill="#8a0303"/>
            <path d="M45,35 Q50,40 55,35" fill="none" stroke="#bf9b30" stroke-width="1"/>
        </svg>`;
    }
    
    triggerRandomEvent() {
        // Provocar efectos aleatorios
        const randomEffect = Math.floor(Math.random() * 5);
        
        switch (randomEffect) {
            case 0:
                this.pulseBackground();
                break;
            case 1:
                this.revealPentagram();
                break;
            case 2:
                this.triggerLightning();
                break;
            case 3:
                this.addBloodSplatter();
                break;
            case 4:
                this.flickerLights();
                break;
        }
    }
    
    pulseBackground() {
        const overlay = document.createElement('div');
        overlay.className = 'pulse-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, transparent 0%, rgba(50, 10, 40, 0.3) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 100;
        `;
        
        document.body.appendChild(overlay);
        
        // Animar
        setTimeout(() => overlay.style.opacity = '1', 10);
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, 800);
    }
    
    revealPentagram() {
        // Verificar si ya existe
        let pentagram = document.querySelector('.cyber-pentagram');
        if (!pentagram) {
            pentagram = document.createElement('div');
            pentagram.className = 'cyber-pentagram';
            pentagram.innerHTML = this.getPentagramSVG();
            document.body.appendChild(pentagram);
        }
        
        // Mostrar y ocultar
        pentagram.classList.add('reveal');
        setTimeout(() => {
            pentagram.classList.remove('reveal');
        }, 4000);
    }
    
    getPentagramSVG() {
        return `<svg width="400" height="400" viewBox="0 0 100 100">
            <path class="pentagram-outline" d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,75 L25,90 L35,60 L10,40 L40,40 Z" 
                fill="none" stroke="#8a0303" stroke-opacity="0.5" stroke-width="0.5"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#8a0303" stroke-opacity="0.3" stroke-width="0.5"/>
            <text x="50" y="53" text-anchor="middle" font-size="5" fill="#8a0303" fill-opacity="0.7">λδφθπ</text>
        </svg>`;
    }
    
    triggerLightning() {
        const lightning = document.createElement('div');
        lightning.className = 'ambient-lightning';
        document.body.appendChild(lightning);
        
        setTimeout(() => {
            lightning.classList.add('flash');
            setTimeout(() => lightning.remove(), 1500);
        }, 100);
    }
    
    addBloodSplatter() {
        const splatter = document.createElement('div');
        splatter.className = 'blood-splatter';
        
        // Posición aleatoria
        splatter.style.left = Math.random() * 80 + 10 + '%';
        splatter.style.top = Math.random() * 80 + 10 + '%';
        splatter.style.opacity = '0';
        splatter.style.transform = 'scale(0.5)';
        
        // Tamaño aleatorio
        const size = Math.random() * 100 + 50;
        splatter.style.width = size + 'px';
        splatter.style.height = size + 'px';
        
        // Añadir SVG
        splatter.innerHTML = this.getBloodSplatterSVG();
        
        document.body.appendChild(splatter);
        
        // Animar entrada
        setTimeout(() => {
            splatter.style.opacity = '0.5';
            splatter.style.transform = 'scale(1)';
            splatter.style.transition = 'opacity 0.5s, transform 0.5s';
            
            // Desvanecer después de unos segundos
            setTimeout(() => {
                splatter.style.opacity = '0';
                setTimeout(() => splatter.remove(), 500);
            }, 3000);
        }, 10);
    }
    
    getBloodSplatterSVG() {
        const randomType = Math.floor(Math.random() * 3) + 1;
        
        return `<svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M50,50 
                ${randomType === 1 ? 'Q70,30 90,50 T50,90 Q30,70 10,50 T50,10 Z' : ''}
                ${randomType === 2 ? 'Q80,40 70,70 T30,80 Q20,50 30,20 T50,10 Z' : ''}
                ${randomType === 3 ? 'Q60,20 90,30 T80,60 Q50,80 20,70 T20,30 Z' : ''}"
                fill="#8a0303" fill-opacity="0.5"/>
        </svg>`;
    }
    
    flickerLights() {
        // Añadir clase para animación
        document.body.classList.add('flickering');
        
        // Quitar después de la animación
        setTimeout(() => {
            document.body.classList.remove('flickering');
        }, 1000);
    }
    
    /**
     * Aplica efecto de texto sangriento
     * @param {string} selector - Selector CSS para elementos
     */
    applyBloodyText(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.classList.add('bloody-text');
            
            // Añadir gotas de sangre
            const dropCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < dropCount; i++) {
                const drop = document.createElement('div');
                drop.className = 'blood-drop';
                
                // Posición aleatoria
                drop.style.left = Math.random() * 80 + 10 + '%';
                drop.style.animationDelay = Math.random() * 2 + 's';
                drop.style.animationDuration = Math.random() * 3 + 2 + 's';
                
                element.appendChild(drop);
            }
        });
    }
    
    /**
     * Aplica distorsión VHS a elementos
     */
    applyVHSDistortion(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.classList.add('vhs-distortion');
            
            // Añadir capas
            const noise = document.createElement('div');
            noise.className = 'vhs-noise';
            
            const scanlines = document.createElement('div');
            scanlines.className = 'vhs-scanlines';
            
            const glitch = document.createElement('div');
            glitch.className = 'vhs-glitch';
            
            element.appendChild(noise);
            element.appendChild(scanlines);
            element.appendChild(glitch);
        });
    }
    
    /**
     * Añade una viñeta oscura pulsante
     */
    addDarkVignette() {
        // Verificar si ya existe
        if (document.querySelector('.dark-vignette')) return;
        
        const vignette = document.createElement('div');
        vignette.className = 'dark-vignette';
        document.body.appendChild(vignette);
        
        // Pulso cada cierto tiempo
        setInterval(() => {
            vignette.classList.add('pulse');
            setTimeout(() => vignette.classList.remove('pulse'), 3000);
        }, 15000);
    }
}