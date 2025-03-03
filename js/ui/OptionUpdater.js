import { getGameConfiguration } from '../config/GameConfiguration.js';
import { getAudioManager } from '../audio/AudioManager.js';

/**
 * Clase para gestionar la actualización de opciones en tiempo real
 */
export class OptionUpdater {
    constructor() {
        this.config = getGameConfiguration();
        this.audioManager = getAudioManager();
        this.effectsManager = null;
        
        // Referencias a elementos UI
        this.elements = {
            audioControls: {},
            displayControls: {},
            accessibilityControls: {},
            gameplayControls: {}
        };
        
        // Cambios pendientes
        this.pendingChanges = {};
    }
    
    /**
     * Inicializa controladores para opciones de audio
     */
    setupAudioControls(elements) {
        this.elements.audioControls = elements;
        
        // Volumen maestro
        if (elements.masterVolume) {
            elements.masterVolume.value = this.config.get('audio.masterVolume');
            elements.masterVolume.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.audioManager.setMasterVolume(value);
                this.pendingChanges['audio.masterVolume'] = value;
            });
        }
        
        // Volumen de música
        if (elements.musicVolume) {
            elements.musicVolume.value = this.config.get('audio.musicVolume');
            elements.musicVolume.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.audioManager.setMusicVolume(value);
                this.pendingChanges['audio.musicVolume'] = value;
            });
        }
        
        // Volumen de efectos
        if (elements.sfxVolume) {
            elements.sfxVolume.value = this.config.get('audio.sfxVolume');
            elements.sfxVolume.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.audioManager.setSFXVolume(value);
                this.pendingChanges['audio.sfxVolume'] = value;
                
                // Reproducir efecto para demostración
                this.audioManager.playSound('menu_hover');
            });
        }
    }
    
    /**
     * Inicializa controladores para opciones de visuales
     */
    setupDisplayControls(elements, effectsManager) {
        this.elements.displayControls = elements;
        this.effectsManager = effectsManager;
        
        // Calidad visual
        if (elements.visualQuality) {
            elements.visualQuality.value = this.config.get('display.visualQuality');
            elements.visualQuality.addEventListener('change', (e) => {
                const value = e.target.value;
                this.pendingChanges['display.visualQuality'] = value;
                
                if (this.effectsManager) {
                    this.effectsManager.updateMistEffects(value);
                    const effectIntensity = 
                        value === 'low' ? 0.3 : 
                        value === 'medium' ? 