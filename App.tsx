
import React, { useState, useCallback } from 'react';
import { ModuleType } from './types';
import Sidebar from './components/Sidebar';
import ModuleRenderer from './components/ModuleRenderer';

const App: React.FC = () => {
    const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.Alquiler);

    const handleModuleChange = useCallback((module: ModuleType) => {
        setActiveModule(module);
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar activeModule={activeModule} onModuleChange={handleModuleChange} />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <ModuleRenderer key={activeModule} activeModule={activeModule} />
            </main>
        </div>
    );
};

export default App;
