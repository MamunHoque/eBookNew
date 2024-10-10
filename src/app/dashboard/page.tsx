// src/app/dashboard/page.tsx
import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </header>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-200 rounded">Panel 1</div>
                <div className="p-4 bg-gray-200 rounded">Panel 2</div>
                <div className="p-4 bg-gray-200 rounded">Panel 3</div>
            </div>
        </div>
    );
}
