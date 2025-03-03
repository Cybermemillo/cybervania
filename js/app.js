// Verificar que Phaser esté disponible
if (typeof Phaser === 'undefined') {
    console.error('Error: Phaser no está cargado. Verifica que el script de Phaser esté incluido correctamente.');
    alert('Error al cargar el motor del juego. Por favor, recarga la página o verifica tu conexión a internet.');
} else {
    console.log('Phaser cargado correctamente. Versión:', Phaser.VERSION);
}

// Importar escenas y componentes del juego
import { Game } from './game/Game.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { CombatScene } from './scenes/CombatScene.js';
import { EventScene } from './scenes/EventScene.js';
import { MapScene } from './scenes/MapScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { DataManager } from './managers/DataManager.js';

// Configuración de Phaser
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#0f0f1e',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        LoadingScene,
        MainMenuScene,
        MapScene,
        GameScene,
        CombatScene,
        EventScene,
        GameOverScene,
        VictoryScene
    ],
    // Desactiva el audio automático para evitar errores de reproducción
    audio: {
        disableWebAudio: false,
        noAudio: false
    }
};

// Función principal para iniciar el juego
function startGame() {
    // Configurar TailwindCSS
    if (window.tailwind) {
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'cyber-red': '#8b0000',
                        'cyber-purple': '#4b0082',
                        'cyber-green': '#32cd32',
                        'cyber-dark': '#0f0f1e'
                    }
                }
            }
        };
    }
    
    // Simular pantalla de carga con un timeout máximo para evitar bloqueo en 98%
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    let progress = 0;
    
    // Variable para controlar si ya se completó la carga
    let loadingCompleted = false;

    // Timeout de seguridad para evitar quedarse cargando indefinidamente
    const safetyTimeout = setTimeout(() => {
        if (!loadingCompleted) {
            console.warn('Carga forzada por timeout de seguridad');
            loadingBar.style.width = '100%';
            loadingText.textContent = 'Cargando... 100%';
            completeLoading();
        }
    }, 10000); // 10 segundos máximo de tiempo de carga
    
    // Función para completar la carga
    function completeLoading() {
        if (loadingCompleted) return;
        loadingCompleted = true;
        
        clearInterval(loadingInterval);
        clearTimeout(safetyTimeout);
        
        try {
            // Inicializar gestor de datos
            window.dataManager = new DataManager();
            
            // Iniciar juego
            window.game = new Phaser.Game(config);
            
            // Mostrar botón de inicio después de cargar
            document.getElementById('start-button').classList.remove('hidden');
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            loadingText.textContent = 'Error al iniciar el juego. Por favor, recarga la página.';
            document.getElementById('start-button').textContent = 'Reintentar';
            document.getElementById('start-button').classList.remove('hidden');
        }
    }
    
    const loadingInterval = setInterval(() => {
        progress += 1;
        loadingBar.style.width = `${progress}%`;
        loadingText.textContent = `Cargando... ${progress}%`;
        
        if (progress >= 100) {
            completeLoading();
        }
    }, 20);
}

// Gestión de errores global
window.addEventListener('error', (e) => {
    console.error('Error en el juego:', e.error);
    // Guardar información del error para análisis
    if (window.dataManager) {
        window.dataManager.logError(e.error);
    }
});

// Solución al problema de reproducción automática de audio
document.addEventListener('click', function() {
    if (window.Howler && Howler.ctx && Howler.ctx.state !== 'running') {
        Howler.ctx.resume().catch(console.error);
    }
    
    if (window.game && window.game.sound && window.game.sound.context && window.game.sound.context.state !== 'running') {
        window.game.sound.context.resume().catch(console.error);
    }
}, { once: true });

// Iniciar cuando el documento esté listo
if (document.readyState === "complete" || document.readyState === "interactive") {
    // Si ya está cargado
    setTimeout(startGame, 1);
} else {
    // Si aún no está cargado
    document.addEventListener('DOMContentLoaded', startGame);
}
