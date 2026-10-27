
export enum ModuleType {
    Alquiler = "Contratos de Alquiler",
    Anticretico = "Anticrético",
    Terreno = "Compra de Terreno",
    Casa = "Compra de Casa",
    Prestamos = "Análisis de Préstamos",
    PDF = "Análisis de Contratos (PDF)"
}

export enum MessageSender {
    User = "user",
    AI = "ai"
}

export interface Message {
    sender: MessageSender;
    text: string;
    riskLevel?: RiskLevel;
}

export enum RiskLevel {
    Bajo = "Bajo",
    Medio = "Medio",
    Alto = "Alto"
}

export interface FileData {
    name: string;
    type: string;
    base64: string;
}
