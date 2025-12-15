import React from 'react';

const DashboardBackground: React.FC = () => {
    return (
        <div
            className="w-full h-full"
            style={{
                backgroundColor: '#111111',
                // A checkerboard pattern that resembles a carbon fiber weave
                backgroundImage: `
                    linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 75%),
                    linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 75%)
                `,
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 5px 5px',
            }}
            aria-hidden="true"
        />
    );
};

export default DashboardBackground;