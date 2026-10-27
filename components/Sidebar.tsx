
import React from 'react';
import { ModuleType } from '../types';
import BuildingIcon from './icons/BuildingIcon';
import DocumentIcon from './icons/DocumentIcon';
import HomeIcon from './icons/HomeIcon';
import LandIcon from './icons/LandIcon';
import LoanIcon from './icons/LoanIcon';
import PDFIcon from './icons/PDFIcon';

interface SidebarProps {
    activeModule: ModuleType;
    onModuleChange: (module: ModuleType) => void;
}

const moduleIcons: Record<ModuleType, React.ElementType> = {
    [ModuleType.Alquiler]: DocumentIcon,
    [ModuleType.Anticretico]: BuildingIcon,
    [ModuleType.Terreno]: LandIcon,
    [ModuleType.Casa]: HomeIcon,
    [ModuleType.Prestamos]: LoanIcon,
    [ModuleType.PDF]: PDFIcon,
};

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
    return (
        <nav className="w-16 md:w-64 bg-gray-900 border-r border-gray-700 p-2 md:p-4 flex flex-col">
            <div className="flex items-center mb-8">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                 <h1 className="hidden md:block text-xl font-bold ml-3">Asesor AI</h1>
            </div>
            <ul className="space-y-2 flex-grow">
                {Object.values(ModuleType).map((module) => {
                    const Icon = moduleIcons[module];
                    const isActive = activeModule === module;
                    return (
                        <li key={module}>
                            <button
                                onClick={() => onModuleChange(module)}
                                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="hidden md:inline ml-4 font-medium">{module}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
             <div className="mt-auto hidden md:block text-center text-xs text-gray-500">
                <p>&copy; 2024 Asesor Integral AI</p>
                <p>Análisis Legal y Financiero</p>
            </div>
        </nav>
    );
};

export default Sidebar;
