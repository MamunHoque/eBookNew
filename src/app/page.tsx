// src/app/page.tsx
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to the Builder App</h1>
            <div className="flex space-x-4">
                <Link href="/builder" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Go to Builder
                </Link>
                <Link href="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
