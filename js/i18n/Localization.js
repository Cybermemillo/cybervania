/**
 * Sistema de localización para Cybervania
 * Gestiona los textos en diferentes idiomas
 */
export class Localization {
    constructor() {
        // Idioma actual del juego
        this.currentLanguage = 'es';
        
        // Textos disponibles por idioma
        this.translations = {
            // Español (idioma por defecto)
            'es': {
                // Menú principal
                'menu.newGame': 'Nueva Partida',
                'menu.loadGame': 'Cargar Partida',
                'menu.options': 'Opciones',
                'menu.exit': 'Salir',
                
                // Títulos de pantallas
                'screen.options': 'Opciones',
                'screen.newGame': 'Nueva Partida',
                'screen.loadGame': 'Cargar Partida',
                
                // Creación de personaje
                'character.name': 'Nombre de Hacker',
                'character.enterName': 'Ingresa tu nombre...',
                'character.identity': 'Selecciona tu identidad',
                'character.male': 'Hombre',
                'character.female': 'Mujer',
                'character.specialization': 'Especialización',
                'character.preview': 'Vista previa',
                'character.motivation': 'Motivación (opcional)',
                'character.motivationPlaceholder': 'Describe brevemente la motivación de tu personaje...',
                
                // Especializaciones
                'spec.redTeam': 'Red Team',
                'spec.redDesc': 'Especializado en ataque y penetración. Daño superior a costa de defensa.',
                'spec.blueTeam': 'Blue Team',
                'spec.blueDesc': 'Especializado en defensa y seguridad. Mayor resistencia y supervivencia.',
                'spec.purpleTeam': 'Purple Team',
                'spec.purpleDesc': 'Equilibrio entre ataque y defensa. Adaptabilidad y versatilidad táctica.',
                
                // Estadísticas
                'stat.health': 'Salud',
                'stat.defense': 'Defensa',
                'stat.attack': 'Ataque',
                'stat.actionPoints': 'Puntos de acción',
                
                // Opciones de juego
                'options.audio': 'Audio',
                'options.musicVolume': 'Volumen de música',
                'options.sfxVolume': 'Volumen de efectos',
                'options.display': 'Pantalla',
                'options.fullscreen': 'Pantalla completa',
                'options.visualQuality': 'Calidad visual',
                'options.targetFPS': 'FPS objetivo',
                'options.game': 'Juego',
                'options.difficulty': 'Dificultad',
                'options.language': 'Idioma',
                'options.accessibility': 'Accesibilidad',
                'options.highContrast': 'Alto contraste',
                'options.screenShake': 'Vibración de pantalla',
                
                // Valores de opciones
                'quality.low': 'Baja',
                'quality.medium': 'Media',
                'quality.high': 'Alta',
                'difficulty.easy': 'Fácil',
                'difficulty.normal': 'Normal',
                'difficulty.hard': 'Difícil',
                'fps.30': '30 FPS',
                'fps.60': '60 FPS',
                'fps.120': '120 FPS',
                'fps.unlimited': 'Sin límite',
                
                // Botones
                'button.saveChanges': 'Guardar Cambios',
                'button.cancel': 'Cancelar',
                'button.reset': 'Restablecer',
                'button.testSound': 'Probar Sonido',
                'button.start': 'Comenzar Partida',
                'button.back': 'Volver',
                
                // Notificaciones
                'notify.optionsSaved': 'Opciones guardadas correctamente',
                'notify.optionsReset': 'Opciones restablecidas',
                'notify.soundTest': 'Reproduciendo efecto de sonido',
                'notify.nameRequired': 'Debes ingresar un nombre',
                'notify.specRequired': 'Selecciona una especialización',
                
                // Partidas guardadas
                'save.empty': 'Slot vacío',
                'save.level': 'Nivel',
                
                // Confirmaciones
                'confirm.resetOptions': '¿Seguro que quieres restablecer todas las opciones a valores predeterminados?',
                'confirm.exit': '¿Seguro que quieres salir?'
            },
            
            // English
            'en': {
                // Main menu
                'menu.newGame': 'New Game',
                'menu.loadGame': 'Load Game',
                'menu.options': 'Options',
                'menu.exit': 'Exit',
                
                // Screen titles
                'screen.options': 'Options',
                'screen.newGame': 'New Game',
                'screen.loadGame': 'Load Game',
                
                // Character creation
                'character.name': 'Hacker Name',
                'character.enterName': 'Enter your name...',
                'character.identity': 'Select your identity',
                'character.male': 'Male',
                'character.female': 'Female',
                'character.specialization': 'Specialization',
                'character.preview': 'Preview',
                'character.motivation': 'Motivation (optional)',
                'character.motivationPlaceholder': 'Briefly describe your character\'s motivation...',
                
                // Specializations
                'spec.redTeam': 'Red Team',
                'spec.redDesc': 'Specialized in attack and penetration. Superior damage at the cost of defense.',
                'spec.blueTeam': 'Blue Team',
                'spec.blueDesc': 'Specialized in defense and security. Greater resistance and survival.',
                'spec.purpleTeam': 'Purple Team',
                'spec.purpleDesc': 'Balance between attack and defense. Tactical adaptability and versatility.',
                
                // Stats
                'stat.health': 'Health',
                'stat.defense': 'Defense',
                'stat.attack': 'Attack',
                'stat.actionPoints': 'Action Points',
                
                // Game options
                'options.audio': 'Audio',
                'options.musicVolume': 'Music Volume',
                'options.sfxVolume': 'Effects Volume',
                'options.display': 'Display',
                'options.fullscreen': 'Fullscreen',
                'options.visualQuality': 'Visual Quality',
                'options.targetFPS': 'Target FPS',
                'options.game': 'Game',
                'options.difficulty': 'Difficulty',
                'options.language': 'Language',
                'options.accessibility': 'Accessibility',
                'options.highContrast': 'High Contrast',
                'options.screenShake': 'Screen Shake',
                
                // Option values
                'quality.low': 'Low',
                'quality.medium': 'Medium',
                'quality.high': 'High',
                'difficulty.easy': 'Easy',
                'difficulty.normal': 'Normal',
                'difficulty.hard': 'Hard',
                'fps.30': '30 FPS',
                'fps.60': '60 FPS',
                'fps.120': '120 FPS',
                'fps.unlimited': 'Unlimited',
                
                // Buttons
                'button.saveChanges': 'Save Changes',
                'button.cancel': 'Cancel',
                'button.reset': 'Reset',
                'button.testSound': 'Test Sound',
                'button.start': 'Start Game',
                'button.back': 'Back',
                
                // Notifications
                'notify.optionsSaved': 'Options saved successfully',
                'notify.optionsReset': 'Options reset to default values',
                'notify.soundTest': 'Playing sound effect',
                'notify.nameRequired': 'You must enter a name',
                'notify.specRequired': 'Select a specialization',
                
                // Save games
                'save.empty': 'Empty Slot',
                'save.level': 'Level',
                
                // Confirmations
                'confirm.resetOptions': 'Are you sure you want to reset all options to default values?',
                'confirm.exit': 'Are you sure you want to exit?'
            },
            
            // Français
            'fr': {
                // Menu principal
                'menu.newGame': 'Nouvelle Partie',
                'menu.loadGame': 'Charger Partie',
                'menu.options': 'Options',
                'menu.exit': 'Quitter',
                
                // Titres des écrans
                'screen.options': 'Options',
                'screen.newGame': 'Nouvelle Partie',
                'screen.loadGame': 'Charger Partie',
                
                // Création de personnage
                'character.name': 'Nom du Hacker',
                'character.enterName': 'Entrez votre nom...',
                'character.identity': 'Sélectionnez votre identité',
                'character.male': 'Homme',
                'character.female': 'Femme',
                'character.specialization': 'Spécialisation',
                'character.preview': 'Aperçu',
                'character.motivation': 'Motivation (optionnel)',
                'character.motivationPlaceholder': 'Décrivez brièvement la motivation de votre personnage...',
                
                // Spécialisations
                'spec.redTeam': 'Équipe Rouge',
                'spec.redDesc': 'Spécialisé dans l\'attaque et la pénétration. Dégâts supérieurs au détriment de la défense.',
                'spec.blueTeam': 'Équipe Bleue',
                'spec.blueDesc': 'Spécialisé dans la défense et la sécurité. Plus grande résistance et survie.',
                'spec.purpleTeam': 'Équipe Violette',
                'spec.purpleDesc': 'Équilibre entre attaque et défense. Adaptabilité et versatilité tactique.',
                
                // Statistiques
                'stat.health': 'Santé',
                'stat.defense': 'Défense',
                'stat.attack': 'Attaque',
                'stat.actionPoints': 'Points d\'action',
                
                // Options de jeu
                'options.audio': 'Audio',
                'options.musicVolume': 'Volume de musique',
                'options.sfxVolume': 'Volume d\'effets',
                'options.display': 'Affichage',
                'options.fullscreen': 'Plein écran',
                'options.visualQuality': 'Qualité visuelle',
                'options.targetFPS': 'FPS cible',
                'options.game': 'Jeu',
                'options.difficulty': 'Difficulté',
                'options.language': 'Langue',
                'options.accessibility': 'Accessibilité',
                'options.highContrast': 'Contraste élevé',
                'options.screenShake': 'Tremblement d\'écran',
                
                // Valeurs des options
                'quality.low': 'Basse',
                'quality.medium': 'Moyenne',
                'quality.high': 'Haute',
                'difficulty.easy': 'Facile',
                'difficulty.normal': 'Normal',
                'difficulty.hard': 'Difficile',
                'fps.30': '30 FPS',
                'fps.60': '60 FPS',
                'fps.120': '120 FPS',
                'fps.unlimited': 'Illimité',
                
                // Boutons
                'button.saveChanges': 'Enregistrer',
                'button.cancel': 'Annuler',
                'button.reset': 'Réinitialiser',
                'button.testSound': 'Tester Son',
                'button.start': 'Commencer',
                'button.back': 'Retour',
                
                // Notifications
                'notify.optionsSaved': 'Options enregistrées avec succès',
                'notify.optionsReset': 'Options réinitialisées',
                'notify.soundTest': 'Lecture de l\'effet sonore',
                'notify.nameRequired': 'Vous devez entrer un nom',
                'notify.specRequired': 'Sélectionnez une spécialisation',
                
                // Parties sauvegardées
                'save.empty': 'Emplacement vide',
                'save.level': 'Niveau',
                
                // Confirmations
                'confirm.resetOptions': 'Êtes-vous sûr de vouloir réinitialiser toutes les options aux valeurs par défaut?',
                'confirm.exit': 'Êtes-vous sûr de vouloir quitter?'
            }
        };
    }
    
