/**
 * Controlador principal del menú de Cybervania
 * Gestiona la navegación entre pantallas y las interacciones del usuario
 */
import { MenuManager } from './MenuManager.js';
import { getAudioManager } from '../audio/AudioManager.js';
import { getLocalization } from '../i18n/Localization.js';

export class MainMenu {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentScreen = null;
        this.menuManager = new MenuManager();
        this.audioManager = getAudioManager();
        this.localization = getLocalization();
        
        // Opciones del juego (default)
        this.gameOptions = {
            musicVolume: 0.7,
            sfxVolume: 0.8,
            difficulty: 'normal',
            language: 'es',
            visualQuality: 'high',
            targetFPS: 60,
            showTutorialTips: true,
            highContrast: false,
            textSize: 'medium'
        };
        
        // Cargar opciones guardadas
        this.loadOptions();
        
        // Inicializar
        this.initialize();
    }
    
    /**
     * Inicializa el menú principal
     */
    initialize() {
        console.log('Inicializando menú principal');
        
        // Crear estructura HTML para las pantallas
        this.createMenuScreens();
        
        // Registrar eventos
        this.registerEvents();
        
        // Mostrar pantalla principal
        this.showScreen('main-menu');
        
        // Reproducir música del menú
        if (this.audioManager.isReady()) {
            setTimeout(() => {
                this.audioManager.playMusic('menu_theme', { loop: true, fadeIn: 2 });
            }, 500);
        }
    }
    
    /**
     * Crea la estructura HTML para las diferentes pantallas
     */
    createMenuScreens() {
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Título del juego
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-container';
        titleContainer.innerHTML = `
            <h1 data-text="CYBERVANIA">CYBERVANIA</h1>
            <h2>${this.localization.get('mainMenu.subtitle')}</h2>
        `;
        this.container.appendChild(titleContainer);
        
        // Contenedor de pantallas
        const screenContainer = document.createElement('div');
        screenContainer.className = 'screen-container';
        this.container.appendChild(screenContainer);
        
        // === MENÚ PRINCIPAL ===
        const mainMenu = document.createElement('div');
        mainMenu.id = 'main-menu';
        mainMenu.className = 'menu-screen';
        mainMenu.innerHTML = `
            <div class="menu-list" style="margin: 2rem 0;">
                <div class="menu-item" data-screen="new-game" style="margin-bottom: 1.5rem;">
                    <div class="menu-icon">▶</div>
                    <div class="menu-text">${this.localization.get('mainMenu.newGame')}</div>
                </div>
                <div class="menu-item" data-screen="load-game" style="margin-bottom: 1.5rem;">
                    <div class="menu-icon">↺</div>
                    <div class="menu-text">${this.localization.get('mainMenu.loadGame')}</div>
                </div>
                <div class="menu-item" data-screen="options" style="margin-bottom: 1.5rem;">
                    <div class="menu-icon">⚙</div>
                    <div class="menu-text">${this.localization.get('mainMenu.options')}</div>
                </div>
                <div class="menu-item" data-screen="credits" style="margin-bottom: 1.5rem;">
                    <div class="menu-icon">✧</div>
                    <div class="menu-text">${this.localization.get('mainMenu.credits')}</div>
                </div>
                <div class="menu-item" id="exit-item">
                    <div class="menu-icon">✕</div>
                    <div class="menu-text">${this.localization.get('mainMenu.exit')}</div>
                </div>
            </div>
        `;
        screenContainer.appendChild(mainMenu);
        
        // === NUEVA PARTIDA ===
        const newGameScreen = document.createElement('div');
        newGameScreen.id = 'new-game';
        newGameScreen.className = 'menu-screen';
        newGameScreen.innerHTML = `
            <h3>${this.localization.get('character.title')}</h3>
            
            <form id="character-form">
                <div class="form-group">
                    <label for="character-name">${this.localization.get('character.name')}</label>
                    <input type="text" id="character-name" required>
                </div>
                
                <div class="form-group">
                    <label>${this.localization.get('character.gender.label')}</label>
                    <div class="gender-options">
                        <div class="gender-option" data-gender="male">
                            <div class="gender-icon">♂</div>
                            <span>${this.localization.get('character.gender.male')}</span>
                        </div>
                        <div class="gender-option" data-gender="female">
                            <div class="gender-icon">♀</div>
                            <span>${this.localization.get('character.gender.female')}</span>
                        </div>
                    </div>
                </div>
                
                <div class="specialization-container">
                    <label>${this.localization.get('character.specialization.title')}</label>
                    <div class="spec-cards">
                        <div class="spec-card red" data-spec="red">
                            <h5>${this.localization.get('character.specialization.offense.name')}</h5>
                            <p>${this.localization.get('character.specialization.offense.description')}</p>
                            <div class="spec-stats">
                                <div class="stat-item">
                                    <span class="stat-name">${this.localization.get('character.stats.attack')}</span>
                                    <span class="stat-value stat-positive">+30%</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-name">${this.localization.get('character.stats.defense')}</span>
                                    <span class="stat-value stat-negative">-10%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="spec-card blue" data-spec="blue">
                            <h5>${this.localization.get('character.specialization.defense.name')}</h5>
                            <p>${this.localization.get('character.specialization.defense.description')}</p>
                            <div class="spec-stats">
                                <div class="stat-item">
                                    <span class="stat-name">${this.localization.get('character.stats.defense')}</span>
                                    <span class="stat-value stat-positive">+30%</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-name">${this.localization.get('character.stats.attack')}</span>
                                    <span class="stat-value stat-negative">-10%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="spec-card purple" data-spec="purple">
                            <h5>${this.localization.get('character.specialization.balanced.name')}</h5>
                            <p>${this.localization.get('character.specialization.balanced.description')}</p>
                            <div class="spec-stats">
                                <div class="stat-item">
                                    <span class="stat-name">${this.localization.get('character.stats.actions')}</span>
                                    <span class="stat-value stat-positive">+1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button type="submit" class="main-button">${this.localization.get('character.create')}</button>
                    <button type="button" class="back-button" data-screen="main-menu">${this.localization.get('character.back')}</button>
                </div>
            </form>
        `;
        screenContainer.appendChild(newGameScreen);
        
        // === CARGAR PARTIDA ===
        const loadGameScreen = document.createElement('div');
        loadGameScreen.id = 'load-game';
        loadGameScreen.className = 'menu-screen';
        loadGameScreen.innerHTML = `
            <h3>${this.localization.get('loadGame.title')}</h3>
            
            <div class="save-slots-container" id="save-slots">
                <!-- Las ranuras de guardado se generan dinámicamente -->
                <div class="save-slot empty">
                    <div class="empty-slot-text">
                        ${this.localization.get('loadGame.empty')}
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="back-button" data-screen="main-menu">${this.localization.get('loadGame.back')}</button>
            </div>
        `;
        screenContainer.appendChild(loadGameScreen);
        
        // === OPCIONES ===
        const optionsScreen = document.createElement('div');
        optionsScreen.id = 'options';
        optionsScreen.className = 'menu-screen';
        optionsScreen.innerHTML = `
            <h3>${this.localization.get('options.title')}</h3>
            
            <div class="options-container">
                <div class="options-section">
                    <h4>${this.localization.get('options.audio.title')}</h4>
                    
                    <div class="option-item">
                        <label for="music-volume">${this.localization.get('options.audio.music')}</label>
                        <input type="range" id="music-volume" min="0" max="100" value="${this.gameOptions.musicVolume * 100}">
                        <div class="option-value" id="music-volume-value">${Math.round(this.gameOptions.musicVolume * 100)}%</div>
                    </div>
                    
                    <div class="option-item">
                        <label for="sfx-volume">${this.localization.get('options.audio.sfx')}</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value="${this.gameOptions.sfxVolume * 100}">
                        <div class="option-value" id="sfx-volume-value">${Math.round(this.gameOptions.sfxVolume * 100)}%</div>
                    </div>
                </div>
                
                <div class="options-section">
                    <h4>${this.localization.get('options.graphics.title')}</h4>
                    
                    <div class="option-item">
                        <label for="visual-quality">${this.localization.get('options.graphics.quality')}</label>
                        <select id="visual-quality">
                            <option value="low" ${this.gameOptions.visualQuality === 'low' ? 'selected' : ''}>${this.localization.get('options.graphics.low')}</option>
                            <option value="medium" ${this.gameOptions.visualQuality === 'medium' ? 'selected' : ''}>${this.localization.get('options.graphics.medium')}</option>
                            <option value="high" ${this.gameOptions.visualQuality === 'high' ? 'selected' : ''}>${this.localization.get('options.graphics.high')}</option>
                        </select>
                    </div>
                </div>
                
                <div class="options-section">
                    <h4>${this.localization.get('options.gameplay.title')}</h4>
                    
                    <div class="option-item">
                        <label for="difficulty">${this.localization.get('options.gameplay.difficulty')}</label>
                        <select id="difficulty">
                            <option value="easy" ${this.gameOptions.difficulty === 'easy' ? 'selected' : ''}>${this.localization.get('options.gameplay.easy')}</option>
                            <option value="normal" ${this.gameOptions.difficulty === 'normal' ? 'selected' : ''}>${this.localization.get('options.gameplay.normal')}</option>
                            <option value="hard" ${this.gameOptions.difficulty === 'hard' ? 'selected' : ''}>${this.localization.get('options.gameplay.hard')}</option>
                        </select>
                    </div>
                </div>
                
                <div class="options-section">
                    <h4>${this.localization.get('options.accessibility.title')}</h4>
                    
                    <div class="option-item">
                        <label for="high-contrast">${this.localization.get('options.accessibility.highContrast')}</label>
                        <label class="toggle-wrapper">
                            <input type="checkbox" id="high-contrast" ${this.gameOptions.highContrast ? 'checked' : ''}>
                            <span class="toggle-display"></span>
                        </label>
                    </div>
                </div>
                
                <div class="options-section">
                    <h4>${this.localization.get('options.language')}</h4>
                    
                    <div class="option-item">
                        <label for="language">Idioma / Language</label>
                        <select id="language">
                            <option value="es" ${this.gameOptions.language === 'es' ? 'selected' : ''}>Español</option>
                            <option value="en" ${this.gameOptions.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <div class="buttons-row">
                    <button id="save-options" class="main-button">${this.localization.get('options.save')}</button>
                    <button id="reset-options">${this.localization.get('options.reset')}</button>
                </div>
                <button class="back-button" data-screen="main-menu">${this.localization.get('options.back')}</button>
            </div>
        `;
        screenContainer.appendChild(optionsScreen);
        
        // === CRÉDITOS ===
        const creditsScreen = document.createElement('div');
        creditsScreen.id = 'credits';
        creditsScreen.className = 'menu-screen';
        
        // Contenido dinámico para los créditos
        creditsScreen.innerHTML = `
            <h3>${this.localization.get('credits.title')}</h3>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h4 style="color: var(--gothic-gold); margin: 20px 0 10px;">CYBERVANIA</h4>
                <p style="color: var(--gothic-bone);">Versión Alpha 0.1</p>
            </div>
            
            <div style="margin: 20px 0; border-top: 1px solid var(--gothic-blood); padding-top: 20px;">
                <h4 style="color: var(--gothic-gold); margin-bottom: 10px;">${this.localization.get('credits.development')}</h4>
                <p>Guillermo</p>
            </div>
            
            <div style="margin: 20px 0; border-top: 1px solid var(--gothic-blood); padding-top: 20px;">
                <h4 style="color: var(--gothic-gold); margin-bottom: 10px;">${this.localization.get('credits.art')}</h4>
                <p>Pixel Artists</p>
            </div>
            
            <div style="margin: 20px 0; border-top: 1px solid var(--gothic-blood); padding-top: 20px;">
                <h4 style="color: var(--gothic-gold); margin-bottom: 10px;">${this.localization.get('credits.music')}</h4>
                <p>Retro Composers</p>
            </div>
            
            <div class="action-buttons">
                <button class="back-button" data-screen="main-menu">${this.localization.get('credits.back')}</button>
            </div>
        `;
        screenContainer.appendChild(creditsScreen);
    }
    
    /**
     * Registra eventos de interacción
     */
    registerEvents() {
        // Elementos del menú principal
        document.querySelectorAll('.menu-item[data-screen]').forEach(item => {
            item.addEventListener('click', (e) => {
                const targetScreen = e.currentTarget.getAttribute('data-screen');
                this.audioManager.playSound('menu_select');
                this.showScreen(targetScreen);
            });
            
            // Efecto hover
            item.addEventListener('mouseenter', () => {
                this.audioManager.playSound('menu_hover');
            });
        });
        
        // Botones de regreso
        document.querySelectorAll('.back-button[data-screen]').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetScreen = e.currentTarget.getAttribute('data-screen');
                this.audioManager.playSound('menu_back');
                this.showScreen(targetScreen);
            });
        });
        
        // Opciones de género
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.gender-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.audioManager.playSound('menu_select');
            });
        });
        
        // Tarjetas de especialización
        document.querySelectorAll('.spec-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.spec-card').forEach(c => {
                    c.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.audioManager.playSound('menu_select');
            });
        });
        
        // Formulario de creación de personaje
        const characterForm = document.getElementById('character-form');
        characterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener datos del personaje
            const name = document.getElementById('character-name')?.value || 'Hacker';
            
            // Validar nombre
            if (name.trim() === '') {
                this.showNotification(this.localization.get('character.nameRequired'));
                return;
            }
            
            // Obtener género seleccionado
            let gender = 'other';
            document.querySelectorAll('.gender-option.selected').forEach(option => {
                gender = option.getAttribute('data-gender') || gender;
            });
            
            // Obtener especialización seleccionada
            let specialization = 'red'; // Por defecto
            document.querySelectorAll('.spec-card.selected').forEach(card => {
                specialization = card.getAttribute('data-spec') || specialization;
            });
            
            // Crear objeto de personaje
            const character = {
                name,
                gender,
                specialization,
                health: 100,
                maxHealth: 100,
                credits: 500,
                level: 1,
                exp: 0,
                created: new Date().toISOString()
            };
            
            // Guardar en localStorage
            this.saveCharacter(character);
            
            // Iniciar juego
            this.startGame(character);
        });
        
        // Opciones de audio
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        const musicValue = document.getElementById('music-volume-value');
        const sfxValue = document.getElementById('sfx-volume-value');
        
        if (musicSlider && musicValue) {
            musicSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                this.gameOptions.musicVolume = volume;
                this.audioManager.setMusicVolume(volume);
                musicValue.textContent = `${e.target.value}%`;
            });
        }
        
        if (sfxSlider && sfxValue) {
            sfxSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                this.gameOptions.sfxVolume = volume;
                this.audioManager.setSFXVolume(volume);
                sfxValue.textContent = `${e.target.value}%`;
                
                // Reproducir sonido para que el usuario pueda ajustar en tiempo real
                if (parseInt(e.target.value) % 10 === 0) {
                    this.audioManager.playSound('menu_hover');
                }
            });
        }
        
        // Calidad visual
        const qualitySelect = document.getElementById('visual-quality');
        if (qualitySelect) {
            qualitySelect.addEventListener('change', (e) => {
                this.gameOptions.visualQuality = e.target.value;
                
                // Aplicar cambios
                if (window.cybervaniaSettings) {
                    window.cybervaniaSettings.applySettings({
                        visualQuality: e.target.value
                    });
                }
            });
        }
        
        // Dificultad
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.gameOptions.difficulty = e.target.value;
            });
        }
        
        // Alto contraste
        const contrastToggle = document.getElementById('high-contrast');
        if (contrastToggle) {
            contrastToggle.addEventListener('change', (e) => {
                this.gameOptions.highContrast = e.target.checked;
                
                // Aplicar cambios
                if (window.cybervaniaSettings) {
                    window.cybervaniaSettings.applySettings({
                        highContrast: e.target.checked
                    });
                }
            });
        }
        
        // Idioma
        const languageSelect = document.getElementById('language');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.gameOptions.language = e.target.value;
                
                // Aplicar cambios
                if (window.cybervaniaSettings) {
                    window.cybervaniaSettings.applySettings({
                        language: e.target.value
                    });
                    
                    // Reconstruir UI con nuevo idioma
                    this.createMenuScreens();
                    this.registerEvents();
                }
            });
        }
        
        // Guardar opciones
        const saveOptionsBtn = document.getElementById('save-options');
        if (saveOptionsBtn) {
            saveOptionsBtn.addEventListener('click', () => {
                this.saveOptions();
                this.showNotification('Configuración guardada');
                this.audioManager.playSound('menu_select');
            });
        }
        
        // Restablecer opciones
        const resetOptionsBtn = document.getElementById('reset-options');
        if (resetOptionsBtn) {
            resetOptionsBtn.addEventListener('click', () => {
                this.resetOptions();
                this.audioManager.playSound('menu_back');
            });
        }
        
        // Salir
        const exitItem = document.getElementById('exit-item');
        if (exitItem) {
            exitItem.addEventListener('click', () => {
                this.showExitConfirmation();
            });
        }
    }
    
    /**
     * Muestra una determinada pantalla
     */
    showScreen(screenId) {
        this.currentScreen = screenId;
        
        // Eventos especiales según la pantalla
        if (screenId === 'load-game') {
            setTimeout(() => this.onEnterLoadScreen(), 800); // Retraso para esperar la transición
        }
        
        // Usar el gestor de menú para la transición
        this.menuManager.showScreen(screenId);
    }
    
    /**
     * Guarda las opciones del juego en localStorage
     */
    saveOptions() {
        try {
            localStorage.setItem('cybervania_options', JSON.stringify(this.gameOptions));
        } catch (e) {
            console.error('Error guardando opciones:', e);
        }
    }
    
    /**
     * Carga las opciones guardadas
     */
    loadOptions() {
        try {
            const savedOptions = localStorage.getItem('cybervania_options');
            if (savedOptions) {
                const options = JSON.parse(savedOptions);
                this.gameOptions = { ...this.gameOptions, ...options };
            }
        } catch (e) {
            console.error('Error cargando opciones:', e);
        }
    }
    
    /**
     * Restablece las opciones a valores predeterminados
     */
    resetOptions() {
        // Valores por defecto
        this.gameOptions = {
            musicVolume: 0.7,
            sfxVolume: 0.8,
            difficulty: 'normal',
            language: 'es',
            visualQuality: 'high',
            targetFPS: 60,
            showTutorialTips: true,
            highContrast: false,
            textSize: 'medium'
        };
        
        // Actualizar UI
        if (document.getElementById('music-volume')) {
            document.getElementById('music-volume').value = this.gameOptions.musicVolume * 100;
            document.getElementById('music-volume-value').textContent = `${Math.round(this.gameOptions.musicVolume * 100)}%`;
        }
        
        if (document.getElementById('sfx-volume')) {
            document.getElementById('sfx-volume').value = this.gameOptions.sfxVolume * 100;
            document.getElementById('sfx-volume-value').textContent = `${Math.round(this.gameOptions.sfxVolume * 100)}%`;
        }
        
        if (document.getElementById('difficulty')) {
            document.getElementById('difficulty').value = this.gameOptions.difficulty;
        }
        
        if (document.getElementById('visual-quality')) {
            document.getElementById('visual-quality').value = this.gameOptions.visualQuality;
        }
        
        if (document.getElementById('high-contrast')) {
            document.getElementById('high-contrast').checked = this.gameOptions.highContrast;
        }
        
        if (document.getElementById('language')) {
            document.getElementById('language').value = this.gameOptions.language;
        }
        
        // Aplicar cambios
        if (window.cybervaniaSettings) {
            window.cybervaniaSettings.applySettings(this.gameOptions);
        }
        
        // Guardar
        this.saveOptions();
        
        // Notificar
        this.showNotification('Configuración restablecida');
    }
    
    /**
     * Guarda un personaje
     */
    saveCharacter(character) {
        try {
            // Guardar el personaje actual
            localStorage.setItem('current_player', JSON.stringify(character));
            
            // También guardar en ranura
            const saveSlots = JSON.parse(localStorage.getItem('save_slots') || '[]');
            saveSlots.push(character);
            localStorage.setItem('save_slots', JSON.stringify(saveSlots));
            
            console.log('Personaje guardado:', character);
            
        } catch (e) {
            console.error('Error al guardar personaje:', e);
        }
    }
    
    /**
     * Inicia el juego con el personaje creado
     */
    startGame(character) {
        // Transición de salida
        document.body.style.transition = 'opacity 1s ease-out';
        document.body.style.opacity = '0';
        
        // Redirigir a la página del juego
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1000);
    }
    
    /**
     * Muestra una notificación
     */
    showNotification(message, duration = 3000) {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
    
    /**
     * Muestra confirmación de salida
     */
    showExitConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background-color: var(--menu-bg);
            border: var(--pixel-size) solid var(--gothic-blood);
            padding: 2rem;
            text-align: center;
            max-width: 80%;
            width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;
        
        dialog.innerHTML = `
            <p style="margin-bottom: 1.5rem;">${this.localization.get('messages.confirmExit')}</p>
            <div style="display: flex; justify-content: space-around;">
                <button id="exit-yes" style="min-width: 100px;">${this.localization.get('messages.yes')}</button>
                <button id="exit-no" style="min-width: 100px;">${this.localization.get('messages.no')}</button>
            </div>
        `;
        
        confirmation.appendChild(dialog);
        document.body.appendChild(confirmation);
        
        document.getElementById('exit-yes').addEventListener('click', () => {
            // En navegador no podemos realmente "salir", solo volvemos a la página anterior
            window.history.back();
        });
        
        document.getElementById('exit-no').addEventListener('click', () => {
            confirmation.remove();
        });
    }
    
    /**
     * Carga y muestra las partidas guardadas
     */
    loadSaveSlots() {
        const slotsContainer = document.getElementById('save-slots');
        if (!slotsContainer) return;
        
        // Limpiar el contenedor
        slotsContainer.innerHTML = '';
        
        try {
            // Obtener las partidas guardadas
            const saveSlots = JSON.parse(localStorage.getItem('save_slots') || '[]');
            
            if (saveSlots.length === 0) {
                // Si no hay partidas, mostrar slot vacío
                slotsContainer.innerHTML = `
                    <div class="save-slot empty">
                        <div class="empty-slot-text">
                            ${this.localization.get('loadGame.noSaves')}
                        </div>
                    </div>
                `;
                return;
            }
            
            // Mostrar cada partida guardada
            saveSlots.forEach((save, index) => {
                const saveDate = new Date(save.created);
                const formattedDate = `${saveDate.toLocaleDateString()} ${saveDate.toLocaleTimeString()}`;
                
                const slotElement = document.createElement('div');
                slotElement.className = 'save-slot';
                slotElement.setAttribute('data-slot', index);
                
                // Determinar clase de insignia según la especialización
                const badgeClass = save.specialization || 'red';
                
                // Generar HTML para el slot
                slotElement.innerHTML = `
                    <div class="slot-header">
                        <h4>${save.name}</h4>
                        <span class="slot-date">${formattedDate}</span>
                    </div>
                    <div class="slot-details">
                        <span class="spec-badge ${badgeClass}">
                            ${this.getSpecializationName(save.specialization)}
                        </span>
                        <span class="level-info">
                            ${this.localization.get('loadGame.level')} ${save.level || 1}
                        </span>
                    </div>
                `;
                
                // Botones de acción
                const actions = document.createElement('div');
                actions.className = 'slot-actions';
                actions.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                `;
                
                // Botón de cargar partida
                const loadButton = document.createElement('button');
                loadButton.textContent = this.localization.get('loadGame.load');
                loadButton.className = 'main-button';
                loadButton.style.cssText = 'font-size: 0.75rem; padding: 0.5rem 0.75rem;';
                loadButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadGame(save);
                });
                
                // Botón de borrar partida
                const deleteButton = document.createElement('button');
                deleteButton.textContent = this.localization.get('loadGame.delete');
                deleteButton.className = 'back-button';
                deleteButton.style.cssText = 'font-size: 0.75rem; padding: 0.5rem 0.75rem;';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.confirmDeleteSave(index);
                });
                
                actions.appendChild(loadButton);
                actions.appendChild(deleteButton);
                slotElement.appendChild(actions);
                
                // Agregar al contenedor
                slotsContainer.appendChild(slotElement);
                
                // Clic en el slot para cargar la partida
                slotElement.addEventListener('click', () => {
                    this.loadGame(save);
                });
            });
            
        } catch (e) {
            console.error('Error cargando partidas guardadas:', e);
            slotsContainer.innerHTML = `
                <div class="save-slot empty">
                    <div class="empty-slot-text">
                        Error: ${e.message}
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Obtiene el nombre legible de una especialización
     */
    getSpecializationName(specialization) {
        switch (specialization) {
            case 'red':
                return this.localization.get('character.specialization.offense.name');
            case 'blue':
                return this.localization.get('character.specialization.defense.name');
            case 'purple':
                return this.localization.get('character.specialization.balanced.name');
            default:
                return 'Desconocido';
        }
    }
    
    /**
     * Muestra confirmación para borrar una partida
     */
    confirmDeleteSave(index) {
        // Crear diálogo de confirmación flotante
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(10, 2, 5, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background-color: var(--menu-bg);
            border: var(--pixel-size) solid var(--gothic-blood);
            padding: 2rem;
            text-align: center;
            max-width: 90%;
            width: 400px;
        `;
        
        dialog.innerHTML = `
            <p style="margin-bottom: 1.5rem;">${this.localization.get('loadGame.confirmDelete')}</p>
            <div style="display: flex; justify-content: space-around;">
                <button id="delete-yes" style="min-width: 100px;">${this.localization.get('loadGame.yes')}</button>
                <button id="delete-no" style="min-width: 100px;">${this.localization.get('loadGame.no')}</button>
            </div>
        `;
        
        confirmation.appendChild(dialog);
        document.body.appendChild(confirmation);
        
        // Efecto de aparición
        dialog.style.transform = 'scale(0.9)';
        dialog.style.opacity = '0';
        dialog.style.transition = 'transform 0.3s, opacity 0.3s';
        
        setTimeout(() => {
            dialog.style.transform = 'scale(1)';
            dialog.style.opacity = '1';
        }, 50);
        
        // Manejar eventos de botones
        document.getElementById('delete-yes').addEventListener('click', () => {
            this.deleteSave(index);
            confirmation.style.opacity = '0';
            setTimeout(() => confirmation.remove(), 300);
        });
        
        document.getElementById('delete-no').addEventListener('click', () => {
            confirmation.style.opacity = '0';
            setTimeout(() => confirmation.remove(), 300);
        });
    }
    
    /**
     * Elimina una partida guardada
     */
    deleteSave(index) {
        try {
            // Obtener las partidas
            const saveSlots = JSON.parse(localStorage.getItem('save_slots') || '[]');
            
            // Eliminar la partida indicada
            if (index >= 0 && index < saveSlots.length) {
                saveSlots.splice(index, 1);
                localStorage.setItem('save_slots', JSON.stringify(saveSlots));
            }
            
            // Refrescar la lista
            this.loadSaveSlots();
            
            // Mostrar notificación
            this.showNotification(this.localization.get('loadGame.deleteSuccess', 'Partida eliminada'));
            this.audioManager.playSound('menu_select');
            
        } catch (e) {
            console.error('Error eliminando partida:', e);
            this.showNotification(`Error: ${e.message}`);
        }
    }
    
    /**
     * Carga una partida guardada
     */
    loadGame(saveData) {
        try {
            // Guardar como personaje actual
            localStorage.setItem('current_player', JSON.stringify(saveData));
            
            // Mostrar una transición estilo gótico antes de cargar el juego
            this.showGothicTransition();
            
            // Iniciar juego con la partida cargada
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1500);
            
        } catch (e) {
            console.error('Error cargando partida:', e);
            this.showNotification(`Error: ${e.message}`);
        }
    }
    
    /**
     * Muestra una transición estilo gótico
     */
    showGothicTransition() {
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            z-index: 10000;
            opacity: 0;
            transition: opacity 1s;
        `;
        
        // Añadir imágenes de sangre goteando
        for (let i = 0; i < 10; i++) {
            const blood = document.createElement('div');
            blood.style.cssText = `
                position: absolute;
                top: -100px;
                left: ${Math.random() * 100}%;
                width: ${5 + Math.random() * 15}px;
                height: ${100 + Math.random() * 200}px;
                background-color: #570707;
                box-shadow: 0 0 15px #800e0e;
                animation: blood-fall ${2 + Math.random() * 3}s ease-in;
                animation-fill-mode: forwards;
                border-radius: 0 0 4px 4px;
                opacity: 0;
            `;
            
            transition.appendChild(blood);
        }
        
        // Añadir estilo de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blood-fall {
                0% {
                    transform: translateY(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(${window.innerHeight + 200}px);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(transition);
        
        // Iniciar la animación de transparencia a negro
        setTimeout(() => {
            transition.style.opacity = '1';
            
            // Activar las animaciones de sangre con retraso aleatorio
            const bloodElements = transition.querySelectorAll('div');
            bloodElements.forEach((blood, index) => {
                setTimeout(() => {
                    blood.style.opacity = '1';
                }, index * 100);
            });
        }, 50);
    }
    
    /**
     * Función llamada cuando se muestra la pantalla de carga de partidas
     */
    onEnterLoadScreen() {
        // Cargar las partidas guardadas
        this.loadSaveSlots();
        
        // Efecto especial al entrar en esta pantalla
        if (window.cybervaniaSettings) {
            window.cybervaniaSettings.gothicEffects.triggerLightning();
        }
    }
    
    /**
     * Efectos visuales aleatorios para el menú principal
     */
    triggerRandomMenuEffect() {
        if (!window.cybervaniaSettings) return;
        
        const effects = [
            // Efectos góticos
            () => window.cybervaniaSettings.gothicEffects.addBloodSplatter(),
            () => window.cybervaniaSettings.gothicEffects.triggerLightning(),
            () => window.cybervaniaSettings.gothicEffects.flickerLights(),
            
            // Efectos retro/pixelados
            () => window.cybervaniaSettings.retroEffects.createGlitchEffect(),
            
            // Efecto de transición sin cambiar pantalla
            () => {
                const screens = ['main-menu', 'options', 'credits', 'new-game', 'load-game'];
                const currentIndex = screens.indexOf(this.currentScreen);
                if (currentIndex >= 0) {
                    window.cybervaniaSettings.retroEffects.createTransition('pixelate', 200);
                }
            }
        ];
        
        // Seleccionar un efecto aleatorio y ejecutarlo
        const randomIndex = Math.floor(Math.random() * effects.length);
        effects[randomIndex]();
    }
}
