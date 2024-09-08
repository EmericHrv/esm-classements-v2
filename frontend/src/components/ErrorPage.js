import React from 'react';
import errorImage from '../assets/error-image.svg'; // Import the image

const ErrorPage = ({ message, statusCode }) => {
    return (
        <div className="error-page flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl font-bold text-primary mb-6">
                Oh non ! La frappe a manqué le cadre !
            </h1>
            <img
                src={errorImage}
                alt="Error"
                className="w-1/2 h-auto mb-6 max-w-lg"
            />
            {statusCode && (
                <h2 className="text-xl font-semibold text-black mb-6">
                    Erreur {statusCode}
                </h2>
            )}
            <p className="text-lg text-center max-w-md">
                {message}
            </p>
        </div>
    );
};

export default ErrorPage;
