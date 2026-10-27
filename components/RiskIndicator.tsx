
import React from 'react';
import { RiskLevel } from '../types';

interface RiskIndicatorProps {
    level: RiskLevel;
}

const riskConfig = {
    [RiskLevel.Bajo]: { color: 'bg-green-500', text: 'Riesgo Bajo' },
    [RiskLevel.Medio]: { color: 'bg-yellow-500', text: 'Riesgo Medio' },
    [RiskLevel.Alto]: { color: 'bg-red-500', text: 'Riesgo Alto' },
};

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level }) => {
    const config = riskConfig[level];

    if (!config) return null;

    return (
        <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold">
            <span className={`w-3 h-3 rounded-full ${config.color}`}></span>
            <span className="text-white">{config.text}</span>
        </div>
    );
};

export default RiskIndicator;
