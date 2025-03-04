/**
 * Sistema de localización para Cybervania
 */
import { es } from './es.js';

class Localization {
    constructor() {
        // Idiomas disponibles
        this.languages = {
            es: es
        };
        
        // Idioma actual (default español)
        this.currentLanguage = 'es';
        
        // Callbacks para actualizar la UI cuando cambia el idioma
        this.onLanguageChangeCallbacks = [];
    }
    
    /**
     * Obtiene un texto localizado
     */
    get(key, fallback = '') {
        // Clave puede ser en formato 'category.subcategory.item'
        const keys = key.split('.');
        let text = this.languages[this.currentLanguage];
        
        for (const k of keys) {
            if (text && text[k] !== undefined) {
                text = text[k];
            } else {
                console.warn(`Text key not found: ${key}`);
                return fallback || key; // Devuelve la clave o fallback como respaldo
            }
        }
        
        return text;
    }
    
    /**
     * Establece el idioma actual
     */
    setLanguage(languageCode) {
        if (this.languages[languageCode]) {
            this.currentLanguage = languageCode;
            console.log(`Idioma cambiado a: ${languageCode}`);
            
            // Notificar a los observadores
            this.notifyLanguageChange();
            
            // Guardar preferencia en localStorage
            try {
                let options = {};
                const savedOptions = localStorage.getItem('cybervania_options');
                if (savedOptions) {
                    options = JSON.parse(savedOptions);
                }
                
                options.language = languageCode;
                localStorage.setItem('cybervania_options', JSON.stringify(options));
            } catch (e) {
                console.error('Error guardando preferencia de idioma:', e);
            }
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Registra un callback para cuando cambie el idioma
     */
    onLanguageChange(callback) {
        if (typeof callback === 'function') {
            this.onLanguageChangeCallbacks.push(callback);
        }
    }
    
    /**
     * Notifica a todos los observers del cambio de idioma
     */
    notifyLanguageChange() {
        this.onLanguageChangeCallbacks.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (e) {
                console.error('Error en callback de cambio de idioma:', e);
            }
        });
    }
    
    /**
     * Función para formatear textos con variables
     * Ejemplo: format("Hola {0}, tienes {1} mensajes", ["Juan", 5])
     */
    format(text, replacements) {
        if (!replacements || !Array.isArray(replacements)) {
            return text;
        }
        
        return text.replace(/{(\d+)}/g, (match, index) => {
            return typeof replacements[index] !== 'undefined' ? replacements[index] : match;
        });
    }
    
    /**
     * Carga un nuevo paquete de idioma dinámicamente
     */
    async loadLanguage(languageCode) {
        if (this.languages[languageCode]) {
            return true; // Ya está cargado
        }
        
        try {
            const response = await fetch(`js/i18n/${languageCode}.js`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const langModule = await import(`./${languageCode}.js`);
            this.languages[languageCode] = langModule[languageCode];
            
            return true;
        } catch (e) {
            console.error(`Error cargando idioma ${languageCode}:`, e);
            return false;
        }
    }
}

// Singleton para manejar la localización en toda la aplicación
let localizationInstance = null;

export function getLocalization() {
    if (!localizationInstance) {
        localizationInstance = new Localization();
    }
    
    return localizationInstance;
}
