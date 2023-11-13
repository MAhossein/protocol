import React from 'react';

interface ErrorProps {
    message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => (
    <div className="bg-red-500 text-white p-3 rounded-md">
        <h1 className="font-semibold">Error</h1>
        <p className="mt-1">{message}</p>
    </div>
);

export default Error;