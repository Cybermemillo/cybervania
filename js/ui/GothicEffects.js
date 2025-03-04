/**
 * Efectos visuales góticos para el menú de Cybervania
 * Implementa efectos visuales inspirados en la estética gótica de Castlevania
 */
export class GothicEffects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initialized = false;
        
        this.initialize();
        
        // Se eliminó la llamada a addGothicDetailOverlay()
    }
    
    /**
     * Inicializa los efectos góticos
     */
    initialize() {
        if (this.initialized) return;
        
        // Registro de eventos para efectos interactivos
        this.setupEvents();
        
        this.initialized = true;
    }
    
    /**
     * Configura eventos para efectos interactivos
     */
    setupEvents() {
        // Agregar efectos de hover para títulos
        document.querySelectorAll('h1, h2, h3, h4, h5').forEach(element => {
            element.addEventListener('mouseenter', () => this.pulseElement(element));
        });
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
            <circle cx="40" cy="25" r="3" fill="#430e0e"/>
            <circle cx="60" cy="25" r="3" fill="#430e0e"/>
            <path d="M45,35 Q50,40 55,35" fill="none" stroke="#bf9b30" stroke-width="1"/>
        </svg>`;
    }
    
    triggerRandomEvent() {
        // Provocar efectos aleatorios
        const randomEffect = Math.floor(Math.random() * 3);
        
        switch (randomEffect) {
            case 0:
                this.pulseBackground();
                break;
            case 1:
                this.revealPentagram();
                break;
            case 2:
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
                fill="none" stroke="#430e0e" stroke-opacity="0.5" stroke-width="0.5"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#430e0e" stroke-opacity="0.3" stroke-width="0.5"/>
            <text x="50" y="53" text-anchor="middle" font-size="5" fill="#430e0e" fill-opacity="0.7">λδφθπ</text>
        </svg>`;
    }
    
    flickerLights() {
        // Añadir clase para animación
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
    
    /**
     * Añade esquinas con sangre en las cuatro esquinas de la pantalla
     */
    addBloodCorners() {
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        corners.forEach(position => {
            const bloodCorner = document.createElement('div');
            bloodCorner.className = `blood-corner ${position}`;
            
            // Configuramos el CSS directamente
            bloodCorner.style.cssText = `
                position: fixed;
                width: 150px;
                height: 150px;
                background-image: url('../assets/images/effects/blood_corner.png');
                background-size: contain;
                background-repeat: no-repeat;
                pointer-events: none;
                z-index: 5;
                opacity: 0.7;
            `;
            
            // Ajustar posición según esquina
            switch (position) {
                case 'top-left':
                    bloodCorner.style.top = '0';
                    bloodCorner.style.left = '0';
                    break;
                case 'top-right':
                    bloodCorner.style.top = '0';
                    bloodCorner.style.right = '0';
                    bloodCorner.style.transform = 'scaleX(-1)';
                    break;
                case 'bottom-left':
                    bloodCorner.style.bottom = '0';
                    bloodCorner.style.left = '0';
                    bloodCorner.style.transform = 'scaleY(-1)';
                    break;
                case 'bottom-right':
                    bloodCorner.style.bottom = '0';
                    bloodCorner.style.right = '0';
                    bloodCorner.style.transform = 'scale(-1)';
                    break;
            }
            
            // Si no hay imagen, crear un efecto SVG similar
            if (position === 'top-left') {
                bloodCorner.innerHTML = `
                    <svg width="150" height="150" viewBox="0 0 100 100">
                        <path d="M0,0 Q30,5 50,15 T80,40 Q70,50 50,45 T20,40 Q10,30 0,0 Z" 
                            fill="#570707" fill-opacity="0.7"/>
                        <path d="M0,0 Q10,30 30,20 T40,30 Q35,45 20,25 T0,30 L0,0 Z" 
                            fill="#800e0e" fill-opacity="0.8"/>
                    </svg>
                `;
            }
            
            document.body.appendChild(bloodCorner);
        });
    }
    
    /**
     * Crea efecto de velas/antorchas en los lados
     */
    createCandlesEffect() {
        const candlePositions = [
            { left: '10%', top: '30%' },
            { left: '90%', top: '30%' },
            { left: '5%', top: '60%' },
            { left: '95%', top: '60%' }
        ];
        
        candlePositions.forEach(pos => {
            const candle = document.createElement('div');
            candle.className = 'gothic-candle';
            candle.style.cssText = `
                position: fixed;
                width: 16px;
                height: 32px;
                left: ${pos.left};
                top: ${pos.top};
                z-index: 4;
                pointer-events: none;
            `;
            
            // Añadir base de la vela
            const candleBase = document.createElement('div');
            candleBase.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 16px;
                height: 16px;
                background-color: #5d1c00;
            `;
            
            // Añadir llama
            const flame = document.createElement('div');
            flame.style.cssText = `
                position: absolute;
                bottom: 14px;
                left: 4px;
                width: 8px;
                height: 16px;
                background: linear-gradient(to top, #ff6600, #ffcc00);
                border-radius: 8px 8px 0 0;
                animation: flame-flicker 1s infinite alternate ease-in-out;
            `;
            
            // Añadir brillo
            const glow = document.createElement('div');
            glow.style.cssText = `
                position: absolute;
                left: -32px;
                top: -32px;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: radial-gradient(circle, 
                    rgba(255, 204, 0, 0.3) 0%, 
                    rgba(255, 102, 0, 0.1) 40%, 
                    rgba(0, 0, 0, 0) 70%
                );
                animation: glow-pulse 2s infinite alternate;
            `;
            
            candle.appendChild(candleBase);
            candle.appendChild(flame);
            candle.appendChild(glow);
            
            document.body.appendChild(candle);
        });
        
        // Añadir estilos para animaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flame-flicker {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1, 1.2); }
            }
            
            @keyframes glow-pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Configura el efecto de sangre goteando desde la parte superior
     */
    setupBloodDripping() {
        // Crear 5-8 gotas de sangre aleatorias
        const dropCount = 5 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < dropCount; i++) {
            // Posicionar aleatoriamente en la parte superior
            const xPos = Math.random() * 100; // posición horizontal aleatoria
            
            this.createBloodDrop(xPos);
        }
    }
    
    /**
     * Crea una gota de sangre en la posición indicada
     */
    createBloodDrop(xPos) {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';
        
        // Características aleatorias para la gota
        const width = 4 + Math.floor(Math.random() * 4); // 4-8px
        const delay = Math.random() * 10; // 0-10s de retraso
        const duration = 6 + Math.random() * 10; // 6-16s para caer
        
        drop.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${xPos}%;
            width: ${width}px;
            height: 20px;
            background-color: #800e0e;
            border-radius: 0 0 50% 50%;
            opacity: 0.7;
            z-index: 3;
            animation: blood-dripping ${duration}s infinite ${delay}s linear;
        `;
        
        document.body.appendChild(drop);
    }
}