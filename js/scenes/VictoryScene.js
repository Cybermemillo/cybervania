export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init() {
        this.gameData = window.game;
    }

    create() {
        // Configuración de fondo con efecto de victoria
        this.add.image(0, 0, 'bg-digital').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setTint(0x005500); // Tinte verde para indicar victoria
        
        // Reproducir música de victoria
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('victory');
        }
        
        // Efecto de partículas para celebración
        this.createVictoryParticles();
        
        // Crear secuencia de victoria
        this.createVictorySequence();
    }

    createVictoryParticles() {
        // Emisor de partículas
        const particles = this.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: this.cameras.main.width / 2,
            y: -50,
            angle: { min: 0, max: 180 },
            speed: { min: 100, max: 200 },
            gravityY: 100,
            lifespan: 4000,
            quantity: 2,
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD',
            tint: [ 0xff0000, 0x00ff00, 0x0000ff, 0xffff00 ]
        });
        
        // Mantener emisión durante un tiempo limitado
        this.time.delayedCall(8000, () => {
            emitter.stop();
        });
    }

    createVictorySequence() {
        // Contenedor principal
        const container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Texto de Victoria con efecto de máquina de escribir
        const victoryText = this.add.text(0, -200, '', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '64px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 10, stroke: true, fill: true }
        }).setOrigin(0.5);
        
        // Subtítulo
        const subtitleText = this.add.text(0, -120, '', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Texto para estadísticas
        const statsText = this.add.text(0, 20, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        container.add([victoryText, subtitleText, statsText]);
        
        // Animación de texto de Victoria
        let fullText = '¡VICTORIA TOTAL!';
        let currentText = '';
        let charIndex = 0;
        
        const typewriterEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                currentText += fullText[charIndex];
                victoryText.setText(currentText);
                charIndex++;
                
                // Reproducir sonido de tecleo
                if (window.dataManager && window.dataManager.audioManager) {
                    window.dataManager.audioManager.playSound('click');
                }
                
                if (charIndex >= fullText.length) {
                    typewriterEvent.remove();
                    
                    // Mostrar subtítulo
                    this.time.delayedCall(500, () => {
                        subtitleText.setText('Has conquistado el Castillo Digital');
                        
                        // Mostrar estadísticas después
                        this.time.delayedCall(1000, () => {
                            this.showGameStats(statsText);
                        });
                    });
                }
            },
            callbackScope: this,
            repeat: fullText.length - 1
        });
        
        // Botones (visible después de la secuencia)
        const buttonContainer = this.add.container(0, 200);
        buttonContainer.alpha = 0;
        
        const mainMenuButton = this.createButton(0, 0, 'MENÚ PRINCIPAL', () => {
            this.scene.start('MainMenuScene');
        });
        
        buttonContainer.add(mainMenuButton);
        container.add(buttonContainer);
        
        // Mostrar botones después de mostrar estadísticas
        this.time.delayedCall(6000, () => {
            this.tweens.add({
                targets: buttonContainer,
                alpha: 1,
                duration: 500
            });
        });
    }
    
    showGameStats(textObject) {
        // Obtener estadísticas finales
        const stats = this.gameData.statistics;
        const score = this.gameData.calculateScore();
        
        const statsString = [
            'INFORME DE MISIÓN COMPLETADA',
            '-------------------------',
            `Pisos completados: ${this.gameData.currentFloor} / 3`,
            `Enemigos derrotados: ${stats.enemiesDefeated}`,
            `Daño infligido: ${stats.damageDealt}`,
            `Élites eliminados: ${stats.elitesKilled}`,
            `Jefes derrotados: ${stats.bossesKilled}`,
            '-------------------------',
            `PUNTUACIÓN FINAL: ${score}`
        ].join('\n');
        
        // Animación de aparición del texto
        let currentStats = '';
        const lines = statsString.split('\n');
        let lineIndex = 0;
        
        const statsEvent = this.time.addEvent({
            delay: 200,
            callback: () => {
                currentStats += lines[lineIndex] + '\n';
                textObject.setText(currentStats);
                lineIndex++;
                
                // Sonido al mostrar cada línea
                if (window.dataManager && window.dataManager.audioManager) {
                    window.dataManager.audioManager.playSound('click');
                }
                
                if (lineIndex >= lines.length) {
                    statsEvent.remove();
                }
            },
            callbackScope: this,
            repeat: lines.length - 1
        });
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
}
