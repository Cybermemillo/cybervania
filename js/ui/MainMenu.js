import { Player } from '../entities/Player.js';
import { getLocalization } from '../i18n/Localization.js';
import { MenuEffects } from './MenuEffects.js';

export class MainMenu {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.audioManager = null; // Placeholder para sistema de audio
        this.currentScreen = 'main';
        this.theme = Player.getMainMenuTheme();
        this.saveSlots = Player.getSaveSlotInfo();
        this.selectedSpecialization = 'neutral';
        this.playerNameInput = '';
        
        // Referencias a elementos DOM
        this.elements = {};
        
        // Inicializar sistema de localización
        this.localization = getLocalization();
        
        // Inicializar efectos visuales
        this.menuEffects = new MenuEffects(containerId);
        
        // Inicializar opciones con valores por defecto
        this.gameOptions = {
            musicVolume: 0.7,
            sfxVolume: 0.8,
            fullscreen: false,
            difficulty: 'normal',
            language: 'es',
            visualQuality: 'high',
            targetFPS: 60,
            highContrast: false,
            screenShake: true
        };
        
        // Cargar opciones guardadas si existen
        this.loadSavedOptions();
        
        // Inicializar sistemas
        this.initAudioManager();
        
        // Inicializar menú
        this.initialize();
        
