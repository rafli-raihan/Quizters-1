import React from 'react';

export default function Header({ user, onLogout }) {
    return (
        <header className="flex justify-between items-center py-4 mb-8 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Quizters</h1>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user.username}</span>
                    <button
                        onClick={onLogout}
                        className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}