// Navigation.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LogIn, UserPlus, LayoutDashboard} from 'lucide-react';

const Navigation = () => {
    return (
        <header className="bg-gray-800 sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-xl font-bold">eBook Builder</div>
                <ul className="flex space-x-6">
                    <li><Link href="/" className="hover:text-green-400 transition-colors flex items-center"><Home className="mr-2" size={18} />Home</Link></li>
                    <li><Link href="/login" className="hover:text-green-400 transition-colors flex items-center"><LogIn className="mr-2" size={18} />Login</Link></li>
                    <li><Link href="/signup" className="hover:text-green-400 transition-colors flex items-center"><UserPlus className="mr-2" size={18} />Signup</Link></li>
                    <li><Link href="/dashboard" className="hover:text-green-400 transition-colors flex items-center"><LayoutDashboard className="mr-2" size={18} />Dashboard</Link></li>
                    <li><Link href="/builder" className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition-colors flex items-center"><LayoutDashboard className="mr-2" size={18} />Try Builder</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navigation;
