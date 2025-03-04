/**
 * Generador de fondos procedurales con estética retro
 * Crea fondos pixelados al estilo de juegos SNES sin depender de imágenes externas
 */
export class BackgroundGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pixelSize = 4;
        this.colors = {
            castleBg: ['#090a10', '#1a0b22', '#320f55', '#29366f'],
            castleWalls: ['#333c57', '#566c86', '#43156c', '#2d3273'],
            castleDetails: ['#800e0e', '#a5161d', '#b13e53', '#5d2e46']
        };
    }
    
    /**
     * Genera un fondo pixelado de castillo/mazmorra
     * @returns {string} URL de la imagen generada
     */
    generateCastleBackground() {
        const width = 512;
        const height = 512;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Fondo
        this.ctx.fillStyle = this.colors.castleBg[0];
        this.ctx.fillRect(0, 0, width, height);
        
        // Crear patrón de ladrillos
        this.drawBricks();
        
        // Agregar columnas
        this.drawColumns();
        
        // Agregar decoraciones góticas
        this.drawGothicDetails();
        
        // Agregar efectos de iluminación
        this.addLighting();
        
        // Agregar niebla digital
        this.addDigitalMist();
        
        // Devolver la URL de la imagen generada
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Genera un patrón para ser usado como borde
     * @returns {string} URL del patrón de borde
     */
    generatePixelBorder() {
        const borderSize = 32;
        
        this.canvas.width = borderSize;
        this.canvas.height = borderSize;
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, borderSize, borderSize);
        
        // Color de fondo
        this.ctx.fillStyle = this.colors.castleDetails[0];
        this.ctx.fillRect(0, 0, borderSize, borderSize);
        
        // Dibujar el borde pixelado
        this.ctx.fillStyle = this.colors.castleDetails[1];
        
        // Borde exterior
        this.ctx.fillRect(0, 0, borderSize, this.pixelSize);
        this.ctx.fillRect(0, borderSize - this.pixelSize, borderSize, this.pixelSize);
        this.ctx.fillRect(0, 0, this.pixelSize, borderSize);
        this.ctx.fillRect(borderSize - this.pixelSize, 0, this.pixelSize, borderSize);
        
        // Detalles de esquina
        this.ctx.fillStyle = this.colors.castleDetails[2];
        this.ctx.fillRect(0, 0, this.pixelSize * 2, this.pixelSize * 2);
        this.ctx.fillRect(borderSize - this.pixelSize * 2, 0, this.pixelSize * 2, this.pixelSize * 2);
        this.ctx.fillRect(0, borderSize - this.pixelSize * 2, this.pixelSize * 2, this.pixelSize * 2);
        this.ctx.fillRect(borderSize - this.pixelSize * 2, borderSize - this.pixelSize * 2, this.pixelSize * 2, this.pixelSize * 2);
        
        // Detalle adicional para estilo gótico
        this.ctx.fillStyle = this.colors.castleBg[2];
        this.ctx.fillRect(this.pixelSize * 4, this.pixelSize, this.pixelSize, this.pixelSize);
        this.ctx.fillRect(borderSize - this.pixelSize * 5, this.pixelSize, this.pixelSize, this.pixelSize);
        this.ctx.fillRect(this.pixelSize * 4, borderSize - this.pixelSize * 2, this.pixelSize, this.pixelSize);
        this.ctx.fillRect(borderSize - this.pixelSize * 5, borderSize - this.pixelSize * 2, this.pixelSize, this.pixelSize);
        
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Dibuja un patrón de ladrillos en el fondo
     */
    drawBricks() {
        const brickWidth = this.pixelSize * 10;
        const brickHeight = this.pixelSize * 4;
        const offset = this.pixelSize * 5;
        
        // Calculamos cuántas filas y columnas necesitamos
        const rows = Math.ceil(this.canvas.height / brickHeight);
        const cols = Math.ceil(this.canvas.width / brickWidth) + 1; // +1 para manejar el offset
        
        // Color principal de los ladrillos
        const mainColor = this.colors.castleWalls[1];
        const darkColor = this.colors.castleWalls[0];
        const detailColor = this.colors.castleWalls[2];
        
        // Dibujar las filas de ladrillos
        for (let row = 0; row < rows; row++) {
            const rowOffset = row % 2 === 0 ? 0 : offset;
            
            for (let col = -1; col < cols; col++) {
                // Posición del ladrillo
                const x = col * brickWidth + rowOffset;
                const y = row * brickHeight;
                
                // Color con variaciones aleatorias
                const colorVariation = Math.random() > 0.8 ? detailColor : mainColor;
                this.ctx.fillStyle = colorVariation;
                
                // Dibujar el ladrillo principal
                this.ctx.fillRect(x, y, brickWidth - this.pixelSize, brickHeight - this.pixelSize);
                
                // Agregar sombra
                this.ctx.fillStyle = darkColor;
                this.ctx.fillRect(x, y + brickHeight - this.pixelSize, brickWidth - this.pixelSize, this.pixelSize);
                this.ctx.fillRect(x + brickWidth - this.pixelSize, y, this.pixelSize, brickHeight);
            }
        }
    }
    
    /**
     * Dibuja columnas decorativas en los lados
     */
    drawColumns() {
        const columnWidth = this.pixelSize * 8;
        const columnCount = 3;
        const columnSpacing = this.canvas.height / (columnCount + 1);
        
        // Colores para la columna
        const baseColor = this.colors.castleDetails[0];
        const highlightColor = this.colors.castleDetails[3];
        const capColor = this.colors.castleDetails[1];
        
        // Dibujar columnas en ambos lados
        for (let side = 0; side < 2; side++) {
            const x = side === 0 ? this.pixelSize * 4 : this.canvas.width - columnWidth - this.pixelSize * 4;
            
            for (let col = 0; col < columnCount; col++) {
                const y = (col + 1) * columnSpacing;
                
                // Base de la columna
                this.ctx.fillStyle = baseColor;
                this.ctx.fillRect(x, y - columnWidth, columnWidth, columnWidth * 2);
                
                // Detalle superior e inferior
                this.ctx.fillStyle = capColor;
                this.ctx.fillRect(x - this.pixelSize, y - columnWidth - this.pixelSize * 2, columnWidth + this.pixelSize * 2, this.pixelSize * 2);
                this.ctx.fillRect(x - this.pixelSize, y + columnWidth, columnWidth + this.pixelSize * 2, this.pixelSize * 2);
                
                // Detalles decorativos
                this.ctx.fillStyle = highlightColor;
                this.ctx.fillRect(x + this.pixelSize * 2, y - columnWidth + this.pixelSize, columnWidth - this.pixelSize * 4, this.pixelSize);
                this.ctx.fillRect(x + this.pixelSize * 2, y + columnWidth - this.pixelSize * 2, columnWidth - this.pixelSize * 4, this.pixelSize);
            }
        }
    }
    
    /**
     * Agrega detalles góticos al fondo
     */
    drawGothicDetails() {
        // Agregar ventanas góticas
        this.drawGothicWindows();
        
        // Agregar símbolos arcanos
        this.drawArcaneSymbols();
        
        // Agregar elementos cyberpunk
        this.drawCyberpunkElements();
    }
    
    /**
     * Dibuja ventanas góticas en el fondo
     */
    drawGothicWindows() {
        const windowWidth = this.pixelSize * 12;
        const windowHeight = this.pixelSize * 20;
        const windowCount = 2;
        
        // Colores para las ventanas
        const frameColor = this.colors.castleDetails[3];
        const glassColor = '#1a0b22';
        const detailColor = this.colors.castleDetails[2];
        
        // Posiciones X para las ventanas
        const windowPositions = [
            this.canvas.width / 3 - windowWidth / 2,
            this.canvas.width * 2/3 - windowWidth / 2
        ];
        
        // Dibujar cada ventana
        for (let i = 0; i < windowCount; i++) {
            const x = windowPositions[i];
            const y = this.canvas.height / 4;
            
            // Marco exterior
            this.ctx.fillStyle = frameColor;
            this.ctx.fillRect(x, y, windowWidth, windowHeight);
            
            // Vidrio interior
            this.ctx.fillStyle = glassColor;
            this.ctx.fillRect(x + this.pixelSize * 2, y + this.pixelSize * 2, windowWidth - this.pixelSize * 4, windowHeight - this.pixelSize * 4);
            
            // División gótica en forma de arco
            this.ctx.fillStyle = frameColor;
            
            // Divisiones verticales
            this.ctx.fillRect(x + windowWidth/2 - this.pixelSize/2, y + this.pixelSize * 2, this.pixelSize, windowHeight - this.pixelSize * 6);
            
            // División horizontal
            this.ctx.fillRect(x + this.pixelSize * 2, y + windowHeight/2 - this.pixelSize/2, windowWidth - this.pixelSize * 4, this.pixelSize);
            
            // Arco superior
            const arcWidth = windowWidth - this.pixelSize * 4;
            const arcHeight = this.pixelSize * 6;
            const arcX = x + this.pixelSize * 2;
            const arcY = y + this.pixelSize * 2;
            
            // Detalle del arco (simplificado para pixel art)
            this.ctx.fillStyle = detailColor;
            this.ctx.fillRect(arcX + arcWidth/4, arcY + arcHeight/2, arcWidth/2, this.pixelSize);
            this.ctx.fillRect(arcX + arcWidth/3, arcY + arcHeight/3, arcWidth/3, this.pixelSize);
            
            // Añadir brillo digital (estilo cyberpunk)
            this.ctx.fillStyle = 'rgba(255, 0, 91, 0.3)';
            this.ctx.fillRect(x + this.pixelSize * 3, y + this.pixelSize * 3, this.pixelSize, windowHeight - this.pixelSize * 6);
            this.ctx.fillRect(x + windowWidth - this.pixelSize * 4, y + this.pixelSize * 3, this.pixelSize, windowHeight - this.pixelSize * 6);
        }
    }
    
    /**
     * Dibuja símbolos arcanos en el fondo
     */
    drawArcaneSymbols() {
        // Colores para los símbolos
        const symbolColor = '#ff005b'; // Cyber-pink
        
        // Dibujar diferentes símbolos en ubicaciones aleatorias
        for (let i = 0; i < 5; i++) {
            const x = this.pixelSize * (10 + Math.floor(Math.random() * (this.canvas.width / this.pixelSize - 20)));
            const y = this.pixelSize * (10 + Math.floor(Math.random() * (this.canvas.height / this.pixelSize - 20)));
            const size = this.pixelSize * (4 + Math.floor(Math.random() * 4));
            
            this.ctx.fillStyle = symbolColor;
            
            // Elegir un tipo de símbolo al azar
            const symbolType = Math.floor(Math.random() * 4);
            
            switch(symbolType) {
                case 0: // Círculo con cruz
                    this.ctx.fillRect(x - size/2, y - this.pixelSize/2, size, this.pixelSize);
                    this.ctx.fillRect(x - this.pixelSize/2, y - size/2, this.pixelSize, size);
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, size/2 + this.pixelSize, 0, Math.PI * 2);
                    this.ctx.lineWidth = this.pixelSize;
                    this.ctx.strokeStyle = symbolColor;
                    this.ctx.stroke();
                    break;
                    
                case 1: // Triángulo
                    for (let i = 0; i < size/this.pixelSize; i++) {
                        const width = (size - i * this.pixelSize * 2);
                        if (width > 0) {
                            this.ctx.fillRect(x - width/2, y + i * this.pixelSize, width, this.pixelSize);
                        }
                    }
                    break;
                    
                case 2: // Pentágono pixelado
                    this.ctx.fillRect(x - this.pixelSize, y - size/2, this.pixelSize * 2, this.pixelSize);
                    this.ctx.fillRect(x - size/3, y - size/4, this.pixelSize, this.pixelSize * 2);
                    this.ctx.fillRect(x + size/3 - this.pixelSize, y - size/4, this.pixelSize, this.pixelSize * 2);
                    this.ctx.fillRect(x - size/2, y + this.pixelSize, size, this.pixelSize);
                    break;
                    
                case 3: // Símbolo digital
                    // Cruz con pixeles adicionales
                    this.ctx.fillRect(x - size/2, y - this.pixelSize/2, size, this.pixelSize);
                    this.ctx.fillRect(x - this.pixelSize/2, y - size/2, this.pixelSize, size);
                    this.ctx.fillRect(x - size/3, y - size/3, this.pixelSize, this.pixelSize);
                    this.ctx.fillRect(x + size/3, y - size/3, this.pixelSize, this.pixelSize);
                    this.ctx.fillRect(x - size/3, y + size/3, this.pixelSize, this.pixelSize);
                    this.ctx.fillRect(x + size/3, y + size/3, this.pixelSize, this.pixelSize);
                    break;
            }
        }
    }
    
    /**
     * Dibuja elementos cyberpunk en el fondo
     */
    drawCyberpunkElements() {
        // Líneas de circuito
        this.drawCircuitLines();
        
        // Terminales/Pantallas
        this.drawTerminals();
    }
    
    /**
     * Dibuja líneas de circuito en estilo cyberpunk
     */
    drawCircuitLines() {
        const lineColor = '#00f6ff'; // Cyber-teal
        const nodeColor = '#ff005b'; // Cyber-pink
        
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = this.pixelSize / 2;
        
        // Crear varias líneas de circuito
        for (let i = 0; i < 4; i++) {
            // Punto inicial
            const startX = Math.random() > 0.5 ? 0 : this.canvas.width;
            const startY = Math.floor(Math.random() * this.canvas.height / this.pixelSize) * this.pixelSize;
            
            // Punto final
            const endX = startX === 0 ? this.canvas.width : 0;
            const endY = Math.floor(Math.random() * this.canvas.height / this.pixelSize) * this.pixelSize;
            
            // Puntos intermedios
            let currentX = startX;
            let currentY = startY;
            
            // Crear el camino
            this.ctx.beginPath();
            this.ctx.moveTo(currentX, currentY);
            
            // Añadir 3-6 segmentos intermedios
            const segments = 3 + Math.floor(Math.random() * 4);
            
            for (let j = 0; j < segments; j++) {
                // Ir hacia el punto final, con una dirección dominante
                const directionX = endX > currentX ? 1 : -1;
                const directionY = endY > currentY ? 1 : -1;
                
                // Decidir si movernos horizontal o verticalmente
                if (Math.random() > 0.5) {
                    // Mover horizontalmente
                    const moveX = Math.min(
                        Math.abs(endX - currentX), 
                        Math.floor(Math.random() * 100) + 50
                    );
                    currentX += moveX * directionX;
                } else {
                    // Mover verticalmente
                    const moveY = Math.min(
                        Math.abs(endY - currentY), 
                        Math.floor(Math.random() * 100) + 50
                    );
                    currentY += moveY * directionY;
                }
                
                // Ajustar a la cuadrícula de píxeles
                currentX = Math.floor(currentX / this.pixelSize) * this.pixelSize;
                currentY = Math.floor(currentY / this.pixelSize) * this.pixelSize;
                
                // Añadir el punto al camino
                this.ctx.lineTo(currentX, currentY);
                
                // Dibujar nodo
                this.ctx.fillStyle = nodeColor;
                this.ctx.fillRect(
                    currentX - this.pixelSize, 
                    currentY - this.pixelSize, 
                    this.pixelSize * 2, 
                    this.pixelSize * 2
                );
            }
            
            // Completar camino hasta el punto final
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    }
    
    /**
     * Dibuja terminales/pantallas en estilo cyberpunk
     */
    drawTerminals() {
        const terminalBaseColor = '#1a0b22';
        const terminalScreenColor = '#004cff';
        const terminalDetailColor = '#00f6ff';
        
        // Dibujar 2-3 terminales
        const terminalCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < terminalCount; i++) {
            // Posición con bias hacia los bordes
            let x, y;
            
            if (i === 0) {
                // Primer terminal en la parte inferior izquierda
                x = this.pixelSize * (5 + Math.floor(Math.random() * 10));
                y = this.canvas.height - this.pixelSize * (15 + Math.floor(Math.random() * 10));
            } else if (i === 1) {
                // Segundo terminal en la parte inferior derecha
                x = this.canvas.width - this.pixelSize * (15 + Math.floor(Math.random() * 10));
                y = this.canvas.height - this.pixelSize * (15 + Math.floor(Math.random() * 10));
            } else {
                // Otros en posiciones más aleatorias
                x = this.pixelSize * (10 + Math.floor(Math.random() * ((this.canvas.width / this.pixelSize) - 20)));
                y = this.pixelSize * (10 + Math.floor(Math.random() * ((this.canvas.height / this.pixelSize) - 20)));
            }
            
            const width = this.pixelSize * (10 + Math.floor(Math.random() * 6));
            const height = this.pixelSize * (6 + Math.floor(Math.random() * 4));
            
            // Base del terminal
            this.ctx.fillStyle = terminalBaseColor;
            this.ctx.fillRect(x, y, width, height);
            
            // Pantalla
            this.ctx.fillStyle = terminalScreenColor;
            this.ctx.fillRect(
                x + this.pixelSize, 
                y + this.pixelSize, 
                width - this.pixelSize * 2, 
                height - this.pixelSize * 2
            );
            
            // Detalles de la pantalla
            this.ctx.fillStyle = terminalDetailColor;
            
            // Líneas de texto simuladas
            for (let j = 0; j < 3; j++) {
                const lineY = y + this.pixelSize * 2 + j * this.pixelSize * 1.5;
                const lineWidth = Math.floor(Math.random() * (width - this.pixelSize * 4)) + this.pixelSize * 2;
                
                this.ctx.fillRect(
                    x + this.pixelSize * 2,
                    lineY,
                    lineWidth,
                    this.pixelSize / 2
                );
            }
            
            // Borde con efecto neón
            this.ctx.strokeStyle = terminalDetailColor;
            this.ctx.lineWidth = this.pixelSize / 2;
            this.ctx.strokeRect(
                x + this.pixelSize / 2, 
                y + this.pixelSize / 2, 
                width - this.pixelSize, 
                height - this.pixelSize
            );
        }
    }
    
    /**
     * Agrega efectos de iluminación al fondo
     */
    addLighting() {
        // Gradiente radial sutil
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.7
        );
        
        gradient.addColorStop(0, 'rgba(50, 15, 85, 0.3)');
        gradient.addColorStop(0.5, 'rgba(50, 15, 85, 0.1)');
        gradient.addColorStop(1, 'rgba(9, 10, 16, 0.5)');
        
        // Aplicar el gradiente
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Añadir algunos puntos de luz
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = 20 + Math.random() * 30;
            const glow = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            glow.addColorStop(0, 'rgba(255, 0, 91, 0.3)');
            glow.addColorStop(0.5, 'rgba(255, 0, 91, 0.1)');
            glow.addColorStop(1, 'rgba(255, 0, 91, 0)');
            
            this.ctx.fillStyle = glow;
            this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
    }
    
    /**
     * Agrega efecto de niebla digital
     */
    addDigitalMist() {
        // Generar una capa de "niebla" digital pixelada
        const mistCount = 200;
        
        for (let i = 0; i < mistCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = this.pixelSize * (Math.random() > 0.8 ? 2 : 1);
            
            // Colores base para la niebla
            const colors = [
                'rgba(0, 246, 255, 0.1)',  // Cyber-teal
                'rgba(255, 0, 91, 0.1)',   // Cyber-pink
                'rgba(50, 15, 85, 0.1)',   // Cyber-purple
                'rgba(166, 23, 29, 0.1)',  // Gothic-blood
            ];
            
            // Seleccionar un color aleatorio
            this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            // Dibujar el pixel de niebla
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    /**
     * Genera un patrón de fondo simple para usar como fallback
     */
    generateFallbackPattern() {
        const patternSize = 32;
        
        this.canvas.width = patternSize;
        this.canvas.height = patternSize;
        
        // Color base
        this.ctx.fillStyle = this.colors.castleBg[0];
        this.ctx.fillRect(0, 0, patternSize, patternSize);
        
        // Agregar líneas de cuadrícula
        this.ctx.fillStyle = this.colors.castleBg[1];
        this.ctx.fillRect(0, 0, patternSize, 1);
        this.ctx.fillRect(0, 0, 1, patternSize);
        
        // Detalles
        this.ctx.fillStyle = this.colors.castleBg[2];
        this.ctx.fillRect(patternSize - 4, patternSize - 4, 4, 4);
        
        return this.canvas.toDataURL('image/png');
    }
}