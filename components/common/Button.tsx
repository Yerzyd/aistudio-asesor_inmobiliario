
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', Icon, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500",
        secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500"
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
            {Icon && <Icon className="w-5 h-5 mr-2 -ml-1" />}
            {children}
        </button>
    );
};

export default Button;
