export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.gameData = window.game;
        this.player = this.gameData.player;
        this.nextScene = data.nextScene || 'MapScene';
    }

    preload() {
        // Asegurarse de que todos los recursos necesarios están cargados
    }

    create() {
        // Fondo
        this.add.image(0, 0, 'bg-digital').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Configurar interfaz básica
        this.createUI();
        
        // Verificar si el jugador ha ganado o perdido
        this.checkGameStatus();
        
        // Después de un breve retraso, ir a la siguiente escena
        this.time.delayedCall(2000, () => {
            this.scene.start(this.nextScene);
        });
    }

    createUI() {
        // Panel central para información
        const panel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 600, 300, 0x000000, 0.8)
            .setStrokeStyle(2, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -100, 'CYBERVANIA', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '48px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Información de jugador
        const playerText = this.add.text(0, 0, `Hacker: ${this.player.name}\nEspecialización: ${this.getSpecializationName(this.player.specialization)}\nSalud: ${this.player.health}/${this.player.maxHealth}\nCréditos: ${this.player.credits}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        panel.add([panelBg, titleText, playerText]);
        
        // Añadir a la escena
        this.add.existing(panel);
    }
    
    getSpecializationName(spec) {
        switch(spec) {
            case 'red': return 'Ofensivo (Rojo)';
            case 'blue': return 'Defensivo (Azul)';
            case 'purple': return 'Equilibrado (Púrpura)';
            default: return 'Sin especialización';
        }
    }

    checkGameStatus() {
        if (this.player.health <= 0) {
            this.gameData.saveGame(); // Guardar estado final para estadísticas
            this.nextScene = 'GameOverScene';
        }
    }
}
