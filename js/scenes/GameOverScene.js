export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init() {
        this.gameData = window.game;
    }

    create() {
        // Configuración de fondo
        this.add.image(0, 0, 'bg-digital').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setTint(0x550000); // Tinte rojo para indicar game over
        
        // Reproducir música triste
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('game-over');
        }
        
        // Animaciones de inicio
        this.createGameOverSequence();
    }

    createGameOverSequence() {
        // Contenedor principal
        const container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Texto de Game Over con efecto de máquina de escribir
        const gameOverText = this.add.text(0, -150, '', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 10, stroke: true, fill: true }
        }).setOrigin(0.5);
        
        // Texto para estadísticas
        const statsText = this.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        container.add([gameOverText, statsText]);
        
        // Animación de texto de Game Over
        let fullText = 'CONNECTION TERMINATED';
        let currentText = '';
        let charIndex = 0;
        
        const typewriterEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                currentText += fullText[charIndex];
                gameOverText.setText(currentText);
                charIndex++;
                
                // Reproducir sonido de tecleo
                if (window.dataManager && window.dataManager.audioManager) {
                    window.dataManager.audioManager.playSound('click');
                }
                
                if (charIndex >= fullText.length) {
                    typewriterEvent.remove();
                    this.showGameStats(statsText);
                }
            },
            callbackScope: this,
            repeat: fullText.length - 1
        });
        
        // Botones (visible después de la secuencia)
        const buttonContainer = this.add.container(0, 150);
        buttonContainer.alpha = 0;
        
        const mainMenuButton = this.createButton(0, 0, 'MENÚ PRINCIPAL', () => {
            this.scene.start('MainMenuScene');
        });
        
        buttonContainer.add(mainMenuButton);
        container.add(buttonContainer);
        
        // Mostrar botones después de mostrar estadísticas
        this.time.delayedCall(4000, () => {
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
            'INFORME DE MISIÓN',
            '----------------',
            `Pisos completados: ${this.gameData.currentFloor - 1}`,
            `Enemigos derrotados: ${stats.enemiesDefeated}`,
            `Daño infligido: ${stats.damageDealt}`,
            `Daño recibido: ${stats.damageReceived}`,
            `Élites eliminados: ${stats.elitesKilled}`,
            `Jefes derrotados: ${stats.bossesKilled}`,
            '----------------',
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
