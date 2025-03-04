import { MainMenu } from './ui/MainMenu.js';
import { GothicEffects } from './ui/GothicEffects.js';
import { MenuEffects } from './ui/MenuEffects.js';
import { RetroEffects } from './ui/RetroEffects.js';
import { getAudioManager } from './audio/AudioManager.js';
import { Player } from './entities/Player.js';
import { getLocalization } from './i18n/Localization.js';

// Inicializar sistemas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Cybervania - Inicializando menú principal con estilo retro...');
    
    // Cargar opciones guardadas para determinar el idioma inicial
    let savedLanguage = 'es'; // Idioma por defecto
    try {
        const savedOptions = localStorage.getItem('cybervania_options');
        if (savedOptions) {
            const options = JSON.parse(savedOptions);
            if (options.language) {
                savedLanguage = options.language;
            }
        }
    } catch (e) {
        console.error('Error al cargar opciones de idioma:', e);
    }
    
    // Inicializar el sistema de localización con el idioma guardado
    const localization = getLocalization();
    localization.setLanguage(savedLanguage);
    
    // Inicializar el menú principal
    const mainMenu = new MainMenu('menu-container');
    
    // Inicializar audio y precargar sonidos comunes
    const audioManager = getAudioManager();
    audioManager.preloadCommonSounds();
    
    // Para activar el audio en navegadores modernos que requieren interacción del usuario
    document.body.addEventListener('click', () => {
        if (audioManager.isReady()) {
            audioManager.resume();
            // Ocultar indicador de audio si está visible
            const audioIndicator = document.getElementById('audio-indicator');
            if (audioIndicator) {
                audioIndicator.style.opacity = '0';
                setTimeout(() => audioIndicator.remove(), 500);
            }
        }
    }, { once: true });
    
    // Mostrar indicador de audio durante 3 segundos
    const audioIndicator = document.getElementById('audio-indicator');
    if (audioIndicator) {
        audioIndicator.style.opacity = '1';
        setTimeout(() => {
            audioIndicator.style.opacity = '0';
            setTimeout(() => audioIndicator.remove(), 500);
        }, 3000);
    }
    
    // Inicializar efectos visuales
    const menuEffects = new MenuEffects('menu-container');
    const gothicEffects = new GothicEffects('menu-container');
    const retroEffects = new RetroEffects('menu-container');
    
    // Añadir viñeta oscura
    gothicEffects.addDarkVignette();
    
    // Crear un efecto aleatorio cada 30 segundos
    setInterval(() => {
        if (Math.random() > 0.3) { // 30% de probabilidad
            const effects = [
                () => gothicEffects.triggerLightning(),
                () => gothicEffects.flickerLights(),
                () => gothicEffects.pulseBackground(),
                () => menuEffects.simulateSignalInterference()
            ];
            
            // Seleccionar efecto aleatorio
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            randomEffect();
        }
    }, 30000);
    
    // Agregar gestor global para la configuración
    window.cybervaniaSettings = {
        mainMenu,
        menuEffects,
        gothicEffects,
        retroEffects,
        audioManager,
        localization,
        
        // Aplicar configuración
        applySettings(options) {
            // Audio
            if (options.musicVolume !== undefined) {
                audioManager.setMusicVolume(options.musicVolume);
            }
            if (options.sfxVolume !== undefined) {
                audioManager.setSFXVolume(options.sfxVolume);
            }
            
            // Efectos visuales
            if (options.visualQuality !== undefined) {
                menuEffects.updateMistEffects(options.visualQuality);
                const effectIntensity = options.visualQuality === 'low' ? 0.3 : 
                                        options.visualQuality === 'medium' ? 0.6 : 1.0;
                menuEffects.updateEffectsIntensity(effectIntensity);
            }
            
            // FPS objetivo
            if (options.targetFPS !== undefined) {
                menuEffects.setTargetFPS(options.targetFPS);
            }
            
            // Alto contraste
            if (options.highContrast !== undefined) {
                menuEffects.toggleHighContrast(options.highContrast);
            }
            
            // Idioma
            if (options.language !== undefined) {
                localization.setLanguage(options.language);
            }
            
            console.log('Configuración aplicada:', options);
        }
    };
    
    // Aplicar opciones iniciales
    window.cybervaniaSettings.applySettings(mainMenu.gameOptions);
    
    // Añadir listener para tecla Escape para volver al menú principal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainMenu.currentScreen !== 'main') {
            mainMenu.showScreen('main');
        }
    });
});