        // Registrar listener para cambios de idioma
        document.addEventListener('languageChanged', () => this.updateAllTexts());
    }
    
    initAudioManager() {
        // Crear un gestor de audio simple
        this.audioManager = {
            context: null,
            musicGainNode: null,
            sfxGainNode: null,
            currentMusic: null,
            musicElements: {},
            sfxElements: {},
            
            // Inicializar el contexto de audio
            init: () => {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        this.audioManager.context = new AudioContext();
                        
                        // Crear nodos de ganancia para música y efectos
                        this.audioManager.musicGainNode = this.audioManager.context.createGain();
                        this.audioManager.musicGainNode.connect(this.audioManager.context.destination);
                        
                        this.audioManager.sfxGainNode = this.audioManager.context.createGain();
                        this.audioManager.sfxGainNode.connect(this.audioManager.context.destination);
                        
                        // Aplicar volúmenes
                        this.audioManager.setMusicVolume(this.gameOptions.musicVolume);
                        this.audioManager.setSFXVolume(this.gameOptions.sfxVolume);
                        
                        console.log('Sistema de audio inicializado correctamente');
                        return true;
                    }
                } catch (e) {
                    console.error('Error al inicializar audio:', e);
                }
                return false;
            },
            
            // Cargar una pista de música
            loadMusic: (id, url) => {
                const audio = new Audio(url);
                audio.loop = true;
                
                this.audioManager.musicElements[id] = {
                    audio: audio,
                    source: null
                };
                
                console.log(`Música cargada: ${id}`);
            },
            
            // Reproducir música
            playMusic: (id) => {
                // Si ya hay música, detenerla
                if (this.audioManager.currentMusic) {
                    this.audioManager.stopMusic();
                }
                
                if (!this.audioManager.context || !this.audioManager.musicElements[id]) {
                    console.warn(`No se puede reproducir la música: ${id}`);
                    return;
                }
                
                const musicData = this.audioManager.musicElements[id];
                
                try {
                    // Crear fuente desde el elemento de audio
                    musicData.source = this.audioManager.context.createMediaElementSource(musicData.audio);
                    musicData.source.connect(this.audioManager.musicGainNode);
                    
                    // Reproducir
                    musicData.audio.play();
                    this.audioManager.currentMusic = id;
                    
                    console.log(`Reproduciendo música: ${id}`);
                } catch (e) {
                    console.error('Error al reproducir música:', e);
                }
            },
            
            // Detener música
            stopMusic: () => {
                if (this.audioManager.currentMusic) {
                    const musicData = this.audioManager.musicElements[this.audioManager.currentMusic];
                    if (musicData && musicData.audio) {
                        musicData.audio.pause();
                        musicData.audio.currentTime = 0;
                    }
                    this.audioManager.currentMusic = null;
                }
            },
            
            // Cargar efecto de sonido
            loadSFX: (id, url) => {
                const audio = new Audio(url);
                audio.preload = 'auto';
                
                this.audioManager.sfxElements[id] = {
                    audio: audio
                };
            },
            
            // Reproducir efecto de sonido
            playSFX: (id) => {
                if (!this.audioManager.context || !this.audioManager.sfxElements[id]) {
                    console.warn(`No se puede reproducir el efecto: ${id}`);
                    return;
                }
                
                const sfx = this.audioManager.sfxElements[id];
                
                // Clonar el audio para permitir reproducciones solapadas
                const audioClone = sfx.audio.cloneNode();
                
                try {
                    const source = this.audioManager.context.createMediaElementSource(audioClone);
                    source.connect(this.audioManager.sfxGainNode);
                    
                    audioClone.play();
                    
                    // Limpiar después de reproducirse
                    audioClone.onended = () => {
                        audioClone.onended = null;
                    };
                } catch (e) {
                    console.error('Error al reproducir efecto:', e);
                }
            },
            
            // Establecer volumen de música
            setMusicVolume: (volume) => {
                if (this.audioManager.musicGainNode) {
                    this.audioManager.musicGainNode.gain.value = volume;
                }
            },
            
            // Establecer volumen de efectos
            setSFXVolume: (volume) => {
                if (this.audioManager.sfxGainNode) {
                    this.audioManager.sfxGainNode.gain.value = volume;
                }
            }
        };
        
        // Inicializar el sistema de audio
        if (this.audioManager.init()) {
            // Cargar sonidos del menú
            this.audioManager.loadSFX('hover', 'assets/audio/sfx/menu_hover.mp3');
            this.audioManager.loadSFX('select', 'assets/audio/sfx/menu_select.mp3');
            this.audioManager.loadSFX('back', 'assets/audio/sfx/menu_back.mp3');
            
            // Cargar música de fondo - Actualizada ruta correcta
            this.audioManager.loadMusic('menu', 'assets/audio/sfx/main-theme.mp3');
        }
    }
    
    loadSavedOptions() {
        // Intenta cargar opciones desde localStorage
        const savedOptions = localStorage.getItem('cybervania_options');
        if (savedOptions) {
            try {
                const options = JSON.parse(savedOptions);
                // Fusionar con las opciones actuales (en caso de que haya opciones nuevas)
                this.gameOptions = { ...this.gameOptions, ...options };
                console.log('Opciones cargadas correctamente');
                
                // Aplicar opciones inmediatamente
                this.applyCurrentOptions();
            } catch (e) {
                console.error('Error al cargar opciones guardadas:', e);
            }
        }
    }
    
    saveOptions() {
        // Guarda opciones en localStorage
        localStorage.setItem('cybervania_options', JSON.stringify(this.gameOptions));
        console.log('Opciones guardadas correctamente');
        
        // Aplicar opciones inmediatamente
        this.applyCurrentOptions();
    }
    
    applyCurrentOptions() {
        // Aplicar volúmenes si el audio está inicializado
        if (this.audioManager && this.audioManager.context) {
            this.audioManager.setMusicVolume(this.gameOptions.musicVolume);
            this.audioManager.setSFXVolume(this.gameOptions.sfxVolume);
        }
        
        // Aplicar pantalla completa
        this.toggleFullscreen(this.gameOptions.fullscreen);
        
        // Aplicar idioma
        this.applyLanguage(this.gameOptions.language);
        
        // Aplicar calidad visual
        this.applyVisualQuality(this.gameOptions.visualQuality);
        
        // Aplicar modo de alto contraste
        this.applyHighContrast(this.gameOptions.highContrast);
    }
    
    initialize() {
        // Crear estructura del menú
        this.createMenuStructure();
        
        // Aplicar tema visual
        this.applyTheme();
        
        // Mostrar pantalla inicial
        this.showScreen('main');
        
        // Iniciar animación de fondo
        this.startBackgroundEffects();
        
        // Reproducir música de fondo
        this.playBackgroundMusic();
    }
    
    createMenuStructure() {
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Crear capas de fondo
        this.elements.backgroundLayer = document.createElement('div');
        this.elements.backgroundLayer.className = 'menu-background';
        this.container.appendChild(this.elements.backgroundLayer);
        
        // Capa de niebla
        this.elements.mistLayer = document.createElement('div');
        this.elements.mistLayer.className = 'mist-layer';
        this.container.appendChild(this.elements.mistLayer);
        
        // Contenedor de título
        this.elements.titleContainer = document.createElement('div');
        this.elements.titleContainer.className = 'title-container';
        
        const title = document.createElement('h1');
        title.textContent = this.theme.title;
        
        const subtitle = document.createElement('h2');
        subtitle.textContent = this.theme.subtitle;
        
        this.elements.titleContainer.appendChild(title);
        this.elements.titleContainer.appendChild(subtitle);
        this.container.appendChild(this.elements.titleContainer);
        
        // Contenedor para todas las pantallas del menú - Ajustar posición
        this.elements.screenContainer = document.createElement('div');
        this.elements.screenContainer.className = 'screen-container';
        this.container.appendChild(this.elements.screenContainer);
        
        // Posicionar el título más arriba para dejar más espacio al menú
        this.elements.titleContainer.style.top = '5%'; // Cambiado desde 10%
        
        // Crear cada pantalla
        this.createMainScreen();
        this.createNewGameScreen();
        this.createLoadGameScreen();
        this.createOptionsScreen();
    }
    
    createMainScreen() {
        const mainScreen = document.createElement('div');
        mainScreen.className = 'menu-screen';
        mainScreen.id = 'main-screen';
        
        const menuList = document.createElement('ul');
        menuList.className = 'menu-list';
        
        // Crear elementos del menú principal
        this.theme.menuItems.forEach(item => {
            const menuItem = document.createElement('li');
            menuItem.className = 'menu-item';
            menuItem.dataset.action = item.id;
            
            const icon = document.createElement('span');
            icon.className = 'menu-icon ' + item.icon;
            
            const text = document.createElement('span');
            text.className = 'menu-text';
            text.textContent = item.text;
            
            menuItem.appendChild(icon);
            menuItem.appendChild(text);
            
            // Añadir evento de clic
            menuItem.addEventListener('click', () => this.handleMenuAction(item.id));
            
            // Añadir eventos para efectos de hover
            menuItem.addEventListener('mouseenter', () => this.playHoverSound());
            
            menuList.appendChild(menuItem);
        });
        
        mainScreen.appendChild(menuList);
        this.elements.screenContainer.appendChild(mainScreen);
        this.elements.mainScreen = mainScreen;
    }
    
    createNewGameScreen() {
        const newGameScreen = document.createElement('div');
        newGameScreen.className = 'menu-screen';
        newGameScreen.id = 'new-game-screen';
        
        // Título de la pantalla
        const screenTitle = document.createElement('h3');
        screenTitle.textContent = 'Nueva Partida';
        newGameScreen.appendChild(screenTitle);
        
        // Campo para nombre del jugador
        const nameField = document.createElement('div');
        nameField.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Nombre de Hacker:';
        nameLabel.htmlFor = 'player-name';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'player-name';
        nameInput.placeholder = 'Ingresa tu nombre...';
        nameInput.maxLength = 15;
        nameInput.addEventListener('input', (e) => {
            this.playerNameInput = e.target.value;
            this.updateCharacterPreview();
        });
        
        nameField.appendChild(nameLabel);
        nameField.appendChild(nameInput);
        newGameScreen.appendChild(nameField);
        
        // Selección de sexo (nuevo)
        const genderField = document.createElement('div');
        genderField.className = 'form-group gender-selection';
        
        const genderLabel = document.createElement('label');
        genderLabel.textContent = 'Selecciona tu identidad:';
        genderField.appendChild(genderLabel);
        
        const genderOptions = document.createElement('div');
        genderOptions.className = 'gender-options';
        
        // Opción Masculino
        const maleOption = document.createElement('div');
        maleOption.className = 'gender-option';
        maleOption.dataset.gender = 'male';
        
        const maleIcon = document.createElement('div');
        maleIcon.className = 'gender-icon male';
        maleIcon.innerHTML = `<svg viewBox="0 0 24 24" width="40" height="40">
            <circle cx="12" cy="8" r="5" fill="none" stroke="#1fa7ff" stroke-width="1.5"/>
            <path d="M12,13 L12,21 M8,17 L16,17" stroke="#1fa7ff" stroke-width="1.5"/>
            <path d="M17,3 L17,7 M15,5 L19,5" stroke="#1fa7ff" stroke-width="1.5"/>
        </svg>`;
        
        const maleLabel = document.createElement('span');
        maleLabel.textContent = 'Hombre';
        
        maleOption.appendChild(maleIcon);
        maleOption.appendChild(maleLabel);
        
        // Opción Femenino
        const femaleOption = document.createElement('div');
        femaleOption.className = 'gender-option';
        femaleOption.dataset.gender = 'female';
        
        const femaleIcon = document.createElement('div');
        femaleIcon.className = 'gender-icon female';
        femaleIcon.innerHTML = `<svg viewBox="0 0 24 24" width="40" height="40">
            <circle cx="12" cy="8" r="5" fill="none" stroke="#ff3a4a" stroke-width="1.5"/>
            <path d="M12,13 L12,21" stroke="#ff3a4a" stroke-width="1.5"/>
            <path d="M8,17 L16,17" stroke="#ff3a4a" stroke-width="1.5"/>
            <circle cx="12" cy="21" r="2" fill="none" stroke="#ff3a4a" stroke-width="1.5"/>
        </svg>`;
        
        const femaleLabel = document.createElement('span');
        femaleLabel.textContent = 'Mujer';
        
        femaleOption.appendChild(femaleIcon);
        femaleOption.appendChild(femaleLabel);
        
        genderOptions.appendChild(maleOption);
        genderOptions.appendChild(femaleOption);
        genderField.appendChild(genderOptions);
        
        // Evento de selección de género
        genderOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.gender-option');
            if (option) {
                document.querySelectorAll('.gender-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                this.selectedGender = option.dataset.gender;
                this.updateCharacterPreview();
                this.playSelectSound();
            }
        });
        
        newGameScreen.appendChild(genderField);
        
        // Selección de especialización mejorada
        const specContainer = document.createElement('div');
        specContainer.className = 'specialization-container';
        
        const specTitle = document.createElement('h4');
        specTitle.textContent = 'Especialización';
        specContainer.appendChild(specTitle);
        
        // Tarjetas de especialización mejoradas
        const specCards = document.createElement('div');
        specCards.className = 'spec-cards';
        
        const specializations = [
            { 
                id: 'blue', 
                name: 'Blue Team', 
                desc: 'Especializado en defensa y seguridad. Mayor resistencia y supervivencia.',
                stats: {
                    health: '+15%',
                    defense: '+20%',
                    attack: '-5%',
                    actionPoints: '3'
                },
                lore: 'Los Blue Team son expertos en protección y resistencia. Especializados en defender sistemas contra ataques externos y mantener las defensas en pie cuando todo lo demás falla.'
            },
            { 
                id: 'red', 
                name: 'Red Team', 
                desc: 'Especializado en ataque y penetración. Daño superior a costa de defensa.',
                stats: {
                    health: '-5%',
                    defense: '-10%',
                    attack: '+25%',
                    actionPoints: '3'
                },
                lore: 'Los Red Team son maestros del asalto digital. Rompen defensas e inutilizan sistemas con precisión quirúrgica, sacrificando su propia seguridad por potencia ofensiva.'
            },
            { 
                id: 'purple', 
                name: 'Purple Team', 
                desc: 'Equilibrio entre ataque y defensa. Adaptabilidad y versatilidad táctica.',
                stats: {
                    health: '+5%',
                    defense: '+5%',
                    attack: '+5%',
                    actionPoints: '4'
                },
                lore: 'Los Purple Team combinan lo mejor de ambos mundos. Son adaptables, versátiles y cuentan con un punto de acción extra que les permite desplegar estrategias más complejas.'
            }
        ];
        
        specializations.forEach(spec => {
            const card = document.createElement('div');
            card.className = `spec-card ${spec.id}`;
            card.dataset.spec = spec.id;
            
            const cardTitle = document.createElement('h5');
            cardTitle.textContent = spec.name;
            
            const cardDesc = document.createElement('p');
            cardDesc.textContent = spec.desc;
            
            // Añadir estadísticas visuales
            const cardStats = document.createElement('div');
            cardStats.className = 'spec-stats';
            
            for (const [key, value] of Object.entries(spec.stats)) {
                const statItem = document.createElement('div');
                statItem.className = 'stat-item';
                
                const statName = document.createElement('span');
                statName.className = 'stat-name';
                statName.textContent = this.formatStatName(key);
                
                const statValue = document.createElement('span');
                statValue.className = 'stat-value';
                
                // Colorear valores según sean positivos o negativos
                if (value.startsWith('+')) {
                    statValue.classList.add('stat-positive');
                } else if (value.startsWith('-')) {
                    statValue.classList.add('stat-negative');
                }
                
                statValue.textContent = value;
                
                statItem.appendChild(statName);
                statItem.appendChild(statValue);
                cardStats.appendChild(statItem);
            }
            
            card.appendChild(cardTitle);
            card.appendChild(cardDesc);
            card.appendChild(cardStats);
            
            // Tooltip con información adicional
            const tooltipIcon = document.createElement('div');
            tooltipIcon.className = 'tooltip-icon';
            tooltipIcon.textContent = '?';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'spec-tooltip';
            tooltip.textContent = spec.lore;
            
            tooltipIcon.appendChild(tooltip);
            card.appendChild(tooltipIcon);
            
            card.addEventListener('click', () => {
                // Eliminar selección anterior
                document.querySelectorAll('.spec-card').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Seleccionar nueva
                card.classList.add('selected');
                this.selectedSpecialization = spec.id;
                this.updateCharacterPreview();
                this.playSelectSound();
            });
            
            specCards.appendChild(card);
        });
        
        specContainer.appendChild(specCards);
        newGameScreen.appendChild(specContainer);
        
        // Vista previa del personaje (nuevo)
        const previewContainer = document.createElement('div');
        previewContainer.className = 'character-preview-container';
        
        const previewTitle = document.createElement('h4');
        previewTitle.textContent = 'Vista previa';
        previewContainer.appendChild(previewTitle);
        
        const previewContent = document.createElement('div');
        previewContent.className = 'character-preview';
        previewContent.innerHTML = '<div class="character-avatar"><div class="silhouette"></div></div>';
        
        const previewDetails = document.createElement('div');
        previewDetails.className = 'character-details';
        previewDetails.innerHTML = `
            <p class="preview-name">---</p>
            <p class="preview-class">Selecciona una especialización</p>
            <p class="preview-description">La vista previa de tu personaje aparecerá aquí.</p>
        `;
        
        previewContent.appendChild(previewDetails);
        previewContainer.appendChild(previewContent);
        
        newGameScreen.appendChild(previewContainer);
        
        // Sección de motivación o trasfondo (opcional)
        const backstoryField = document.createElement('div');
        backstoryField.className = 'form-group';
        
        const backstoryLabel = document.createElement('label');
        backstoryLabel.textContent = 'Motivación (opcional):';
        backstoryLabel.htmlFor = 'player-backstory';
        
        const backstoryInput = document.createElement('textarea');
        backstoryInput.id = 'player-backstory';
        backstoryInput.placeholder = 'Describe brevemente la motivación de tu personaje...';
        backstoryInput.maxLength = 200;
        backstoryInput.rows = 3;
        backstoryInput.addEventListener('input', (e) => {
            this.playerBackstory = e.target.value;
        });
        
        backstoryField.appendChild(backstoryLabel);
        backstoryField.appendChild(backstoryInput);
        newGameScreen.appendChild(backstoryField);
        
        // Botones de acción
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const startButton = document.createElement('button');
        startButton.className = 'main-button';
        startButton.textContent = 'Comenzar Partida';
        startButton.addEventListener('click', () => this.startNewGame());
        
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = 'Volver';
        backButton.addEventListener('click', () => this.showScreen('main'));
        
        actionButtons.appendChild(startButton);
        actionButtons.appendChild(backButton);
        newGameScreen.appendChild(actionButtons);
        
        this.elements.screenContainer.appendChild(newGameScreen);
        this.elements.newGameScreen = newGameScreen;
    }
    
    createLoadGameScreen() {
        const loadGameScreen = document.createElement('div');
        loadGameScreen.className = 'menu-screen';
        loadGameScreen.id = 'load-game-screen';
        
        // Título de la pantalla
        const screenTitle = document.createElement('h3');
        screenTitle.textContent = 'Cargar Partida';
        loadGameScreen.appendChild(screenTitle);
        
        // Contenedor de slots de guardado
        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'save-slots-container';
        
        // Crear 3 slots
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'save-slot';
            slot.dataset.index = i;
            
            // Comprobar si el slot tiene datos
            if (this.saveSlots[i] && !this.saveSlots[i].isEmpty) {
                const slotInfo = this.saveSlots[i];
                
                const slotHeader = document.createElement('div');
                slotHeader.className = 'slot-header';
                
                const slotTitle = document.createElement('h4');
                slotTitle.textContent = slotInfo.playerName;
                
                const slotDate = document.createElement('span');
                slotDate.className = 'slot-date';
                slotDate.textContent = new Date(slotInfo.timestamp).toLocaleDateString();
                
                slotHeader.appendChild(slotTitle);
                slotHeader.appendChild(slotDate);
                
                const slotDetails = document.createElement('div');
                slotDetails.className = 'slot-details';
                
                const specBadge = document.createElement('span');
                specBadge.className = `spec-badge ${slotInfo.specialization}`;
                specBadge.textContent = this.getSpecializationName(slotInfo.specialization);
                
                const levelInfo = document.createElement('span');
                levelInfo.className = 'level-info';
                levelInfo.textContent = `Nivel: ${slotInfo.level}`;
                
                slotDetails.appendChild(specBadge);
                slotDetails.appendChild(levelInfo);
                
                slot.appendChild(slotHeader);
                slot.appendChild(slotDetails);
                
                // Agregar evento para cargar partida
                slot.addEventListener('click', () => this.loadGame(i));
            } else {
                // Slot vacío
                const emptyText = document.createElement('div');
                emptyText.className = 'empty-slot-text';
                emptyText.textContent = 'Slot vacío';
                
                slot.classList.add('empty');
                slot.appendChild(emptyText);
                
                // Los slots vacíos no tienen acción
            }
            
            slotsContainer.appendChild(slot);
        }
        
        loadGameScreen.appendChild(slotsContainer);
        
        // Botón para volver
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = 'Volver';
        backButton.addEventListener('click', () => this.showScreen('main'));
        
        loadGameScreen.appendChild(backButton);
        
        this.elements.screenContainer.appendChild(loadGameScreen);
        this.elements.loadGameScreen = loadGameScreen;
    }
    
    createOptionsScreen() {
        const optionsScreen = document.createElement('div');
        optionsScreen.className = 'menu-screen';
        optionsScreen.id = 'options-screen';
        
        // Título de la pantalla
        const screenTitle = document.createElement('h3');
        screenTitle.textContent = this.localization.getText('screen.options');
        screenTitle.dataset.i18n = 'screen.options';
        optionsScreen.appendChild(screenTitle);
        
        // Contenedor de opciones
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Agrupar opciones en secciones
        const audioSection = document.createElement('div');
        audioSection.className = 'options-section';
        const audioTitle = document.createElement('h4');
        audioTitle.textContent = this.localization.getText('options.audio');
        audioTitle.dataset.i18n = 'options.audio';
        audioSection.appendChild(audioTitle);
        
        // Opción: Volumen de música
        const musicOption = this.createSliderOption(
            'music-volume', 
            this.localization.getText('options.musicVolume'), 
            'options.musicVolume',
            this.gameOptions.musicVolume,
            (value) => {
                this.gameOptions.musicVolume = value;
                // Aplicar cambio en tiempo real
                if (this.audioManager) {
                    this.audioManager.setMusicVolume(value);
                }
            }
        );
        audioSection.appendChild(musicOption);
        
        // Opción: Volumen de efectos
        const sfxOption = this.createSliderOption(
            'sfx-volume', 
            this.localization.getText('options.sfxVolume'), 
            'options.sfxVolume',
            this.gameOptions.sfxVolume,
            (value) => {
                this.gameOptions.sfxVolume = value;
                // Aplicar cambio en tiempo real
                if (this.audioManager) {
                    this.audioManager.setSFXVolume(value);
                    // Reproducir un efecto para demostrar el volumen
                    this.audioManager.playSFX('hover');
                }
            }
        );
        audioSection.appendChild(sfxOption);
        
        // Sección de pantalla
        const displaySection = document.createElement('div');
        displaySection.className = 'options-section';
        const displayTitle = document.createElement('h4');
        displayTitle.textContent = this.localization.getText('options.display');
        displayTitle.dataset.i18n = 'options.display';
        displaySection.appendChild(displayTitle);
        
        // Opción: Pantalla completa
        const fullscreenOption = this.createToggleOption(
            'fullscreen',
            this.localization.getText('options.fullscreen'),
            'options.fullscreen',
            this.gameOptions.fullscreen,
            (value) => {
                this.gameOptions.fullscreen = value;
                this.toggleFullscreen(value);
            }
        );
        displaySection.appendChild(fullscreenOption);
        
        // Opción: Calidad visual
        const visualQualityOption = this.createSelectOption(
            'visual-quality',
            this.localization.getText('options.visualQuality'),
            'options.visualQuality',
            [
                { value: 'low', label: this.localization.getText('quality.low'), i18nKey: 'quality.low' },
                { value: 'medium', label: this.localization.getText('quality.medium'), i18nKey: 'quality.medium' },
                { value: 'high', label: this.localization.getText('quality.high'), i18nKey: 'quality.high' }
            ],
            this.gameOptions.visualQuality,
            (value) => {
                this.gameOptions.visualQuality = value;
                this.applyVisualQuality(value);
            }
        );
        displaySection.appendChild(visualQualityOption);
        
        // Opción: FPS objetivo
        const fpsOption = this.createSelectOption(
            'target-fps',
            this.localization.getText('options.targetFPS'),
            'options.targetFPS',
            [
                { value: '30', label: this.localization.getText('fps.30'), i18nKey: 'fps.30' },
                { value: '60', label: this.localization.getText('fps.60'), i18nKey: 'fps.60' },
                { value: '120', label: this.localization.getText('fps.120'), i18nKey: 'fps.120' },
                { value: 'unlimited', label: this.localization.getText('fps.unlimited'), i18nKey: 'fps.unlimited' }
            ],
            this.gameOptions.targetFPS.toString(),
            (value) => {
                this.gameOptions.targetFPS = value === 'unlimited' ? Infinity : parseInt(value);
            }
        );
        displaySection.appendChild(fpsOption);
        
        // Sección de juego
        const gameSection = document.createElement('div');
        gameSection.className = 'options-section';
        const gameTitle = document.createElement('h4');
        gameTitle.textContent = this.localization.getText('options.game');
        gameTitle.dataset.i18n = 'options.game';
        gameSection.appendChild(gameTitle);
        
        // Opción: Dificultad
        const difficultyOption = this.createSelectOption(
            'difficulty',
            this.localization.getText('options.difficulty'),
            'options.difficulty',
            [
                { value: 'easy', label: this.localization.getText('difficulty.easy'), i18nKey: 'difficulty.easy' },
                { value: 'normal', label: this.localization.getText('difficulty.normal'), i18nKey: 'difficulty.normal' },
                { value: 'hard', label: this.localization.getText('difficulty.hard'), i18nKey: 'difficulty.hard' }
            ],
            this.gameOptions.difficulty,
            (value) => {
                this.gameOptions.difficulty = value;
            }
        );
        gameSection.appendChild(difficultyOption);
        
        // Opción: Idioma
        const languageOption = this.createSelectOption(
            'language',
            this.localization.getText('options.language'),
            'options.language',
            [
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'Français' }
            ],
            this.gameOptions.language,
            (value) => {
                this.gameOptions.language = value;
                this.applyLanguage(value);
            }
        );
        gameSection.appendChild(languageOption);
        
        // Sección de accesibilidad
        const accessibilitySection = document.createElement('div');
        accessibilitySection.className = 'options-section';
        const accessibilityTitle = document.createElement('h4');
        accessibilityTitle.textContent = this.localization.getText('options.accessibility');
        accessibilityTitle.dataset.i18n = 'options.accessibility';
        accessibilitySection.appendChild(accessibilityTitle);
        
        // Opción: Modo de alto contraste
        const highContrastOption = this.createToggleOption(
            'high-contrast',
            this.localization.getText('options.highContrast'),
            'options.highContrast',
            this.gameOptions.highContrast,
            (value) => {
                this.gameOptions.highContrast = value;
                this.applyHighContrast(value);
            }
        );
        accessibilitySection.appendChild(highContrastOption);
        
        // Opción: Vibración de pantalla
        const screenShakeOption = this.createToggleOption(
            'screen-shake',
            this.localization.getText('options.screenShake'),
            'options.screenShake',
            this.gameOptions.screenShake,
            (value) => {
                this.gameOptions.screenShake = value;
            }
        );
        accessibilitySection.appendChild(screenShakeOption);
        
        // Añadir todas las secciones
        optionsContainer.appendChild(audioSection);
        optionsContainer.appendChild(displaySection);
        optionsContainer.appendChild(gameSection);
        optionsContainer.appendChild(accessibilitySection);
        
        optionsScreen.appendChild(optionsContainer);
        
        // Botones de acción
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        // Botón para probar efectos de sonido
        const testSoundButton = document.createElement('button');
        testSoundButton.className = 'test-button';
        testSoundButton.textContent = this.localization.getText('button.testSound');
        testSoundButton.dataset.i18n = 'button.testSound';
        testSoundButton.addEventListener('click', () => {
            if (this.audioManager) {
                this.audioManager.playSFX('select');
                this.showNotification(this.localization.getText('notify.soundTest'));
            }
        });
        
        const saveButton = document.createElement('button');
        saveButton.className = 'main-button';
        saveButton.textContent = this.localization.getText('button.saveChanges');
        saveButton.dataset.i18n = 'button.saveChanges';
        saveButton.addEventListener('click', () => {
            this.saveOptions();
            this.playSelectSound();
            this.showNotification(this.localization.getText('notify.optionsSaved'));
            this.showScreen('main');
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'back-button';
        cancelButton.textContent = this.localization.getText('button.cancel');
        cancelButton.dataset.i18n = 'button.cancel';
        cancelButton.addEventListener('click', () => {
            // Restablecer opciones cargadas
            this.loadSavedOptions();
            this.playSelectSound('back');
            this.showScreen('main');
        });
        
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-button';
        resetButton.textContent = this.localization.getText('button.reset');
        resetButton.dataset.i18n = 'button.reset';
        resetButton.addEventListener('click', () => {
            if (confirm(this.localization.getText('confirm.resetOptions'))) {
                // Restablecer a valores por defecto
                this.gameOptions = {
                    musicVolume: 0.7,
                    sfxVolume: 0.8,
                    fullscreen: false,
                    difficulty: 'normal',
                    language: 'es',
                    visualQuality: 'high',
                    targetFPS: 60,
                    highContrast: false,
                    screenShake: true
                };
                
                // Aplicar cambios
                this.applyCurrentOptions();
                
                // Actualizar todos los controles de la interfaz
                this.updateOptionsUI();
                
                this.playSelectSound();
                this.showNotification(this.localization.getText('notify.optionsReset'));
            }
        });
        
        const buttonsRow1 = document.createElement('div');
        buttonsRow1.className = 'buttons-row';
        buttonsRow1.appendChild(saveButton);
        buttonsRow1.appendChild(cancelButton);
        
        const buttonsRow2 = document.createElement('div');
        buttonsRow2.className = 'buttons-row secondary-buttons';
        buttonsRow2.appendChild(testSoundButton);
        buttonsRow2.appendChild(resetButton);
        
        actionButtons.appendChild(buttonsRow1);
        actionButtons.appendChild(buttonsRow2);
        optionsScreen.appendChild(actionButtons);
        
        this.elements.screenContainer.appendChild(optionsScreen);
        this.elements.optionsScreen = optionsScreen;
    }
    
    // Métodos de ayuda para crear opciones
    createSliderOption(id, label, i18nKey, value, onChange) {
        const container = document.createElement('div');
        container.className = 'option-item slider-option';
        
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;
        labelEl.dataset.i18n = i18nKey;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'option-value';
        valueDisplay.textContent = Math.round(value * 100) + '%';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = value;
        
        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            valueDisplay.textContent = Math.round(newValue * 100) + '%';
            onChange(newValue);
        });
        
        container.appendChild(labelEl);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        
        return container;
    }
    
    createToggleOption(id, label, i18nKey, isChecked, onChange) {
        const container = document.createElement('div');
        container.className = 'option-item toggle-option';
        
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;
        labelEl.dataset.i18n = i18nKey;
        
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'toggle-wrapper';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = isChecked;
        
        const toggleDisplay = document.createElement('div');
        toggleDisplay.className = 'toggle-display';
        
        checkbox.addEventListener('change', (e) => {
            onChange(e.target.checked);
        });
        
        toggleWrapper.appendChild(checkbox);
        toggleWrapper.appendChild(toggleDisplay);
        
        container.appendChild(labelEl);
        container.appendChild(toggleWrapper);
        
        return container;
    }
    
    createSelectOption(id, label, i18nKey, options, currentValue, onChange) {
        const container = document.createElement('div');
        container.className = 'option-item select-option';
        
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;
        labelEl.dataset.i18n = i18nKey;
        
        const select = document.createElement('select');
        select.id = id;
        
        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            optionEl.dataset.i18n = option.i18nKey;
            if (option.value === currentValue) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
        
        select.addEventListener('change', (e) => {
            onChange(e.target.value);
        });
        
        container.appendChild(labelEl);
        container.appendChild(select);
        
        return container;
    }
    
    // Métodos de control del menú
    handleMenuAction(action) {
        this.playSelectSound();
        
        switch (action) {
            case 'new-game':
                this.showScreen('new-game');
                break;
                
            case 'load-game':
                this.refreshSaveSlots();
                this.showScreen('load-game');
                break;
                
            case 'options':
                this.showScreen('options');
                break;
                
            case 'exit':
                this.exitGame();
                break;
        }
    }
    
    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.menu-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        const screenElement = document.getElementById(`${screenId}-screen`);
        if (screenElement) {
            screenElement.classList.add('active');
            
            // Efecto de entrada según el tema
            screenElement.style.animation = 'none';
            setTimeout(() => {
                screenElement.style.animation = `${this.theme.animations.menuEntrance} 0.5s forwards`;
            }, 10);
            
            this.currentScreen = screenId;
        }
    }
    
    startNewGame() {
        if (!this.playerNameInput || this.playerNameInput.trim() === '') {
            this.showNotification('Debes ingresar un nombre');
            return;
        }
        
        if (!this.selectedGender) {
            this.showNotification('Selecciona una identidad');
            return;
        }
        
        if (this.selectedSpecialization === 'neutral') {
            this.showNotification('Selecciona una especialización');
            return;
        }
        
        // Crear jugador y comenzar partida
        const player = Player.startNewGame(
            this.playerNameInput.trim(),
            this.selectedSpecialization,
            this.selectedGender,
            this.playerBackstory || ''
        );
        
        // Aquí iría la lógica para iniciar el juego con el player creado
        console.log('¡Iniciando nueva partida!', player);
        
        // Por ahora, simularemos el inicio guardando en localStorage
        localStorage.setItem('current_player', JSON.stringify(player.serialize()));
        
        // Redirigir a página de juego
        window.location.href = 'game.html'; 
    }
    
    loadGame(slotIndex) {
        const slotInfo = this.saveSlots[slotIndex];
        if (slotInfo && !slotInfo.isEmpty) {
            const player = Player.loadGame(slotIndex);
            
            if (player) {
                console.log('Cargando partida desde slot', slotIndex);
                localStorage.setItem('current_player', JSON.stringify(player.serialize()));
                
                // Redirigir a página de juego
                window.location.href = 'game.html';
            } else {
                this.showNotification('Error al cargar la partida');
            }
        }
    }
    
    refreshSaveSlots() {
        // Actualizar datos de partidas guardadas
        this.saveSlots = Player.getSaveSlotInfo();
        
        // Actualizar visualización de slots
        // (implementación básica - la real actualizaría el DOM)
    }
    
    exitGame() {
        // En un juego web, podríamos cerrar la ventana o redirigir
        if (confirm('¿Seguro que quieres salir?')) {
            window.close();
            // Alternativa para navegadores que no permiten cerrar:
            // window.location.href = 'https://github.com/';
        }
    }
    
    // Métodos para efectos visuales y de audio
    applyTheme() {
        document.documentElement.style.setProperty('--menu-frame-color', this.theme.uiElements.menuFrameColor);
        document.documentElement.style.setProperty('--text-glow-color', this.theme.uiElements.textGlowColor);
        document.documentElement.style.setProperty('--mist-opacity', this.theme.uiElements.mistOpacity);
        document.documentElement.style.setProperty('--background-blur', this.theme.uiElements.backgroundBlur);
        
        // Aplicar fuente
        document.body.style.fontFamily = this.theme.uiElements.font;
        
        // Aplicar cursor personalizado
        if (this.theme.uiElements.cursor) {
            document.body.style.cursor = `url('assets/cursors/${this.theme.uiElements.cursor}.png'), auto`;
        }
    }
    
    startBackgroundEffects() {
        // Animación de niebla
        const mistLayer = this.elements.mistLayer;
        if (mistLayer) {
            // Crear elementos de niebla que se mueven lentamente
            for (let i = 0; i < 5; i++) {
                const mistElement = document.createElement('div');
                mistElement.className = 'mist-element';
                mistElement.style.opacity = (Math.random() * 0.3 + 0.1).toString();
                mistElement.style.left = (Math.random() * 100) + '%';
                mistElement.style.top = (Math.random() * 100) + '%';
                mistElement.style.animationDuration = (Math.random() * 15 + 15) + 's';
                mistElement.style.animationDelay = (Math.random() * 5) + 's';
                mistLayer.appendChild(mistElement);
            }
        }
        
        // Animación de partículas digitales (efecto Matrix)
        const backgroundLayer = this.elements.backgroundLayer;
        if (backgroundLayer) {
            // Creamos varias líneas de código cayendo
            for (let i = 0; i < 15; i++) {
                const codeStream = document.createElement('div');
                codeStream.className = 'code-stream';
                codeStream.style.left = (Math.random() * 100) + '%';
                codeStream.style.animationDuration = (Math.random() * 10 + 10) + 's';
                codeStream.style.animationDelay = (Math.random() * 5) + 's';
                
                // Generar caracteres para la columna de código
                let codeChars = '';
                const charCount = Math.floor(Math.random() * 15) + 10;
                for (let j = 0; j < charCount; j++) {
                    codeChars += this.getRandomHexChar();
                }
                
                codeStream.textContent = codeChars;
                backgroundLayer.appendChild(codeStream);
            }
        }
    }
    
    getRandomHexChar() {
        const chars = '0123456789ABCDEF∅⌀⏏⭘⸮⌧Ø£¥×÷';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    playBackgroundMusic() {
        // Usar el sistema de audio para reproducir música
        if (this.audioManager && this.audioManager.context) {
            this.audioManager.playMusic('menu');
        } else {
            console.log('Sistema de audio no disponible para reproducir música');
        }
    }
    
    playHoverSound() {
        // Usar el sistema de audio para reproducir efecto
        if (this.audioManager && this.audioManager.context) {
            this.audioManager.playSFX('hover');
        } else {
            console.log('Reproduciendo sonido hover:', this.theme.audio.hoverSound);
        }
    }
    
    playSelectSound(type = 'select') {
        // Usar el sistema de audio para reproducir efecto
        if (this.audioManager && this.audioManager.context) {
            this.audioManager.playSFX(type === 'back' ? 'back' : 'select');
        } else {
            console.log('Reproduciendo sonido select:', this.theme.audio.selectSound);
        }
    }
    
    toggleFullscreen(enable) {
        try {
            if (enable) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Error al cambiar modo de pantalla completa:', error);
            this.showNotification('Error al cambiar la pantalla completa');
        }
    }
    
    showNotification(message) {
        // Implementación básica de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Eliminar después de un tiempo
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    getSpecializationName(specId) {
        switch(specId) {
            case 'red': return 'Ofensivo';
            case 'blue': return 'Defensivo';
            case 'purple': return 'Equilibrado';
            default: return 'Desconocido';
        }
    }

    createTitle() {
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-container';
        
        const title = document.createElement('h1');
        // Opción 1: Texto normal en mayúsculas (como estaba)
        title.textContent = 'CYBERVANIA';
        
        /* Alternativas para mayor legibilidad:
        // Opción 2: Formato CamelCase para mejor legibilidad
        // title.textContent = 'CyberVania';
        
        // Opción 3: Primera letra en mayúscula, resto en minúsculas
        // title.textContent = 'Cybervania';
        */
        
        title.setAttribute('data-text', title.textContent);
        
        const subtitle = document.createElement('h2');
        subtitle.textContent = 'Donde la oscuridad se encuentra con el código';
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);
        this.container.appendChild(titleContainer);
    }

    // Método para formatear nombres de estadísticas
    formatStatName(key) {
        const names = {
            'health': 'Salud',
            'defense': 'Defensa',
            'attack': 'Ataque',
            'actionPoints': 'Puntos de acción'
        };
        return names[key] || key;
    }

    // Método para actualizar la vista previa del personaje
    updateCharacterPreview() {
        const preview = document.querySelector('.character-preview');
        if (!preview) return;
        
        const nameElement = preview.querySelector('.preview-name');
        const classElement = preview.querySelector('.preview-class');
        const descriptionElement = preview.querySelector('.preview-description');
        const avatar = preview.querySelector('.character-avatar');
        
        // Actualizar nombre
        nameElement.textContent = this.playerNameInput || '---';
        
        // Actualizar clase y descripción
        let className = 'Sin especificar';
        let description = 'Selecciona una especialización y género para ver detalles.';
        
        // Determinar clase según especialización seleccionada
        if (this.selectedSpecialization === 'red') {
            className = 'Red Team - Ofensivo';
            description = 'Especialista en penetración y ataque digital. Mayor daño pero más vulnerable.';
        } else if (this.selectedSpecialization === 'blue') {
            className = 'Blue Team - Defensivo';
            description = 'Experto en seguridad y protección. Mayor resistencia a ataques.';
        } else if (this.selectedSpecialization === 'purple') {
            className = 'Purple Team - Equilibrado';
            description = 'Dominio de técnicas ofensivas y defensivas. Mayor versatilidad táctica.';
        }
        
        classElement.textContent = className;
        descriptionElement.textContent = description;
        
        // Actualizar avatar según género y especialización
        if (avatar) {
            // Limpiar clases previas
            avatar.className = 'character-avatar';
            
            // Añadir clases según selecciones
            if (this.selectedGender) {
                avatar.classList.add(this.selectedGender);
            }
            
            if (this.selectedSpecialization) {
                avatar.classList.add(this.selectedSpecialization);
            }
            
            // Actualizar silueta con SVG adecuado
            const silhouette = avatar.querySelector('.silhouette');
            if (silhouette) {
                let svgContent = '';
                
                if (this.selectedGender === 'male') {
                    svgContent = this.getMaleSilhouette(this.selectedSpecialization);
                } else if (this.selectedGender === 'female') {
                    svgContent = this.getFemaleSilhouette(this.selectedSpecialization);
                } else {
                    svgContent = '<svg viewBox="0 0 100 100"><circle cx="50" cy="30" r="20" fill="#444"/><rect x="40" y="50" width="20" height="40" fill="#444"/></svg>';
                }
                
                silhouette.innerHTML = svgContent;
            }
        }
    }

    // Siluetas según género y especialización
    getMaleSilhouette(spec) {
        const baseColor = spec === 'red' ? '#ff3a4a' : spec === 'blue' ? '#1fa7ff' : '#a742ff';
        
        return `<svg viewBox="0 0 100 120">
            <defs>
                <linearGradient id="cyberbg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${baseColor}" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="${baseColor}" stop-opacity="0.1" />
                </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#cyberbg)" />
            <circle cx="50" cy="25" r="15" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M35,40 L65,40 L65,80 L55,80 L55,100 L45,100 L45,80 L35,80 Z" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M35,50 L25,70 M65,50 L75,70" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M45,40 L40,25 M55,40 L60,25" fill="none" stroke="${baseColor}" stroke-width="1" />
            <circle cx="43" cy="22" r="2" fill="${baseColor}" />
            <circle cx="57" cy="22" r="2" fill="${baseColor}" />
            <path d="M45,30 L55,30" stroke="${baseColor}" stroke-width="1" />
        </svg>`;
    }

    getFemaleSilhouette(spec) {
        const baseColor = spec === 'red' ? '#ff3a4a' : spec === 'blue' ? '#1fa7ff' : '#a742ff';
        
        return `<svg viewBox="0 0 100 120">
            <defs>
                <linearGradient id="cyberbg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${baseColor}" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="${baseColor}" stop-opacity="0.1" />
                </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#cyberbg)" />
            <circle cx="50" cy="25" r="15" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M35,40 L40,80 L45,80 L45,100 L55,100 L55,80 L60,80 L65,40 Z" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M35,50 L25,65 M65,50 L75,65" fill="none" stroke="${baseColor}" stroke-width="2" />
            <path d="M45,40 L40,25 M55,40 L60,25" fill="none" stroke="${baseColor}" stroke-width="1" />
            <circle cx="43" cy="22" r="2" fill="${baseColor}" />
            <circle cx="57" cy="22" r="2" fill="${baseColor}" />
            <path d="M45,30 L55,30" stroke="${baseColor}" stroke-width="1" />
        </svg>`;
    }

    /**
     * Aplica el cambio de idioma y actualiza la interfaz
     * @param {string} language - Código del idioma ('es', 'en', 'fr')
     */
    applyLanguage(language) {
        console.log(`Cambiando idioma a: ${language}`);
        
        // Actualizar idioma en el sistema de localización
        const success = this.localization.setLanguage(language);
        
        if (!success) {
            console.error(`Idioma no soportado: ${language}`);
            return;
        }
        
        // Actualizar texto del título y subtítulo si necesario
        if (language === 'en') {
            this.theme.title = "CYBERVANIA";
            this.theme.subtitle = "Where darkness meets code";
        } else if (language === 'fr') {
            this.theme.title = "CYBERVANIA";
            this.theme.subtitle = "Où les ténèbres rencontrent le code";
        } else {
            // Español (predeterminado)
            this.theme.title = "CYBERVANIA";
            this.theme.subtitle = "Donde la oscuridad se encuentra con el código";
        }
        
        // Actualizar título y subtítulo
        if (this.elements.titleContainer) {
            const titleElement = this.elements.titleContainer.querySelector('h1');
            const subtitleElement = this.elements.titleContainer.querySelector('h2');
            
            if (titleElement) titleElement.textContent = this.theme.title;
            if (subtitleElement) subtitleElement.textContent = this.theme.subtitle;
        }
        
        // Actualizar todos los textos de la interfaz
        this.updateAllTexts();
    }

    /**
     * Actualiza todos los textos de la interfaz según el idioma actual
     */
    updateAllTexts() {
        // Actualizar elementos con atributo data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.localization.getText(key);
        });
        
        // Actualizar títulos de pantallas
        this.updateScreenTitles();
        
        // Actualizar menú principal
        this.updateMainMenu();
        
        // Actualizar etiquetas y textos de opciones
        this.updateOptionsUI();
        
        // Actualizar textos de la pantalla de nueva partida
        this.updateNewGameUI();
        
        // Actualizar textos de la pantalla de carga
        this.updateLoadGameUI();
    }

    /**
     * Actualiza los títulos de todas las pantallas
     */
    updateScreenTitles() {
        const screens = {
            'new-game': 'screen.newGame',
            'load-game': 'screen.loadGame',
            'options': 'screen.options'
        };
        
        // Actualizar cada título de pantalla
        Object.entries(screens).forEach(([screenId, titleKey]) => {
            const screen = document.getElementById(`${screenId}-screen`);
            if (screen) {
                const title = screen.querySelector('h3');
                if (title) {
                    title.textContent = this.localization.getText(titleKey);
                }
            }
        });
    }

    /**
     * Actualiza el menú principal con los textos traducidos
     */
    updateMainMenu() {
        if (!this.elements.mainScreen) return;
        
        const menuItems = this.elements.mainScreen.querySelectorAll('.menu-item');
        
        // Mapa de IDs de acción a claves de traducción
        const actionKeyMap = {
            'new-game': 'menu.newGame',
            'load-game': 'menu.loadGame',
            'options': 'menu.options',
            'exit': 'menu.exit'
        };
        
        // Actualizar cada elemento del menú
        menuItems.forEach(item => {
            const action = item.dataset.action;
            if (action && actionKeyMap[action]) {
                const textElement = item.querySelector('.menu-text');
                if (textElement) {
                    textElement.textContent = this.localization.getText(actionKeyMap[action]);
                }
            }
        });
    }

    /**
     * Actualiza la interfaz de opciones con textos traducidos
     */
    updateOptionsUI() {
        const optionsScreen = this.elements.optionsScreen;
        if (!optionsScreen) return;
        
        // Actualizar etiquetas
        optionsScreen.querySelectorAll('label[data-i18n]').forEach(label => {
            const key = label.dataset.i18n;
            label.textContent = this.localization.getText(key);
        });
        
        // Actualizar opciones en selectores
        optionsScreen.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.dataset.i18n;
            option.textContent = this.localization.getText(key);
        });
        
        // Actualizar botones
        optionsScreen.querySelectorAll('button[data-i18n]').forEach(button => {
            const key = button.dataset.i18n;
            button.textContent = this.localization.getText(key);
        });
    }

    /**
     * Actualiza la interfaz de nueva partida con textos traducidos
     */
    updateNewGameUI() {
        const newGameScreen = this.elements.newGameScreen;
        if (!newGameScreen) return;
        
        // Actualizar etiquetas para campos de entrada
        newGameScreen.querySelectorAll('label').forEach(label => {
            switch(label.htmlFor) {
                case 'player-name':
                    label.textContent = this.localization.getText('character.name') + ':';
                    break;
                case 'player-backstory':
                    label.textContent = this.localization.getText('character.motivation') + ':';
                    break;
            }
        });
        
        // Actualizar campos de entrada
        const nameInput = newGameScreen.querySelector('#player-name');
        if (nameInput) {
            nameInput.placeholder = this.localization.getText('character.enterName');
        }
        
        const backstoryInput = newGameScreen.querySelector('#player-backstory');
        if (backstoryInput) {
            backstoryInput.placeholder = this.localization.getText('character.motivationPlaceholder');
        }
        
        // Actualizar títulos de secciones
        const sectionTitles = newGameScreen.querySelectorAll('h4');
        sectionTitles.forEach(title => {
            if (title.textContent === 'Especialización') {
                title.textContent = this.localization.getText('character.specialization');
            } else if (title.textContent === 'Vista previa') {
                title.textContent = this.localization.getText('character.preview');
            }
        });
        
        // Actualizar opciones de género
        const maleOption = newGameScreen.querySelector('.gender-option[data-gender="male"] span');
        const femaleOption = newGameScreen.querySelector('.gender-option[data-gender="female"] span');
        
        if (maleOption) maleOption.textContent = this.localization.getText('character.male');
        if (femaleOption) femaleOption.textContent = this.localization.getText('character.female');
        
        const genderLabel = newGameScreen.querySelector('.gender-selection label');
        if (genderLabel) {
            genderLabel.textContent = this.localization.getText('character.identity') + ':';
        }
        
        // Actualizar tarjetas de especialización
        const specCards = newGameScreen.querySelectorAll('.spec-card');
        specCards.forEach(card => {
            const spec = card.dataset.spec;
            const title = card.querySelector('h5');
            const desc = card.querySelector('p');
            
            if (spec === 'red') {
                title.textContent = this.localization.getText('spec.redTeam');
                desc.textContent = this.localization.getText('spec.redDesc');
            } else if (spec === 'blue') {
                title.textContent = this.localization.getText('spec.blueTeam');
                desc.textContent = this.localization.getText('spec.blueDesc');
            } else if (spec === 'purple') {
                title.textContent = this.localization.getText('spec.purpleTeam');
                desc.textContent = this.localization.getText('spec.purpleDesc');
            }
            
            // Actualizar nombres de estadísticas
            const statNames = card.querySelectorAll('.stat-name');
            statNames.forEach(stat => {
                if (stat.textContent === 'Salud') {
                    stat.textContent = this.localization.getText('stat.health');
                } else if (stat.textContent === 'Defensa') {
                    stat.textContent = this.localization.getText('stat.defense');
                } else if (stat.textContent === 'Ataque') {
                    stat.textContent = this.localization.getText('stat.attack');
                } else if (stat.textContent === 'Puntos de acción') {
                    stat.textContent = this.localization.getText('stat.actionPoints');
                }
            });
        });
        
        // Actualizar botones
        const startButton = newGameScreen.querySelector('button.main-button');
        if (startButton) {
            startButton.textContent = this.localization.getText('button.start');
        }
        
        const backButton = newGameScreen.querySelector('button.back-button');
        if (backButton) {
            backButton.textContent = this.localization.getText('button.back');
        }
    }

    /**
     * Actualiza la interfaz de carga de partidas con textos traducidos
     */
    updateLoadGameUI() {
        const loadGameScreen = this.elements.loadGameScreen;
        if (!loadGameScreen) return;
        
        // Actualizar slots vacíos
        const emptySlots = loadGameScreen.querySelectorAll('.empty-slot-text');
        emptySlots.forEach(slot => {
            slot.textContent = this.localization.getText('save.empty');
        });
        
        // Actualizar información de nivel
        const levelInfos = loadGameScreen.querySelectorAll('.level-info');
        levelInfos.forEach(info => {
            const levelText = info.textContent.split(': ')[1];
            info.textContent = `${this.localization.getText('save.level')}: ${levelText}`;
        });
        
        // Actualizar botón de volver
        const backButton = loadGameScreen.querySelector('.back-button');
        if (backButton) {
            backButton.textContent = this.localization.getText('button.back');
        }
    }

    /**
     * Aplica calidad visual seleccionada
     */
    applyVisualQuality(quality) {
        console.log(`Aplicando calidad visual: ${quality}`);
        
        // Ajustar efecto de niebla
        if (this.menuEffects) {
            this.menuEffects.updateMistEffects(quality);
            
            // También ajustar la intensidad de los efectos generales
            const intensityMap = {
                'low': 0.3,
                'medium': 0.6,
                'high': 1.0
            };
            
            const intensity = intensityMap[quality] || 1.0;
            this.menuEffects.updateEffectsIntensity(intensity);
        }
        
        // Ajustar variables CSS que controlan efectos visuales
        document.documentElement.style.setProperty('--mist-opacity', 
            quality === 'low' ? '0.2' : 
            quality === 'medium' ? '0.3' : '0.4'
        );
        
        document.documentElement.style.setProperty('--background-blur',
            quality === 'low' ? '0px' : 
            quality === 'medium' ? '3px' : '5px'
        );
        
        // Manipular elementos visuales según la calidad
        const codeStreams = document.querySelectorAll('.code-stream');
        if (quality === 'low') {
            // Reducir elementos visuales en baja calidad
            codeStreams.forEach((el, index) => {
                if (index > 5) el.style.display = 'none';
            });
        } else {
            // Restaurar en calidades superiores
            codeStreams.forEach(el => {
                el.style.display = '';
            });
        }
    }

    /**
     * Aplica modo alto contraste
     */
    applyHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        console.log(`Modo alto contraste: ${enabled ? 'activado' : 'desactivado'}`);
        
        if (this.menuEffects) {
            this.menuEffects.toggleHighContrast(enabled);
        }
    }
}
