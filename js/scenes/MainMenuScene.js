import { Game } from '../game/Game.js';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Configurar el fondo del menú principal
        this.add.image(0, 0, 'bg-menu').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Reproducir música del menú
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('main-theme');
        }
        
        // Título del juego
        const titleText = this.add.text(this.cameras.main.width / 2, 150, 'CYBERVANIA', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '72px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 10, stroke: true, fill: true }
        }).setOrigin(0.5);
        
        // Efecto de pulso en el título
        this.tweens.add({
            targets: titleText,
            scale: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtítulo
        this.add.text(this.cameras.main.width / 2, 230, 'Una aventura en el reino digital', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#4444ff',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        
        // Crear panel de botones del menú
        this.createMainMenuPanel();
    }

    createMainMenuPanel() {
        const menuPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50);
        
        // Botones del menú
        const newGameButton = this.createButton(0, 0, 'NUEVA PARTIDA', () => {
            this.showCharacterSelectionPanel();
        });
        
        const continueButton = this.createButton(0, 80, 'CONTINUAR', () => {
            this.loadGame();
        });
        
        // Verificar si hay partida guardada
        const hasSavedGame = localStorage.getItem('cybervania_save') !== null;
        if (!hasSavedGame) {
            continueButton.alpha = 0.5;
            continueButton.disableInteractive();
        }
        
        const optionsButton = this.createButton(0, 160, 'OPCIONES', () => {
            this.showOptionsPanel();
        });
        
        const creditsButton = this.createButton(0, 240, 'CRÉDITOS', () => {
            this.showCreditsPanel();
        });
        
        menuPanel.add([newGameButton, continueButton, optionsButton, creditsButton]);
        
        // Versión del juego
        const versionText = this.add.text(0, 320, 'v1.0.0', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        menuPanel.add(versionText);
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const buttonBg = this.add.rectangle(0, 0, 300, 60, 0x000000, 0.7)
            .setStrokeStyle(2, 0x4444ff);
        
        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.add([buttonBg, buttonText]);
        
        // Interactividad
        button.setInteractive(new Phaser.Geom.Rectangle(-150, -30, 300, 60), Phaser.Geom.Rectangle.Contains);
        
        button.on('pointerover', () => {
            buttonBg.setFillStyle(0x222255, 0.8);
            buttonText.setTint(0xaaaaff);
            
            // Sonido
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('hover');
            }
        });
        
        button.on('pointerout', () => {
            buttonBg.setFillStyle(0x000000, 0.7);
            buttonText.setTint(0xffffff);
        });
        
        button.on('pointerdown', () => {
            buttonBg.setFillStyle(0x111133, 0.8);
        });
        
        button.on('pointerup', () => {
            buttonBg.setFillStyle(0x222255, 0.8);
            
            // Sonido
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('click');
            }
            
            callback();
        });
        
        return button;
    }
    
    showCharacterSelectionPanel() {
        // Oscurecer el fondo
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0);
        
        // Panel de selección
        const panel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 800, 500, 0x000000, 0.8)
            .setStrokeStyle(3, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -220, 'SELECCIÓN DE PERSONAJE', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Campo de nombre
        const nameLabel = this.add.text(-300, -150, 'NOMBRE:', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Input de texto simulado
        const nameInputBg = this.add.rectangle(0, -150, 400, 40, 0x333355)
            .setStrokeStyle(1, 0x4444ff);
        
        // Crear elemento DOM para el input real
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'player-name-input';
        nameInput.placeholder = 'Ingresa tu nombre...';
        nameInput.style = 'position: absolute; width: 380px; padding: 8px; font-family: monospace; color: white; background: #333355; border: 1px solid #4444ff; outline: none;';
        document.body.appendChild(nameInput);
        
        // Posicionar el input
        this.nameInputElement = this.add.dom(0, -150, nameInput).setOrigin(0.5);
        
        // Selector de especialización
        const specLabel = this.add.text(-300, -70, 'ESPECIALIZACIÓN:', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Opciones de especialización
        const redTeam = this.createSpecOption(-150, 0, 'red', 'Equipo Rojo', 'Ofensivo', 'Especializado en ataques y daño.');
        const blueTeam = this.createSpecOption(0, 0, 'blue', 'Equipo Azul', 'Defensivo', 'Especializado en defensa y supervivencia.');
        const purpleTeam = this.createSpecOption(150, 0, 'purple', 'Equipo Púrpura', 'Equilibrado', 'Capacidades ofensivas y defensivas balanceadas.');
        
        // Variable para rastrear la selección actual
        this.selectedSpec = null;
        this.specOptions = [redTeam, blueTeam, purpleTeam];
        
        // Botón para iniciar
        const startButton = this.createButton(0, 170, 'COMENZAR AVENTURA', () => {
            this.startNewGame();
        });
        
        // Botón para volver
        const backButton = this.createButton(0, 240, 'VOLVER', () => {
            // Remover el input DOM
            if (this.nameInputElement) {
                this.nameInputElement.destroy();
            }
            document.getElementById('player-name-input')?.remove();
            
            // Destruir el panel
            panel.destroy();
            overlay.destroy();
        });
        
        // Añadir elementos al panel
        panel.add([
            panelBg, 
            titleText, 
            nameLabel, 
            nameInputBg, 
            specLabel, 
            redTeam.container, 
            blueTeam.container, 
            purpleTeam.container,
            startButton,
            backButton
        ]);
    }
    
    createSpecOption(x, y, id, name, type, description) {
        const container = this.add.container(x, y);
        
        // Fondo
        const bg = this.add.rectangle(0, 0, 180, 120, 0x222222, 0.8)
            .setStrokeStyle(2, id === 'red' ? 0xff4444 : id === 'blue' ? 0x4444ff : 0xff44ff);
        
        // Título
        const titleText = this.add.text(0, -40, name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '20px',
            color: id === 'red' ? '#ff6666' : id === 'blue' ? '#6666ff' : '#ff66ff'
        }).setOrigin(0.5);
        
        // Tipo
        const typeText = this.add.text(0, -15, type, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Descripción
        const descText = this.add.text(0, 20, description, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#cccccc',
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        
        container.add([bg, titleText, typeText, descText]);
        
        // Interactividad
        container.setInteractive(new Phaser.Geom.Rectangle(-90, -60, 180, 120), Phaser.Geom.Rectangle.Contains);
        
        container.on('pointerover', () => {
            bg.setFillStyle(0x444444, 0.8);
        });
        
        container.on('pointerout', () => {
            if (this.selectedSpec !== id) {
                bg.setFillStyle(0x222222, 0.8);
            }
        });
        
        container.on('pointerdown', () => {
            this.selectSpecialization(id);
        });
        
        return { container, bg, id };
    }
    
    selectSpecialization(specId) {
        // Actualizar selección visual
        this.selectedSpec = specId;
        
        for (const option of this.specOptions) {
            if (option.id === specId) {
                option.bg.setFillStyle(0x666666, 0.8);
                option.bg.setStrokeStyle(3, option.id === 'red' ? 0xff4444 : option.id === 'blue' ? 0x4444ff : 0xff44ff);
            } else {
                option.bg.setFillStyle(0x222222, 0.8);
                option.bg.setStrokeStyle(2, option.id === 'red' ? 0xff4444 : option.id === 'blue' ? 0x4444ff : 0xff44ff);
            }
        }
        
        // Sonido
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound('click');
        }
    }
    
    startNewGame() {
        // Validar nombre
        const nameInput = document.getElementById('player-name-input');
        const playerName = nameInput.value.trim() || 'Hacker';
        
        // Validar especialización
        if (!this.selectedSpec) {
            // Mostrar mensaje de error
            this.showToast('Por favor selecciona una especialización');
            return;
        }
        
        // Remover el input DOM
        if (this.nameInputElement) {
            this.nameInputElement.destroy();
        }
        nameInput.remove();
        
        // Crear nueva partida
        const newGame = Game.createNewGame(playerName, this.selectedSpec);
        
        // Sonido de inicio
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound('level-up');
        }
        
        // Ir al mapa
        this.scene.start('MapScene');
    }
    
    loadGame() {
        // Cargar partida guardada
        const loadedGame = Game.loadGame();
        
        if (loadedGame) {
            // Sonido de éxito
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('success');
            }
            
            // Ir al mapa
            this.scene.start('MapScene');
        } else {
            this.showToast('No se pudo cargar la partida guardada');
        }
    }
    
    showOptionsPanel() {
        // Oscurecer el fondo
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0);
        
        // Panel de opciones
        const panel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.8)
            .setStrokeStyle(3, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -160, 'OPCIONES', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Control de volumen de música
        const musicLabel = this.add.text(-250, -100, 'MÚSICA:', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Slider de música simulado
        const musicSliderBg = this.add.rectangle(0, -100, 300, 20, 0x333333).setOrigin(0.5);
        const musicSlider = this.add.rectangle(-150, -100, 150, 20, 0x4444ff).setOrigin(0);
        const musicSliderHandle = this.add.circle(0, -100, 15, 0x6666ff);
        
        // Control de volumen de sonido
        const soundLabel = this.add.text(-250, -40, 'EFECTOS:', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Slider de sonido simulado
        const soundSliderBg = this.add.rectangle(0, -40, 300, 20, 0x333333).setOrigin(0.5);
        const soundSlider = this.add.rectangle(-150, -40, 150, 20, 0x4444ff).setOrigin(0);
        const soundSliderHandle = this.add.circle(0, -40, 15, 0x6666ff);
        
        // Botones de toggle
        const musicToggle = this.createToggleButton(200, -100, window.dataManager?.audioManager?.musicEnabled || true, (enabled) => {
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.toggleMusic();
            }
        });
        
        const soundToggle = this.createToggleButton(200, -40, window.dataManager?.audioManager?.soundEnabled || true, (enabled) => {
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.toggleSound();
            }
        });
        
        // Botón para volver
        const backButton = this.createButton(0, 120, 'VOLVER', () => {
            panel.destroy();
            overlay.destroy();
        });
        
        // Añadir elementos al panel
        panel.add([
            panelBg, 
            titleText, 
            musicLabel, 
            musicSliderBg, 
            musicSlider, 
            musicSliderHandle,
            soundLabel, 
            soundSliderBg, 
            soundSlider, 
            soundSliderHandle,
            musicToggle,
            soundToggle,
            backButton
        ]);
        
        // Lógica del slider de música
        musicSliderBg.setInteractive();
        musicSliderBg.on('pointerdown', (pointer) => {
            const localX = pointer.x - (musicSliderBg.x - musicSliderBg.width / 2);
            const percentage = Phaser.Math.Clamp(localX / musicSliderBg.width, 0, 1);
            
            musicSlider.width = percentage * 300;
            musicSliderHandle.x = musicSlider.x + musicSlider.width;
            
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.setMusicVolume(percentage);
            }
        });
        
        // Lógica del slider de sonido
        soundSliderBg.setInteractive();
        soundSliderBg.on('pointerdown', (pointer) => {
            const localX = pointer.x - (soundSliderBg.x - soundSliderBg.width / 2);
            const percentage = Phaser.Math.Clamp(localX / soundSliderBg.width, 0, 1);
            
            soundSlider.width = percentage * 300;
            soundSliderHandle.x = soundSlider.x + soundSlider.width;
            
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.setSoundVolume(percentage);
            }
        });
    }
    
    createToggleButton(x, y, initialState, callback) {
        const container = this.add.container(x, y);
        
        // Fondo
        const bg = this.add.rectangle(0, 0, 50, 26, initialState ? 0x4444ff : 0x666666)
            .setStrokeStyle(2, 0xaaaaaa);
        
        // Círculo indicador
        const indicator = this.add.circle(initialState ? 13 : -13, 0, 10, 0xffffff);
        
        container.add([bg, indicator]);
        container.state = initialState;
        
        // Interactividad
        container.setInteractive(new Phaser.Geom.Rectangle(-25, -13, 50, 26), Phaser.Geom.Rectangle.Contains);
        
        container.on('pointerdown', () => {
            container.state = !container.state;
            
            bg.setFillStyle(container.state ? 0x4444ff : 0x666666);
            indicator.x = container.state ? 13 : -13;
            
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('click');
            }
            
            if (callback) callback(container.state);
        });
        
        return container;
    }
    
    showCreditsPanel() {
        // Oscurecer el fondo
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0);
        
        // Panel de créditos
        const panel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 600, 500, 0x000000, 0.8)
            .setStrokeStyle(3, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -220, 'CRÉDITOS', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Contenido de los créditos
        const creditsContent = [
            { role: 'CONCEPTO Y DISEÑO', name: 'Guillermo Rodas' },
            { role: 'PROGRAMACIÓN', name: 'Guillermo Rodas' },
            { role: 'ARTE CONCEPTUAL', name: 'Github Copilot Art' },
            { role: 'MÚSICA Y SONIDO', name: 'Recursos de audio gratuitos' },
            { role: 'AGRADECIMIENTOS ESPECIALES', name: 'La comunidad de deckbuilders' }
        ];
        
        let yPos = -150;
        for (const credit of creditsContent) {
            const roleText = this.add.text(0, yPos, credit.role, {
                fontFamily: 'Pirata One, cursive',
                fontSize: '24px',
                color: '#aaaaff',
                align: 'center'
            }).setOrigin(0.5);
            
            const nameText = this.add.text(0, yPos + 30, credit.name, {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            panel.add([roleText, nameText]);
            yPos += 70;
        }
        
        // Texto adicional
        const additionalText = this.add.text(0, yPos + 20, '© 2023 Cybervania - Todos los derechos reservados', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);
        
        panel.add(additionalText);
        
        // Botón para volver
        const backButton = this.createButton(0, 200, 'VOLVER', () => {
            panel.destroy();
            overlay.destroy();
        });
        
        panel.add(backButton);
    }
    
    showToast(message) {
        const toastContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height - 100);
        
        const toastBg = this.add.rectangle(0, 0, message.length * 12, 40, 0x000000, 0.8)
            .setStrokeStyle(2, 0xff4444);
        
        const toastText = this.add.text(0, 0, message, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        toastContainer.add([toastBg, toastText]);
        
        // Animar entrada y salida
        toastContainer.y += 50;
        toastContainer.alpha = 0;
        
        this.tweens.add({
            targets: toastContainer,
            y: this.cameras.main.height - 100,
            alpha: 1,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: toastContainer,
                        y: '+=50',
                        alpha: 0,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            toastContainer.destroy();
                        }
                    });
                });
            }
        });
    }
}