    /**
     * Cambia el idioma actual
     * @param {string} lang - Código de idioma ('es', 'en', 'fr')
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            document.documentElement.setAttribute('lang', lang);
            
            // Actualizar la clase del idioma en el body
            document.body.className = document.body.className
                .replace(/lang-[a-z]{2}/g, '')
                .trim();
            document.body.classList.add(`lang-${lang}`);
            
            // Disparar evento de cambio de idioma
            const event = new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            });
            document.dispatchEvent(event);
            
            return true;
        }
        return false;
    }
    
    /**
     * Obtiene un texto traducido
     * @param {string} key - Clave de traducción 
     * @param {Object} params - Parámetros para reemplazar en el texto
     * @returns {string} Texto traducido
     */
    getText(key, params = {}) {
        // Obtener traducción del idioma actual
        let text = this.translations[this.currentLanguage][key];
        
        // Si no existe, intentar con el idioma por defecto
        if (!text && this.currentLanguage !== 'es') {
            text = this.translations['es'][key];
        }
        
        // Si sigue sin existir, devolver la clave
        if (!text) {
            console.warn(`No se encontró traducción para: ${key}`);
            return key;
        }
        
        // Reemplazar parámetros si hay
        if (params) {
            Object.keys(params).forEach(param => {
                text = text.replace(`{${param}}`, params[param]);
            });
        }
        
        return text;
    }
    
    /**
     * Traduce todos los elementos del DOM con atributo data-i18n
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.getText(key);
        });
    }
}

// Instancia singleton para toda la aplicación
let localizationInstance = null;

export function getLocalization() {
    if (!localizationInstance) {
        localizationInstance = new Localization();
    }
    return localizationInstance;
}
