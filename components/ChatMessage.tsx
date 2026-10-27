
import React from 'react';
import { Message, MessageSender, RiskLevel } from '../types';
import RiskIndicator from './RiskIndicator';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAI = message.sender === MessageSender.AI;
    const { riskLevel } = message;

    const formattedText = message.text.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre class="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm my-2">${code.trim()}</pre>`;
    }).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return (
        <div className={`flex items-start gap-4 py-4 ${isAI ? '' : 'justify-end'}`}>
            {isAI && (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">
                    AI
                </div>
            )}
            <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-2xl rounded-lg p-4 ${isAI ? 'bg-gray-700' : 'bg-blue-600'}`}>
                    <div className="text-white whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedText }} />
                </div>
                {isAI && riskLevel && (
                    <div className="mt-2">
                        <RiskIndicator level={riskLevel} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
