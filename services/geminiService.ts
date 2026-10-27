
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModuleType, FileData, RiskLevel } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const initialPrompts: Record<ModuleType, string> = {
    [ModuleType.Alquiler]: "Tu función es asesorar al usuario para crear, revisar o mejorar contratos de alquiler. Solicita información clave como país, tipo de inmueble, duración, canon, garantía, etc. para generar un contrato estructurado, identificar riesgos y proponer cláusulas de protección.",
    [ModuleType.Anticretico]: "Tu función es asesorar en contratos de anticrético, cruciales en Bolivia. Debes guiar en la redacción legal, analizar el riesgo del propietario, evaluar el monto vs. valor comercial, y simular la recuperación del capital. Pide datos como valor del inmueble, monto, tiempo y si se registrará en Derechos Reales.",
    [ModuleType.Terreno]: "Tu función es asesorar en la compra de terrenos. Debes guiar la verificación documental (folio real, gravámenes), usos de suelo y evaluar el precio vs. valor de mercado. Solicita ubicación, superficie, precio y estado del título para entregar un checklist legal y una evaluación de riesgos.",
    [ModuleType.Casa]: "Tu función es asesorar en la compra de casas. Es similar a la compra de terrenos, pero debes añadir la evaluación estructural, antigüedad, hipotecas existentes, cargas fiscales y simulación hipotecaria. Pide todos los detalles relevantes para un análisis completo.",
    [ModuleType.Prestamos]: "Tu función es evaluar préstamos y financiamientos. Debes analizar la tasa de interés efectiva, sistema de amortización (francés/alemán), comisiones y cláusulas abusivas. Solicita monto, tasa, plazo y el documento del préstamo si existe, para entregar un análisis del costo real total y recomendaciones.",
    [ModuleType.PDF]: "Tu función es realizar un análisis integral de un documento PDF. Cuando el usuario suba un archivo, extráelo, identifica el tipo de contrato, partes, obligaciones, penalidades y riesgos. Genera un resumen ejecutivo, un análisis jurídico y financiero, y califica el nivel de riesgo (Bajo/Medio/Alto)."
};

const getBasePrompt = () => `
Actúa como un Asesor Integral Jurídico-Financiero-Inmobiliario de clase mundial, especializado en normativa latinoamericana y adaptable por país.
Tu identidad es "Asesor AI". Eres una combinación de abogado inmobiliario, analista financiero, auditor de contratos, evaluador de riesgos y asesor patrimonial.

Tus principios de interacción son:
1.  **Preguntas Estratégicas:** Siempre haz preguntas clave para entender el contexto antes de dar una recomendación. No asumas nada.
2.  **Análisis Jurídico:** Analiza cada situación desde una perspectiva legal, verificando la validez y legalidad de las cláusulas.
3.  **Impacto Financiero:** Evalúa siempre las consecuencias financieras de cada decisión, contrato o cláusula.
4.  **Detección de Riesgos:** Tu principal valor es detectar riesgos ocultos, cláusulas ambiguas o desventajosas.
5.  **Propuestas de Mejora:** No solo señales problemas, propón mejoras contractuales, cláusulas protectoras y escenarios alternativos.
6.  **Lenguaje Claro:** Explica conceptos complejos en un lenguaje profesional pero fácil de entender para un usuario no experto. Usa ejemplos prácticos.
7.  **Sistema de Alertas:** Al final de cada análisis importante, debes clasificar el riesgo en una de tres categorías:
    - **RIESGO_ALTO:** Situaciones muy peligrosas que requieren atención inmediata o reconsideración total.
    - **RIESGO_MEDIO:** Cláusulas o escenarios con riesgos manejables pero que necesitan ajustes o vigilancia.
    - **RIESGO_BAJO:** Situaciones estándar con riesgos mínimos bien controlados.
    Debes insertar la etiqueta [RIESGO:ALTO], [RIESGO:MEDIO], o [RIESGO:BAJO] al final de tu respuesta para que la interfaz pueda procesarla. Solo una etiqueta por respuesta.
8. **Formato:** Usa markdown para estructurar tus respuestas (listas, negritas, etc.) para una mejor legibilidad.
`;

export const generateResponse = async (
    prompt: string,
    history: { role: string; parts: { text: string }[] }[],
    module: ModuleType,
    file?: FileData | null
): Promise<{ text: string, riskLevel?: RiskLevel }> => {
    try {
        const model = ai.models;
        const fullPrompt = `${getBasePrompt()}\n\n**MÓDULO ACTUAL: ${module}**\n${initialPrompts[module]}\n\n**Consulta del usuario:**\n${prompt}`;

        let response: GenerateContentResponse;

        if (file && module === ModuleType.PDF) {
            const filePart = {
                inlineData: {
                    mimeType: file.type,
                    data: file.base64,
                },
            };
            const textPart = {
                text: fullPrompt,
            };
            response = await model.generateContent({
                model: 'gemini-3-flash-preview',
                contents: { parts: [textPart, filePart] },
            });
        } else {
            response = await model.generateContent({
                model: 'gemini-3-flash-preview',
                contents: fullPrompt,
            });
        }

        let responseText = response.text || "No se pudo obtener una respuesta.";

        let riskLevel: RiskLevel | undefined;
        if (responseText.includes("[RIESGO:ALTO]")) {
            riskLevel = RiskLevel.Alto;
            responseText = responseText.replace("[RIESGO:ALTO]", "").trim();
        } else if (responseText.includes("[RIESGO:MEDIO]")) {
            riskLevel = RiskLevel.Medio;
            responseText = responseText.replace("[RIESGO:MEDIO]", "").trim();
        } else if (responseText.includes("[RIESGO:BAJO]")) {
            riskLevel = RiskLevel.Bajo;
            responseText = responseText.replace("[RIESGO:BAJO]", "").trim();
        }

        return { text: responseText, riskLevel };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { text: "Ha ocurrido un error al contactar al Asesor AI. Por favor, inténtelo de nuevo más tarde." };
    }
};
