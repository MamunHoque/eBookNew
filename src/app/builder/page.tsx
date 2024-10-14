"use client";

import dynamic from 'next/dynamic';

const Builder = dynamic(() => import('../../lib/builder/src/Builder'), { ssr: false });

export default function BuilderPage() {
    return (
        <div className="h-screen">
            <Builder />
        </div>
    );
}

/*
if i want to use SSR
"use client";

import React, { useEffect, useState } from 'react';
import Builder from '../../lib/builder/src/Builder';

export default function BuilderPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensures it only runs on the client
    }, []);

    if (!isClient) return null; // Prevents rendering on the server

    return (
        <div className="h-screen">
            <Builder />
        </div>
    );
}*/
