import React from 'react';

interface CrossProps {
    size?: number;
    className?: string;
}

const Cross: React.FC<CrossProps> = ({ size = 24, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2v20M7 8h10" />
        </svg>
    );
};

export default Cross;
