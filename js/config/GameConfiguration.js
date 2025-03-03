/**
 * Gestor de configuración del juego
 */
export class GameConfiguration {
    constructor() {
        // Configuración por defecto
        this.defaults = {
            audio: {
                masterVolume: 1.0,
                musicVolume: 0.7,
                sfxVolume: 0.8,
                voiceVolume: 0.8,
                ambientVolume: 0.6
            },
            display: {
                fullscreen: false,
                visualQuality: 'high',  // high, medium, low
                resolution: 'native',
                vSync: true,
                targetFPS: 60,         // 30, 60, 120, unlimited
                screenShake: true,
                cameraSmoothing: true
            },
            accessibility: {
                highContrast: false,
                textSize: 'medium',    // small, medium, large
                colorblindMode: 'off', // off, protanopia, deuteranopia, tritanopia
                subtitles: true,
                reducedMotion: false,
                dyslexicFont: false
            },
            gameplay: {
                difficulty: 'normal',  // easy, normal, hard
                autoSave: true,
                tutorialHints: true,
                combatSpeed: 'normal', // slow, normal, fast
                aimAssist: false
            },
            controls: {
                keyBindings: {
                    moveUp: 'w',
                    moveLeft: 'a',
                    moveDown: 's',
                    moveRight: 'd',
                    interact: 'e',
                    attack: ' ',
                    special: 'q',
                    inventory: 'i',
                    menu: 'esc'
                },
                mouseInvert: false,
                mouseSensitivity: 5   // 1-10
            },
            language: 'es'            // es, en, fr, ...
        };
        
        // Cargar configuración guardada
        this.settings = this.load();
    }
    
    /**
     * Carga la configuración desde localStorage
     */
    load() {
        try {
            const savedConfig = localStorage.getItem('cybervania_config');
            if (savedConfig) {
                // Fusionar con valores por defecto
                return this.mergeDeep(
                    this.defaults, 
                    JSON.parse(savedConfig)
                );
            }
        } catch (e) {
            console.error('Error cargando configuración:', e);
        }
        
        // Si falla o no hay configuración, usar valores por defecto
        return {...this.defaults};
    }
    
    /**
     * Guarda la configuración en localStorage
     */
    save() {
        try {
            localStorage.setItem('cybervania_config', JSON.stringify(this.settings));
            return true;
        } catch (e) {
            console.error('Error guardando configuración:', e);
            return false;
        }
    }
    
    /**
     * Restablece toda la configuración a valores por defecto
     */
    resetToDefaults() {
        this.settings = {...this.defaults};
        return this.save();
    }
    
    /**
     * Obtiene un valor de configuración
     */
    get(path) {
        // Dividir la ruta por puntos (ej: 'audio.musicVolume')
        const keys = path.split('.');
        let result = this.settings;
        
        // Navegar por el objeto
        for (const key of keys) {
            if (result[key] === undefined) return undefined;
            result = result[key];
        }
        
        return result;
    }
    
    /**
     * Establece un valor de configuración
     */
    set(path, value) {
        // Dividir la ruta por puntos
        const keys = path.split('.');
        let obj = this.settings;
        
        // Navegar hasta el penúltimo nivel
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!obj[key]) obj[key] = {};
            obj = obj[key];
        }
        
        // Establecer el valor
        obj[keys[keys.length - 1]] = value;
        
        // Guardar cambios
        return this.save();
    }
    
    /**
     * Aplica un objeto de configuraciones
     */
    applyBulk(configObj) {
        // Fusionar con la configuración actual
        this.settings = this.mergeDeep(this.settings, configObj);
        return this.save();
    }
    
    /**
     * Fusiona dos objetos profundamente
     */
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    
    /**
     * Verifica si un valor es un objeto
     */
    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    
    /**
     * Exporta la configuración actual
     */
    exportConfig() {
        return JSON.stringify(this.settings);
    }
    
    /**
     * Importa una configuración
     */
    importConfig(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            this.settings = this.mergeDeep(this.defaults, config);
            return this.save();
        } catch (e) {
            console.error('Error importando configuración:', e);
            return false;
        }
    }
    
    /**
     * Aplica la configuración a los sistemas del juego
     */
    applyToSystems() {
        if (window.cybervaniaSettings) {
            // Aplicar opciones de audio
            if (window.cybervaniaSettings.audioManager) {
                const audio = this.settings.audio;
                window.cybervaniaSettings.audioManager.setMasterVolume(audio.masterVolume);
                window.cybervaniaSettings.audioManager.setMusicVolume(audio.musicVolume);
                window.cybervaniaSettings.audioManager.setSFXVolume(audio.sfxVolume);
            }
            
            // Aplicar opciones visuales
            if (window.cybervaniaSettings.menuEffects) {
                const display = this.settings.display;
                window.cybervaniaSettings.menuEffects.updateMistEffects(display.visualQuality);
                window.cybervaniaSettings.menuEffects.updateEffectsIntensity(
                    display.visualQuality === 'low' ? 0.3 : 
                    display.visualQuality === 'medium' ? 0.6 : 1.0
                );
                window.cybervaniaSettings.menuEffects.setTargetFPS(display.targetFPS);
            }
            
            // Aplicar opciones de accesibilidad
            const accessibility = this.settings.accessibility;
            if (accessibility.highContrast && window.cybervaniaSettings.menuEffects) {
                window.cybervaniaSettings.menuEffects.toggleHighContrast(accessibility.highContrast);
            }
            
            // Aplicar idioma
            document.documentElement.setAttribute('lang', this.settings.language);
        }
    }
}

// Instancia singleton para toda la aplicación
let configInstance = null;

export function getGameConfiguration() {
    if (!configInstance) {
        configInstance = new GameConfiguration();
    }
    return configInstance;
}
