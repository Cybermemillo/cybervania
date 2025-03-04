/**
 * Gestor de menús con tema gótico para Cybervania
 */
export class MenuManager {
    constructor() {
        // Referencias a los elementos principales
        this.menuContainer = document.getElementById('menu-container');
        this.activeScreen = null;
        
        // Sonidos específicos góticos
        this.sounds = {
            hover: 'menu_hover_gothic',
            select: 'bone_crack',
            back: 'ghostly_whisper'
        };
        
        // Inicializar los efectos góticos para menús
        this.applyGothicStyles();
    }
    
    /**
     * Aplica estilos góticos adicionales a los elementos del menú
     */
    applyGothicStyles() {
        // Añadir decoraciones góticas a los títulos
        document.querySelectorAll('.menu-screen h3').forEach(title => {
            // Agregar elementos decorativos a los lados del título
            const leftDecoration = document.createElement('span');
            leftDecoration.className = 'gothic-decoration left';
            leftDecoration.innerHTML = '† ';
            
            const rightDecoration = document.createElement('span');
            rightDecoration.className = 'gothic-decoration right';
            rightDecoration.innerHTML = ' †';
            
            // Insertar antes y después del contenido
            title.innerHTML = leftDecoration.outerHTML + title.innerHTML + rightDecoration.outerHTML;
        });
        
        // Estilizar las tarjetas de especialización
        document.querySelectorAll('.spec-card').forEach(card => {
            // Agregar un fondo sangriento a las tarjetas
            card.style.backgroundImage = "url('../assets/images/decorations/blood_parchment.png')";
            card.style.backgroundSize = 'cover';
            
            // También como fallback si la imagen no carga
            card.style.background = `
                linear-gradient(to bottom, 
                    rgba(26, 5, 5, 0.8) 0%,
                    rgba(50, 10, 10, 0.6) 100%
                )
            `;
        });
        
        // Añadir efectos a los botones
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseover', this.createBloodRipple.bind(this));
        });
    }
    
    /**
     * Crea un efecto de ondulación sangriento en hover
     */
    createBloodRipple(event) {
        const target = event.currentTarget;
        const ripple = document.createElement('span');
        
        ripple.className = 'blood-ripple';
        
        // Posicionar el ripple donde está el cursor
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background-color: rgba(128, 14, 14, 0.7);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: blood-ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Establecer overflow hidden si no lo tiene
        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }
        target.style.overflow = 'hidden';
        
        // Agregar y luego remover el ripple
        target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Añadir estilos de animación si no existen
        if (!document.querySelector('#blood-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'blood-ripple-style';
            style.textContent = `
                @keyframes blood-ripple {
                    to {
                        transform: translate(-50%, -50%) scale(15);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Muestra una pantalla específica con una transición gótica
     */
    showScreen(screenId, transition = 'fade') {
        // Ocultar pantalla actual si existe
        if (this.activeScreen) {
            this.transitionOut(this.activeScreen, () => {
                this.activeScreen.style.display = 'none';
                this.activeScreen.classList.remove('active');
                
                // Mostrar nueva pantalla
                const newScreen = document.getElementById(screenId);
                if (newScreen) {
                    this.transitionIn(newScreen);
                    this.activeScreen = newScreen;
                }
            });
        } else {
            // No hay pantalla activa, mostrar la nueva directamente
            const newScreen = document.getElementById(screenId);
            if (newScreen) {
                this.transitionIn(newScreen);
                this.activeScreen = newScreen;
            }
        }
    }
    
    /**
     * Transición gótica de entrada para una pantalla
     */
    transitionIn(screen) {
        // Hacer visible pero con opacity 0
        screen.style.display = 'block';
        screen.style.opacity = '0';
        
        // Efecto de sangre cayendo por la pantalla
        const blood = document.createElement('div');
        blood.className = 'blood-curtain';
        blood.style.cssText = `
            position: fixed;
            top: -100%;
            left: 0;
            width: 100%;
            height: 200%;
            background: linear-gradient(to bottom, 
                rgba(128, 14, 14, 0.8) 0%,
                rgba(87, 7, 7, 0.6) 50%,
                rgba(26, 5, 5, 0.1) 100%
            );
            z-index: 1000;
            animation: blood-fall 1s forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(blood);
        
        // Añadir keyframe para la animación si no existe
        if (!document.querySelector('#blood-fall-style')) {
            const style = document.createElement('style');
            style.id = 'blood-fall-style';
            style.textContent = `
                @keyframes blood-fall {
                    0% { top: -100%; }
                    100% { top: 0; }
                }
                @keyframes blood-fade {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Después de la caída de sangre, mostrar la pantalla
        setTimeout(() => {
            screen.style.opacity = '1';
            screen.classList.add('active');
            
            // Y hacer desaparecer la sangre
            blood.style.animation = 'blood-fade 0.5s forwards';
            
            setTimeout(() => {
                blood.remove();
            }, 500);
        }, 800);
    }
    
    /**
     * Transición gótica de salida para una pantalla
     */
    transitionOut(screen, callback) {
        // Desvanecimiento con ondas de niebla fantasmal
        const mist = document.createElement('div');
        mist.className = 'ghost-mist';
        mist.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                ellipse at center,
                rgba(29, 13, 26, 0) 0%,
                rgba(29, 13, 26, 0.8) 100%
            );
            z-index: 999;
            opacity: 0;
            animation: mist-appear 0.5s forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(mist);
        
        // Añadir keyframe para la animación si no existe
        if (!document.querySelector('#ghost-mist-style')) {
            const style = document.createElement('style');
            style.id = 'ghost-mist-style';
            style.textContent = `
                @keyframes mist-appear {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes mist-disappear {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Desvanecer la pantalla actual
        screen.style.opacity = '0';
        screen.style.transform = 'translateY(10px)';
        screen.style.transition = 'opacity 0.5s, transform 0.5s';
        
        // Ejecutar callback después de la animación
        setTimeout(() => {
            if (callback) callback();
            
            // Desvanecer la niebla
            mist.style.animation = 'mist-disappear 0.5s forwards';
            
            // Limpiar
            setTimeout(() => {
                mist.remove();
            }, 500);
        }, 500);
    }
    
    /**
     * Agrega sombras animadas a los elementos
     */
    addAnimatedShadows(selector = '.menu-screen h3, .menu-item, button') {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // Añadir div para sombra animada
            const shadow = document.createElement('div');
            shadow.className = 'gothic-shadow';
            
            shadow.style.cssText = `
                position: absolute;
                top: 5px;
                left: 5px;
                width: 100%;
                height: 100%;
                background-color: rgba(10, 2, 5, 0.6);
                z-index: -1;
                border-radius: inherit;
                filter: blur(3px);
                animation: shadow-pulse 2s infinite alternate;
                pointer-events: none;
            `;
            
            // Solo si el elemento no tiene position
            const position = window.getComputedStyle(element).position;
            if (position === 'static') {
                element.style.position = 'relative';
            }
            
            element.appendChild(shadow);
        });
        
        // Añadir animación si no existe
        if (!document.querySelector('#shadow-animation')) {
            const style = document.createElement('style');
            style.id = 'shadow-animation';
            style.textContent = `
                @keyframes shadow-pulse {
                    0% {
                        transform: translate(3px, 3px);
                        opacity: 0.6;
                    }
                    100% {
                        transform: translate(5px, 5px);
                        opacity: 0.8;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Agrega un contador de vida para los menús del juego
     */
    addLifeCounter(maxLives = 3) {
        const counter = document.createElement('div');
        counter.className = 'life-counter';
        counter.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 8px;
            z-index: 1000;
        `;
        
        // Crea los corazones
        for (let i = 0; i < maxLives; i++) {
            const heart = document.createElement('div');
            heart.className = 'life-heart';
            heart.style.cssText = `
                width: 24px;
                height: 24px;
                background-image: url('../assets/images/ui/heart.png');
                background-size: contain;
                background-repeat: no-repeat;
                filter: drop-shadow(0 0 2px var(--gothic-blood));
            `;
            
            // Si no hay imágenes, crear un corazón con CSS
            heart.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    fill="#800e0e" />
                </svg>
            `;
            
            counter.appendChild(heart);
        }
        
        document.body.appendChild(counter);
        
        // Devuelve el contador para manipularlo después
        return counter;
    }
    
    /**
     * Crear un menú con apariencia de pergamino
     */
    createParchmentMenu(title, content, options = {}) {
        const parchment = document.createElement('div');
        parchment.className = 'parchment-menu';
        parchment.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${options.width || '600px'};
            max-width: 90%;
            background-color: #d8c8b8;
            border: 4px solid #7c4a1e;
            padding: 30px;
            color: #3b240b;
            font-family: serif;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
            z-index: 1000;
            background-image: url('../assets/images/textures/parchment.jpg');
            background-size: cover;
        `;
        
        // Estilo para dar apariencia quemada a los bordes
        parchment.innerHTML = `
            <div style="position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px;
                        border: 12px solid transparent; 
                        border-image: url('../assets/images/textures/burned_edge.png') 12 round;
                        pointer-events: none;"></div>
            <h3 style="font-size: 28px; text-align: center; margin-bottom: 20px;
                      color: #3b240b; font-family: 'Cinzel', serif;">${title}</h3>
            <div class="parchment-content" style="font-size: 18px; line-height: 1.6;">
                ${content}
            </div>
            <div class="parchment-buttons" style="text-align: center; margin-top: 30px;"></div>
        `;
        
        // Añadir botones
        const buttonContainer = parchment.querySelector('.parchment-buttons');
        
        if (options.buttons) {
            options.buttons.forEach(btnOpt => {
                const btn = document.createElement('button');
                btn.innerText = btnOpt.text;
                btn.style.cssText = `
                    background-color: #7c4a1e;
                    color: #d8c8b8;
                    border: none;
                    padding: 8px 20px;
                    margin: 0 10px;
                    font-family: 'Cinzel', serif;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                `;
                
                btn.addEventListener('mouseenter', () => {
                    btn.style.backgroundColor = '#a5642a';
                    btn.style.boxShadow = '0 0 10px rgba(165, 100, 42, 0.5)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.backgroundColor = '#7c4a1e';
                    btn.style.boxShadow = 'none';
                });
                
                if (btnOpt.onClick) {
                    btn.addEventListener('click', () => btnOpt.onClick(parchment));
                }
                
                buttonContainer.appendChild(btn);
            });
        }
        
        // Añadir al DOM y devolver la referencia
        document.body.appendChild(parchment);
        return parchment;
    }
    
    /**
     * Reproduce un sonido de menú si está disponible
     */
    playMenuSound(type = 'hover') {
        if (window.audioManager && this.sounds[type]) {
            window.audioManager.playSound(this.sounds[type]);
        }
    }
}
