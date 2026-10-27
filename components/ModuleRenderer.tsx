
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ModuleType, Message, MessageSender, FileData } from '../types';
import ChatMessage from './ChatMessage';
import { generateResponse } from '../services/geminiService';
import Spinner from './Spinner';
import Button from './common/Button';
import PDFIcon from './icons/PDFIcon';

interface ModuleRendererProps {
    activeModule: ModuleType;
}

const moduleWelcomeMessages: Record<ModuleType, string> = {
    [ModuleType.Alquiler]: "Bienvenido al módulo de Contratos de Alquiler. Puedo ayudarte a redactar, revisar o entender un contrato. ¿Qué necesitas hacer hoy?",
    [ModuleType.Anticretico]: "Hola, estás en el módulo de Anticrético. Este es un contrato complejo. Cuéntame qué necesitas: ¿redactar uno nuevo, revisar uno existente o entender los riesgos?",
    [ModuleType.Terreno]: "Bienvenido al módulo de Compra de Terrenos. Comprar tierra es una gran inversión. Dime la ubicación y los detalles que tengas para comenzar el análisis.",
    [ModuleType.Casa]: "Hola, estás en el módulo de Compra de Casa. Te guiaré en el análisis legal, estructural y financiero. ¿Tienes una propiedad en mente?",
    [ModuleType.Prestamos]: "Bienvenido al módulo de Análisis de Préstamos. Puedo ayudarte a entender el costo real de un crédito. Comparte los detalles o sube el documento para empezar.",
    [ModuleType.PDF]: "Hola, este es el módulo de Análisis de Contratos. Por favor, sube tu documento en formato PDF para un análisis jurídico y financiero completo."
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove the data:mime/type;base64, part
        };
        reader.onerror = error => reject(error);
    });
};

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ activeModule }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMessages([{
            sender: MessageSender.AI,
            text: moduleWelcomeMessages[activeModule]
        }]);
        setUploadedFile(null);
        setUserInput('');
    }, [activeModule]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            try {
                const base64 = await fileToBase64(file);
                setUploadedFile({ name: file.name, type: file.type, base64 });
                 setMessages(prev => [...prev, {
                    sender: MessageSender.AI,
                    text: `Archivo "${file.name}" cargado. Ahora, por favor describe qué necesitas que analice en este documento.`
                }]);
            } catch (error) {
                console.error("Error converting file to base64:", error);
                setMessages(prev => [...prev, {
                    sender: MessageSender.AI,
                    text: "Hubo un error al procesar el archivo. Por favor, intenta de nuevo."
                }]);
            }
        }
    };
    
    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Message = { sender: MessageSender.User, text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const history = messages.map(msg => ({
            role: msg.sender === MessageSender.User ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        try {
            const { text, riskLevel } = await generateResponse(userInput, history, activeModule, uploadedFile);
            const aiMessage: Message = { sender: MessageSender.AI, text, riskLevel };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: MessageSender.AI, text: "Lo siento, ha ocurrido un error. Intenta de nuevo." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }

    }, [userInput, isLoading, messages, activeModule, uploadedFile]);

    return (
        <div className="flex flex-col h-full bg-gray-800">
            <header className="p-4 border-b border-gray-700 shadow-md">
                <h2 className="text-xl font-semibold text-white">{activeModule}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6" id="chat-container">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </div>

            <footer className="p-4 md:p-6 border-t border-gray-700 bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    {activeModule === ModuleType.PDF && (
                         <div className="mb-2">
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                             <Button onClick={() => fileInputRef.current?.click()} variant="secondary" Icon={PDFIcon} disabled={!!uploadedFile}>
                                 {uploadedFile ? `Archivo: ${uploadedFile.name}` : 'Seleccionar PDF'}
                             </Button>
                         </div>
                     )}
                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="Escribe tu consulta aquí..."
                            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none px-2"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !userInput.trim()}
                            className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Spinner /> : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ModuleRenderer;
